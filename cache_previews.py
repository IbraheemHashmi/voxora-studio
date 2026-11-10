import asyncio
from pathlib import Path
import edge_tts
from voices_data import FEATURED_VOICES

CACHE_DIR = Path(__file__).parent / "previews_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

async def pregenerate():
    top_voices = FEATURED_VOICES[:6]
    for v in top_voices:
        vid = v["id"]
        safe_name = vid.replace(":", "_").replace("/", "_")
        fp = CACHE_DIR / f"prev_{safe_name}.mp3"
        if not fp.exists():
            print(f"Generating preview for {v['name']}...")
            try:
                c = edge_tts.Communicate(v["previewText"], vid)
                await c.save(str(fp))
                print(f"Ready: {fp.name}")
            except Exception as e:
                print(f"Failed {vid}: {e}")

if __name__ == "__main__":
    asyncio.run(pregenerate())
