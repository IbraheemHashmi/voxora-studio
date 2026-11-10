# ⚡ VOXORA STUDIO PRO
### Free & Open-Source Neural Voice Generation Studio

**VOXORA** is a self-hosted, high-performance workstation for voiceover synthesis, podcasting, storytelling, and content creation. It delivers **322+ natural neural voices** (featuring high-clarity flagships like Andrew Natural, Ava Natural, Brian Natural, Emma, and Guy) with zero token fees, real-time pacing control, and synchronized `.SRT` subtitle generation.

---

## Key Features

- **322+ Neural Voices**: Extensive library of natural voices across 70+ languages and regional accents.
- **Flagship Audio Quality**: Expressive conversational, narrative, and cinematic voices with instant preview auditioning.
- **Time-Warp Speech Pacer**: Target specific audio runtimes; automatically calculates WPM rates to fit dialogue smoothly without manual audio stretching.
- **Synchronized Subtitles**: Outputs matching `.SRT` subtitle files alongside 24kHz MP3 audio on every generation.
- **Acoustic Controls**: Fine-tune rate (-50% to +100%), pitch adjustments (Hz), and volume levels.
- **Dual-Mirrored Waveform**: Interactive real-time visualizer powered by Web Audio API.
- **100% Free & Self-Hosted**: Runs locally on your machine with no API keys, accounts, or subscription walls required.

---

## Quickstart

### Option 1: 1-Click Launch (Windows)
Double-click `run.bat` or run:
```bash
run.bat
```

### Option 2: Manual Start
```bash
# Clone the repository
git clone https://github.com/IbraheemHashmi/voxora-studio.git
cd voxora-studio

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn server:app --host 127.0.0.1 --port 8000
```
Open **`http://localhost:8000`** in your browser.

---

## Keyboard Shortcuts

- `Ctrl` + `Enter`: Generate speech & synchronized captions
- `Space`: Play / Pause preview (when outside the text editor)
