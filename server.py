import asyncio
import os
import json
import time
import uuid
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import edge_tts
from voices_data import FEATURED_VOICES, get_all_voices, get_voice_by_id

BASE_DIR = Path(__file__).parent.resolve()
CACHE_DIR = BASE_DIR / "audio_cache"
PREVIEWS_DIR = BASE_DIR / "previews_cache"
STATIC_DIR = BASE_DIR / "static"
HISTORY_FILE = BASE_DIR / "history.json"

CACHE_DIR.mkdir(parents=True, exist_ok=True)
PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="VOXORA Studio - Next-Gen Neural Voice & Video Pacing Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_history() -> List[Dict[str, Any]]:
    if not HISTORY_FILE.exists():
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_history(history: List[Dict[str, Any]]) -> None:
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving history: {e}")


def format_rate(rate_val: float) -> str:
    val = int(round(rate_val))
    val = max(-50, min(100, val))
    return f"+{val}%" if val >= 0 else f"{val}%"


def format_pitch(pitch_val: float) -> str:
    val = int(round(pitch_val))
    val = max(-50, min(50, val))
    return f"+{val}Hz" if val >= 0 else f"{val}Hz"


def format_volume(volume_val: float) -> str:
    val = int(round(volume_val))
    val = max(-50, min(50, val))
    return f"+{val}%" if val >= 0 else f"{val}%"


class GenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Script to synthesize")
    voice_id: str = Field("en-US-AndrewNeural", description="Voice short ID")
    rate: float = Field(0.0, description="Speed adjustment in % (-50 to +100)")
    pitch: float = Field(0.0, description="Pitch adjustment in Hz (-50 to +50)")
    volume: float = Field(0.0, description="Volume adjustment in % (-50 to +50)")
    target_duration: Optional[float] = Field(None, description="Target video duration in seconds")


class PacingRequest(BaseModel):
    text: str = Field(..., description="Script text")
    target_seconds: float = Field(..., gt=0, description="Target duration in seconds")


@app.get("/api/voices")
async def list_voices():
    all_voices = get_all_voices()
    return {
        "featured": FEATURED_VOICES,
        "all": all_voices,
        "total": len(all_voices),
        "brand": "VOXORA"
    }


@app.get("/api/voice/{voice_id}")
async def get_voice_info(voice_id: str):
    v = get_voice_by_id(voice_id)
    if not v:
        raise HTTPException(status_code=404, detail="Voice not found")
    return v


@app.post("/api/pacing/calculate")
async def calculate_pacing(req: PacingRequest):
    text = req.text.strip()
    words = len(text.split()) if text else 0
    target_sec = req.target_seconds

    if words == 0:
        return {
            "words": 0,
            "target_seconds": target_sec,
            "recommended_rate": 0,
            "wpm": 0,
            "retention_score": 0,
            "status": "empty",
            "message": "Enter your script text to calculate pacing."
        }

    natural_sec = words / 2.5
    multiplier = natural_sec / target_sec
    recommended_rate = round((multiplier - 1.0) * 100)
    clamped_rate = max(-50, min(100, recommended_rate))

    wpm = round((words / target_sec) * 60)
    ideal_words = round(target_sec * 2.5)

    if 140 <= wpm <= 175:
        status = "optimal"
        score = 98
        msg = f"🔥 Viral Retention Peak ({wpm} WPM). Perfectly locked to your {round(target_sec)}s cut."
    elif 176 <= wpm <= 210:
        status = "fast"
        score = 91
        msg = f"⚡ High-Energy Hook ({wpm} WPM). Punchy pacing tailored for TikTok & Shorts."
    elif wpm > 210:
        status = "too_fast"
        score = 64
        excess = words - ideal_words
        msg = f"⚠️ Over-compressed ({wpm} WPM). Trim ~{excess} words or increase target to {round(natural_sec)}s."
    elif 115 <= wpm < 140:
        status = "relaxed"
        score = 88
        msg = f"🧘 Cinematic Flow ({wpm} WPM). Deep narrative style with room for B-roll breathing."
    else:
        status = "too_slow"
        score = 55
        deficit = ideal_words - words
        msg = f"⚠️ Under-paced ({wpm} WPM). Add ~{deficit} words to maintain audience engagement."

    return {
        "words": words,
        "target_seconds": target_sec,
        "natural_seconds": round(natural_sec, 1),
        "multiplier": round(multiplier, 2),
        "recommended_rate": clamped_rate,
        "is_clamped": recommended_rate != clamped_rate,
        "wpm": wpm,
        "retention_score": score,
        "ideal_words": ideal_words,
        "status": status,
        "message": msg
    }


@app.post("/api/generate")
async def generate_speech(req: GenerateRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    voice_id = req.voice_id or "en-US-AndrewNeural"
    voice_info = get_voice_by_id(voice_id)

    rate_str = format_rate(req.rate)
    pitch_str = format_pitch(req.pitch)
    volume_str = format_volume(req.volume)

    gen_id = str(uuid.uuid4())
    audio_filename = f"voxora_{gen_id}.mp3"
    srt_filename = f"voxora_{gen_id}.srt"
    audio_path = CACHE_DIR / audio_filename
    srt_path = CACHE_DIR / srt_filename

    t0 = time.time()
    audio_bytes = b""
    submaker = edge_tts.SubMaker()

    try:
        communicate = edge_tts.Communicate(
            text=text,
            voice=voice_id,
            rate=rate_str,
            pitch=pitch_str,
            volume=volume_str
        )

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_bytes += chunk["data"]
            elif chunk["type"] == "SentenceBoundary":
                submaker.feed(chunk)

        with open(audio_path, "wb") as f:
            f.write(audio_bytes)

        srt_content = submaker.get_srt()
        if not srt_content.strip():
            duration_est = max(1.5, len(text.split()) / 2.5)
            srt_content = f"1\n00:00:00,000 --> 00:00:{int(duration_est):02d},500\n{text}\n"

        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(srt_content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Synthesis failed: {str(e)}")

    elapsed_ms = int((time.time() - t0) * 1000)
    file_size_bytes = audio_path.stat().st_size if audio_path.exists() else 0

    word_count = len(text.split())
    estimated_seconds = max(1.0, round(file_size_bytes / 6000.0, 1))

    item = {
        "id": gen_id,
        "filename": audio_filename,
        "audio_url": f"/audio/{audio_filename}",
        "srt_url": f"/audio/{srt_filename}",
        "srt_content": srt_content,
        "text": text,
        "voice_id": voice_id,
        "voice_name": voice_info["name"] if voice_info else voice_id,
        "voice_flag": voice_info.get("flag", "🌐") if voice_info else "🌐",
        "voice_gradient": voice_info.get("gradient") if voice_info else None,
        "rate": req.rate,
        "pitch": req.pitch,
        "volume": req.volume,
        "characters": len(text),
        "words": word_count,
        "wpm": round((word_count / (estimated_seconds / 60.0))) if estimated_seconds > 0 else 150,
        "file_size": file_size_bytes,
        "estimated_duration": estimated_seconds,
        "target_duration": req.target_duration,
        "generation_time_ms": elapsed_ms,
        "created_at": datetime.now().isoformat()
    }

    history = load_history()
    history.insert(0, item)
    save_history(history[:100])

    return item


@app.get("/api/preview/{voice_id}")
async def get_voice_preview(voice_id: str):
    safe_name = voice_id.replace(":", "_").replace("/", "_")
    preview_file = PREVIEWS_DIR / f"prev_{safe_name}.mp3"

    if not preview_file.exists():
        voice_info = get_voice_by_id(voice_id)
        phrase = voice_info.get("previewText") if voice_info else f"Hello, I am {voice_id}."
        try:
            communicate = edge_tts.Communicate(text=phrase, voice=voice_id)
            await communicate.save(str(preview_file))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Preview generation failed: {str(e)}")

    return {
        "voice_id": voice_id,
        "audio_url": f"/previews/prev_{safe_name}.mp3"
    }


@app.get("/api/history")
async def get_history():
    return load_history()


@app.delete("/api/history/{item_id}")
async def delete_history_item(item_id: str):
    history = load_history()
    target = None
    remaining = []
    for h in history:
        if h.get("id") == item_id:
            target = h
        else:
            remaining.append(h)

    if not target:
        raise HTTPException(status_code=404, detail="Item not found")

    save_history(remaining)

    for suffix in [".mp3", ".srt"]:
        filename = target.get("filename", "").replace(".mp3", suffix)
        if filename:
            fp = CACHE_DIR / filename
            if fp.exists():
                try:
                    fp.unlink()
                except Exception:
                    pass

    return {"success": True, "deleted_id": item_id}


@app.delete("/api/history")
async def clear_history():
    history = load_history()
    for h in history:
        for suffix in [".mp3", ".srt"]:
            filename = h.get("filename", "").replace(".mp3", suffix)
            if filename:
                fp = CACHE_DIR / filename
                if fp.exists():
                    try:
                        fp.unlink()
                    except Exception:
                        pass
    save_history([])
    return {"success": True, "cleared": len(history)}


@app.get("/api/stats")
async def get_stats():
    history = load_history()
    total_chars = sum(h.get("characters", 0) for h in history)
    total_words = sum(h.get("words", 0) for h in history)
    total_generations = len(history)

    return {
        "studio": "VOXORA PRO",
        "total_generations": total_generations,
        "total_characters": total_chars,
        "total_words": total_words,
        "voices_count": len(get_all_voices()),
        "engine": "Ultra-Fidelity Neural Core",
        "features": ["Auto-Pacer Retention Engine", "CapCut / Premiere Pro SRT Generator", "Dual Neon Spectrum"],
        "cost": "$0.00 (Unlimited Free Access)",
        "status": "Online & Ready"
    }


# Static file mounts
app.mount("/audio", StaticFiles(directory=str(CACHE_DIR)), name="audio")
app.mount("/previews", StaticFiles(directory=str(PREVIEWS_DIR)), name="previews")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
async def root():
    return FileResponse(str(STATIC_DIR / "index.html"))
