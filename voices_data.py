"""
Voice definitions and metadata catalog for VOXORA STUDIO PRO.
Crimson & Burgundy Master Edition.
Curated flagship voices (Andrew Natural, Ava, Brian, etc.)
and the full catalog of 322 realistic neural voices.
"""
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

FEATURED_VOICES: List[Dict[str, Any]] = [
    {
        "id": "en-US-AndrewNeural",
        "name": "Andrew Natural",
        "gender": "Male",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Conversational",
        "badge": "Copilot Flagship",
        "description": "Warm, confident, and deeply authentic voice. Outstanding for podcasts, conversational AI, and executive voiceovers.",
        "traits": ["Warm", "Confident", "Authentic", "Natural"],
        "previewText": "Hello! I am Andrew Natural, a warm and authentic voice crafted for your most engaging content.",
        "gradient": "linear-gradient(135deg, #ff1e42, #9f1239)",
        "accentColor": "#ff1e42"
    },
    {
        "id": "en-US-AvaNeural",
        "name": "Ava Natural",
        "gender": "Female",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Conversational",
        "badge": "Ultra Realistic",
        "description": "Expressive, radiant, and warm conversational female voice. Natural inflection and emotional range.",
        "traits": ["Expressive", "Warm", "Friendly", "Engaging"],
        "previewText": "Hi there! I'm Ava Natural. I bring natural warmth and emotion to stories, tutorials, and conversations.",
        "gradient": "linear-gradient(135deg, #f43f5e, #881337)",
        "accentColor": "#f43f5e"
    },
    {
        "id": "en-US-BrianNeural",
        "name": "Brian Natural",
        "gender": "Male",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Narrative",
        "badge": "Deep Narrator",
        "description": "Deep, resonant, and captivating narrator voice. Perfect for audiobooks, documentaries, and essays.",
        "traits": ["Deep", "Narrative", "Calm", "Resonant"],
        "previewText": "Greetings. I am Brian Natural. My voice is tailored for immersive storytelling, audiobooks, and documentaries.",
        "gradient": "linear-gradient(135deg, #dc2626, #450a0a)",
        "accentColor": "#dc2626"
    },
    {
        "id": "en-US-EmmaNeural",
        "name": "Emma Natural",
        "gender": "Female",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Professional",
        "badge": "Clear & Polished",
        "description": "Pleasant, articulate, and crystal clear. Excellent for educational videos, tutorials, and product walkthroughs.",
        "traits": ["Articulate", "Pleasant", "Professional", "Crisp"],
        "previewText": "Welcome! I am Emma Natural. I provide clear, articulate, and professional narration for your projects.",
        "gradient": "linear-gradient(135deg, #fb7185, #9f1239)",
        "accentColor": "#fb7185"
    },
    {
        "id": "en-US-GuyNeural",
        "name": "Guy Natural",
        "gender": "Male",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Casual",
        "badge": "Podcast Host",
        "description": "Relatable, casual, and energetic. The classic modern YouTube and podcast voice.",
        "traits": ["Casual", "Relatable", "Upbeat", "Modern"],
        "previewText": "Hey what's going on! I'm Guy Natural, ready to make your podcasts and videos sound effortless and engaging.",
        "gradient": "linear-gradient(135deg, #f59e0b, #b91c1c)",
        "accentColor": "#f59e0b"
    },
    {
        "id": "en-US-JennyNeural",
        "name": "Jenny Natural",
        "gender": "Female",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Assistant",
        "badge": "Smooth Assistant",
        "description": "Gentle, balanced, and calming voice. Loved for customer service, meditation, and AI assistants.",
        "traits": ["Gentle", "Balanced", "Friendly", "Calm"],
        "previewText": "Hello! I am Jenny Natural. Whether it's an assistant or a friendly guide, I'm here to help.",
        "gradient": "linear-gradient(135deg, #e11d48, #4c0519)",
        "accentColor": "#e11d48"
    },
    {
        "id": "en-US-ChristopherNeural",
        "name": "Christopher Natural",
        "gender": "Male",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Cinematic",
        "badge": "Cinematic Epic",
        "description": "Authoritative, rich, and dramatic. Gives trailers and cinematic scenes tremendous weight and presence.",
        "traits": ["Authoritative", "Dramatic", "Rich", "Cinematic"],
        "previewText": "In a world of infinite sound, I am Christopher Natural, built to give your words cinematic impact.",
        "gradient": "linear-gradient(135deg, #e11d48, #1c050a)",
        "accentColor": "#e11d48"
    },
    {
        "id": "en-US-AriaNeural",
        "name": "Aria Natural",
        "gender": "Female",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Broadcast",
        "badge": "News & Media",
        "description": "Dynamic, broadcast-grade delivery with pristine clarity. Superb for news, announcements, and briefings.",
        "traits": ["Dynamic", "Clear", "Broadcast", "Informative"],
        "previewText": "This is Aria Natural, delivering crisp, authoritative audio for news, reports, and modern media.",
        "gradient": "linear-gradient(135deg, #f43f5e, #670820)",
        "accentColor": "#f43f5e"
    },
    {
        "id": "en-GB-RyanNeural",
        "name": "Ryan Natural (British)",
        "gender": "Male",
        "locale": "en-GB",
        "localeName": "English (UK)",
        "flag": "🇬🇧",
        "category": "Sophisticated",
        "badge": "British Gent",
        "description": "Smooth, refined, and distinguished British accent. Ideal for high-end commercials and history documentaries.",
        "traits": ["Distinguished", "Refined", "Smooth", "British"],
        "previewText": "Good day. I am Ryan Natural, offering a refined British delivery for your finest productions.",
        "gradient": "linear-gradient(135deg, #be123c, #4c0519)",
        "accentColor": "#be123c"
    },
    {
        "id": "en-GB-SoniaNeural",
        "name": "Sonia Natural (British)",
        "gender": "Female",
        "locale": "en-GB",
        "localeName": "English (UK)",
        "flag": "🇬🇧",
        "category": "Elegant",
        "badge": "British Elegance",
        "description": "Articulate, elegant, and crisp British female voice. Perfect for luxury branding and narration.",
        "traits": ["Elegant", "Articulate", "Crisp", "Warm"],
        "previewText": "Hello there. I am Sonia Natural, bringing British elegance and clarity to your narration.",
        "gradient": "linear-gradient(135deg, #ff1e42, #831843)",
        "accentColor": "#ff1e42"
    },
    {
        "id": "en-AU-WilliamMultilingualNeural",
        "name": "William Natural (Aussie)",
        "gender": "Male",
        "locale": "en-AU",
        "localeName": "English (Australia)",
        "flag": "🇦🇺",
        "category": "Casual",
        "badge": "Aussie Charm",
        "description": "Friendly, approachable, and authentic Australian male voice.",
        "traits": ["Approachable", "Friendly", "Warm", "Australian"],
        "previewText": "G'day! I'm William Natural, bringing an easy-going Australian touch to your audio projects.",
        "gradient": "linear-gradient(135deg, #ea580c, #7f1d1d)",
        "accentColor": "#ea580c"
    },
    {
        "id": "en-IN-NeerjaNeural",
        "name": "Neerja Natural (Indian)",
        "gender": "Female",
        "locale": "en-IN",
        "localeName": "English (India)",
        "flag": "🇮🇳",
        "category": "Melodious",
        "badge": "Melodious",
        "description": "Clear, melodious, and natural Indian English female voice.",
        "traits": ["Melodious", "Expressive", "Friendly", "Clear"],
        "previewText": "Namaste! I am Neerja Natural, ready to narrate your content with warmth and expressive clarity.",
        "gradient": "linear-gradient(135deg, #f97316, #991b1b)",
        "accentColor": "#f97316"
    },
    {
        "id": "en-US-EricNeural",
        "name": "Eric Natural",
        "gender": "Male",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Energetic",
        "badge": "Dynamic & Youthful",
        "description": "Upbeat, energetic, and contemporary American voice. Great for ads and tech promos.",
        "traits": ["Energetic", "Modern", "Dynamic", "Confident"],
        "previewText": "Hey! I'm Eric Natural. If you need punchy, energetic voiceovers, I've got you covered.",
        "gradient": "linear-gradient(135deg, #e11d48, #881337)",
        "accentColor": "#e11d48"
    },
    {
        "id": "en-US-AnaNeural",
        "name": "Ana Natural",
        "gender": "Female",
        "locale": "en-US",
        "localeName": "English (US)",
        "flag": "🇺🇸",
        "category": "Animated",
        "badge": "Youthful & Bright",
        "description": "Youthful, cheerful, and bright voice. Ideal for children's stories, games, and animation.",
        "traits": ["Youthful", "Cheerful", "Bright", "Playful"],
        "previewText": "Hi! I am Ana Natural, full of enthusiasm and fun for storytelling and animation!",
        "gradient": "linear-gradient(135deg, #fda4af, #be123c)",
        "accentColor": "#fda4af"
    }
]

_ALL_VOICES_CACHE = None

def get_locale_flag(locale: str) -> str:
    mapping = {
        "en-US": "🇺🇸", "en-GB": "🇬🇧", "en-AU": "🇦🇺", "en-CA": "🇨🇦",
        "en-IN": "🇮🇳", "en-IE": "🇮🇪", "en-NZ": "🇳🇿", "en-ZA": "🇿🇦",
        "es-ES": "🇪🇸", "es-MX": "🇲🇽", "fr-FR": "🇫🇷", "fr-CA": "🇨🇦",
        "de-DE": "🇩🇪", "it-IT": "🇮🇹", "ja-JP": "🇯🇵", "ko-KR": "🇰🇷",
        "pt-BR": "🇧🇷", "pt-PT": "🇵🇹", "zh-CN": "🇨🇳", "zh-TW": "🇹🇼",
        "ru-RU": "🇷🇺", "ar-SA": "🇸🇦", "ar-EG": "🇪🇬", "hi-IN": "🇮🇳",
        "nl-NL": "🇳🇱", "pl-PL": "🇵🇱", "tr-TR": "🇹🇷", "sv-SE": "🇸🇪",
        "da-DK": "🇩🇰", "fi-FI": "🇫🇮", "no-NO": "🇳🇴", "cs-CZ": "🇨🇿",
        "el-GR": "🇬🇷", "he-IL": "🇮🇱", "id-ID": "🇮🇩", "th-TH": "🇹🇭",
        "vi-VN": "🇻🇳", "uk-UA": "🇺🇦", "ro-RO": "🇷🇴", "hu-HU": "🇭🇺"
    }
    return mapping.get(locale, "🌐")


def get_all_voices() -> List[Dict[str, Any]]:
    global _ALL_VOICES_CACHE
    if _ALL_VOICES_CACHE is not None:
        return _ALL_VOICES_CACHE

    raw_path = Path(__file__).parent / "voices_raw.json"
    if not raw_path.exists():
        return FEATURED_VOICES

    try:
        with open(raw_path, "r", encoding="utf-8") as f:
            raw = json.load(f)
    except Exception:
        return FEATURED_VOICES

    featured_ids = {v["id"] for v in FEATURED_VOICES}
    enriched = []
    enriched.extend(FEATURED_VOICES)

    for item in raw:
        v_id = item.get("ShortName")
        if not v_id or v_id in featured_ids:
            continue

        locale = item.get("Locale", "en-US")
        locale_name = item.get("LocaleName", locale)
        gender = item.get("Gender", "Unknown")
        friendly = item.get("FriendlyName", v_id)

        name = v_id
        if " - " in friendly:
            parts = friendly.split(" - ")[0].replace("Microsoft ", "").replace(" Online (Natural)", "")
            name = f"{parts} Natural"

        tags = item.get("VoiceTag", {}).get("VoicePersonalities", [])
        if not tags:
            tags = ["Natural", "Neural"]

        flag = get_locale_flag(locale)
        grad = "linear-gradient(135deg, #4c0519, #1c050a)" if gender == "Male" else "linear-gradient(135deg, #9f1239, #2a050d)"

        enriched.append({
            "id": v_id,
            "name": name,
            "gender": gender,
            "locale": locale,
            "localeName": locale_name,
            "flag": flag,
            "category": "General",
            "badge": "Neural",
            "description": f"{gender} voice for {locale_name}.",
            "traits": tags[:3],
            "previewText": f"Hello, I am {name}, speaking in {locale_name}.",
            "gradient": grad,
            "accentColor": "#ff1e42"
        })

    _ALL_VOICES_CACHE = enriched
    return _ALL_VOICES_CACHE


def get_voice_by_id(voice_id: str) -> Optional[Dict[str, Any]]:
    voices = get_all_voices()
    for v in voices:
        if v["id"].lower() == voice_id.lower():
            return v
    return FEATURED_VOICES[0]
