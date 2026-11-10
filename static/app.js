/**
 * VOXORA STUDIO PRO - Client Application Engine
 * Next-Gen Neural Voice Synthesis & Faceless Video Pacer
 */

// Application State
const state = {
  voices: { featured: [], all: [] },
  selectedVoice: null,
  settings: { speed: 0, pitch: 0, volume: 0 },
  audioUrl: null,
  srtUrl: null,
  srtContent: null,
  isPlaying: false,
  history: [],
  currentTab: 'studio',
  audioCtx: null,
  analyser: null,
  sourceNode: null,
  activePreviewVoiceId: null,

  // Faceless Video Time-Warp Auto-Pacer State
  pacerEnabled: true,
  targetDurationSeconds: 60,
  pacingCalc: null
};

// Faceless Video Hook Presets
const PROMPT_TEMPLATES = {
  faceless_hook: "Here is the dark truth about why 99% of people fail before they even start. In 1971, psychologists discovered a hidden cognitive loop that tricks your brain into mistaking motion for real progress. When you watch tutorials or write endless to-do lists, your dopamine spikes as if you actually accomplished the goal. But here is the fix: stop planning in secret. Take one single uncomfortable action before noon every day, and watch what happens to your life.",
  mystery: "In the summer of 1994, a luxury yacht was discovered drifting sixty miles off the coast of Florida. The engine was running, dinner was still warm on the table, and yet everyone on board had vanished into thin air. Thirty years later, declassified naval logs revealed something that officials swore never existed.",
  wealth: "The wealthiest one percent use a legal banking loophole that almost nobody talks about. Instead of taking a salary and paying fifty percent in taxes, they take out low-interest loans against their assets. Since debt isn't taxable income, they live like kings while paying near zero. Here is how you can use the exact same playbook.",
  psychology: "If you want to read someone's true intentions in ten seconds, watch their feet instead of their eyes. Evolutionary psychologists proved that humans learned to lie with their facial expressions millions of years after their bodies learned to flee from danger. Here are three psychological cues that never lie.",
  tech: "By the end of this year, three entire industries are going to be completely unrecognizable. AI models can now reason across video, code, and live audio in real-time. But the creators who understand how to orchestrate these models will generate more wealth than traditional media companies.",
  full_short: "Stop scrolling if you want to fix your focus. Your attention span didn't shrink because of social media—it broke because your brain is over-stimulated from dopamine stacking. For the next seven days, don't touch your phone for the first 30 minutes after waking up. It will feel painful for forty-eight hours, but by day four, your mental clarity will feel like a superpower. Save this video and try it tomorrow."
};

// Flagship voices for the Quick Switch Strip
const QUICK_STRIP_IDS = [
  'en-US-AndrewNeural',
  'en-US-AvaNeural',
  'en-US-BrianNeural',
  'en-US-EmmaNeural',
  'en-US-GuyNeural',
  'en-US-ChristopherNeural'
];

// DOM Elements
const elements = {
  navPills: document.querySelectorAll('.nav-pill'),
  tabViews: document.querySelectorAll('.tab-view'),
  voiceCountBadge: document.getElementById('voice-count-badge'),
  historyCountBadge: document.getElementById('history-count-badge'),
  
  // Quick Switch Voice Strip & Active Hero
  quickVoiceCards: document.getElementById('quick-voice-cards'),
  btnOpenMatrix: document.getElementById('btn-open-matrix'),
  activeVoiceHero: document.getElementById('active-voice-hero'),
  btnChangeVoice: document.getElementById('btn-change-voice'),
  quickVoiceSelect: document.getElementById('quick-voice-select'),
  currentAvatar: document.getElementById('current-avatar'),
  currentVoiceName: document.getElementById('current-voice-name'),
  currentVoiceFlag: document.getElementById('current-voice-flag'),
  currentVoiceBadge: document.getElementById('current-voice-badge'),
  currentVoiceTraits: document.getElementById('current-voice-traits'),
  btnQuickPreview: document.getElementById('btn-quick-preview'),
  miniWave: document.getElementById('mini-wave'),

  // Time-Warp Video Pacer
  pacerEnabled: document.getElementById('pacer-enabled'),
  targetChips: document.querySelectorAll('.target-chip'),
  customMin: document.getElementById('custom-min'),
  customSec: document.getElementById('custom-sec'),
  btnApplyCustom: document.getElementById('btn-apply-custom'),
  metricWords: document.getElementById('metric-words'),
  metricTarget: document.getElementById('metric-target'),
  metricRate: document.getElementById('metric-rate'),
  metricWpm: document.getElementById('metric-wpm'),
  metricScore: document.getElementById('metric-score'),
  feedbackIndicator: document.getElementById('feedback-indicator'),
  feedbackText: document.getElementById('feedback-text'),
  btnSyncPace: document.getElementById('btn-sync-pace'),

  // Acoustic Tuning Drawer
  settingsDrawer: document.getElementById('settings-drawer'),
  drawerToggle: document.getElementById('drawer-toggle'),
  settingsSummary: document.getElementById('settings-summary'),
  speedSlider: document.getElementById('speed-slider'),
  speedVal: document.getElementById('speed-val'),
  pitchSlider: document.getElementById('pitch-slider'),
  pitchVal: document.getElementById('pitch-val'),
  volumeSlider: document.getElementById('volume-slider'),
  volumeVal: document.getElementById('volume-val'),

  // Script Workspace
  scriptInput: document.getElementById('script-input'),
  charCount: document.getElementById('char-count'),
  wordCount: document.getElementById('word-count'),
  estTime: document.getElementById('est-time'),
  btnInsertPause: document.getElementById('btn-insert-pause'),
  btnPaste: document.getElementById('btn-paste'),
  btnClear: document.getElementById('btn-clear'),
  subChips: document.querySelectorAll('.sub-chip'),

  // Master Generate Button
  btnGenerate: document.getElementById('btn-generate'),

  // Floating Player Deck
  playerDock: document.getElementById('player-dock'),
  dockFlag: document.getElementById('dock-flag'),
  dockVoiceName: document.getElementById('dock-voice-name'),
  dockGenStat: document.getElementById('dock-gen-stat'),
  btnDownloadSrt: document.getElementById('btn-download-srt'),
  btnDownload: document.getElementById('btn-download'),
  btnCopySrt: document.getElementById('btn-copy-srt'),
  btnPlayPause: document.getElementById('btn-play-pause'),
  playIcon: document.getElementById('play-icon'),
  pauseIcon: document.getElementById('pause-icon'),
  timeCurrent: document.getElementById('time-current'),
  timeTotal: document.getElementById('time-total'),
  progressTrack: document.getElementById('progress-track'),
  progressFill: document.getElementById('progress-fill'),
  progressThumb: document.getElementById('progress-thumb'),
  btnPlaybackSpeed: document.getElementById('btn-playback-speed'),
  speedMenu: document.getElementById('speed-menu'),
  btnMute: document.getElementById('btn-mute'),
  volHigh: document.getElementById('vol-high'),
  volMuted: document.getElementById('vol-muted'),
  playerVolume: document.getElementById('player-volume'),
  audioEngine: document.getElementById('audio-engine'),
  waveformCanvas: document.getElementById('waveform-canvas'),

  // Voice Selection Modal Flyout
  voiceModal: document.getElementById('voice-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalVoiceSearch: document.getElementById('modal-voice-search'),
  modalVoicesList: document.getElementById('modal-voices-list'),
  sheetChips: document.querySelectorAll('.sheet-chip'),

  // Matrix Tab
  voiceSearch: document.getElementById('voice-search'),
  filterPills: document.querySelectorAll('.filter-pill'),
  voicesGrid: document.getElementById('voices-grid'),

  // Vault Tab
  historyList: document.getElementById('history-list'),
  btnClearHistory: document.getElementById('btn-clear-history'),

  // Toast
  toast: document.getElementById('toast'),
  logoRefresh: document.getElementById('logo-refresh')
};

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupHeroCard();
  setupTimeWarpPacer();
  setupTuningDrawer();
  setupScriptWorkspace();
  setupMasterSynthesis();
  setupAudioEngine();
  setupMirroredWaveform();
  setupVoiceModal();
  setupVoiceMatrix();
  setupVault();
  setupShortcuts();

  // Load catalog and previous history
  await loadVoiceCatalog();
  await loadVault();

  // Initial calculation
  calculatePacing();
});

// ==========================================================================
// Voice Catalog & Quick Switch Strip
// ==========================================================================

async function loadVoiceCatalog() {
  try {
    const res = await fetch('/api/voices');
    if (!res.ok) throw new Error('Catalog connection failed');
    const data = await res.json();
    state.voices = data;
    elements.voiceCountBadge.textContent = data.total || 322;

    renderQuickVoiceStrip();
    populateQuickVoiceSelect();

    // Default to Andrew Natural (Flagship)
    const andrew = data.featured.find(v => v.id.includes('Andrew')) || data.featured[0];
    activateVoice(andrew);
    renderVoiceMatrix('featured');
  } catch (err) {
    showToast('Voice Matrix loading error: ' + err.message);
  }
}

function populateQuickVoiceSelect() {
  if (!elements.quickVoiceSelect) return;
  elements.quickVoiceSelect.innerHTML = '';

  const groupFeatured = document.createElement('optgroup');
  groupFeatured.label = '⭐ Flagship Realistic Voices';

  const featuredIds = new Set();
  (state.voices.featured || []).forEach(v => {
    featuredIds.add(v.id);
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.flag || '🌐'} ${v.name}`;
    if (state.selectedVoice && state.selectedVoice.id === v.id) {
      opt.selected = true;
    }
    groupFeatured.appendChild(opt);
  });
  elements.quickVoiceSelect.appendChild(groupFeatured);

  if (state.voices.all && state.voices.all.length > 0) {
    const groupUS = document.createElement('optgroup');
    groupUS.label = '🇺🇸 English (US) Neural';

    const groupUK = document.createElement('optgroup');
    groupUK.label = '🇬🇧 English (UK / Global) Neural';

    const groupWorld = document.createElement('optgroup');
    groupWorld.label = '🌐 International Neural Voices';

    state.voices.all.filter(v => !featuredIds.has(v.id)).forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.flag || '🌐'} ${v.name} (${v.localeName || v.locale})`;
      if (state.selectedVoice && state.selectedVoice.id === v.id) {
        opt.selected = true;
      }

      if (v.locale === 'en-US') {
        groupUS.appendChild(opt);
      } else if (v.locale && (v.locale.startsWith('en-') || v.locale === 'en-GB' || v.locale === 'en-AU' || v.locale === 'en-CA')) {
        groupUK.appendChild(opt);
      } else {
        groupWorld.appendChild(opt);
      }
    });

    if (groupUS.children.length > 0) elements.quickVoiceSelect.appendChild(groupUS);
    if (groupUK.children.length > 0) elements.quickVoiceSelect.appendChild(groupUK);
    if (groupWorld.children.length > 0) elements.quickVoiceSelect.appendChild(groupWorld);
  }
}

function renderQuickVoiceStrip() {
  elements.quickVoiceCards.innerHTML = '';
  if (!state.voices.featured) return;

  const quickVoices = state.voices.featured.filter(v => QUICK_STRIP_IDS.includes(v.id));

  quickVoices.forEach(v => {
    const card = document.createElement('div');
    card.className = 'quick-voice-card';
    if (state.selectedVoice && state.selectedVoice.id === v.id) {
      card.classList.add('active');
    }

    const initials = v.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    const grad = v.gradient || 'linear-gradient(135deg, #ff1e42, #881337)';

    card.innerHTML = `
      <div class="quick-v-avatar" style="background: ${grad};">${initials}</div>
      <span class="quick-v-name">${v.name.replace(' Natural', '')}</span>
      <span class="quick-v-flag">${v.flag || '🌐'}</span>
    `;

    card.addEventListener('click', () => {
      activateVoice(v);
      updateQuickStripActive();
    });

    elements.quickVoiceCards.appendChild(card);
  });
}

function updateQuickStripActive() {
  const cards = elements.quickVoiceCards.querySelectorAll('.quick-voice-card');
  const quickVoices = state.voices.featured.filter(v => QUICK_STRIP_IDS.includes(v.id));

  cards.forEach((card, idx) => {
    const v = quickVoices[idx];
    if (v && state.selectedVoice && v.id === state.selectedVoice.id) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function activateVoice(voice) {
  if (!voice) return;
  state.selectedVoice = voice;

  const initials = voice.name.split(' ').map(n => n[0]).slice(0, 2).join('');
  if (elements.currentAvatar) {
    elements.currentAvatar.textContent = initials;
    if (voice.gradient) {
      elements.currentAvatar.style.background = voice.gradient;
    }
  }
  if (elements.currentVoiceName) elements.currentVoiceName.textContent = voice.name;
  if (elements.currentVoiceFlag) elements.currentVoiceFlag.textContent = voice.flag || '🌐';
  if (elements.currentVoiceBadge) elements.currentVoiceBadge.textContent = voice.badge || 'Neural Voice';

  if (elements.currentVoiceTraits) {
    elements.currentVoiceTraits.innerHTML = '';
    const traits = voice.traits || ['Natural', 'Neural'];
    traits.forEach(t => {
      const span = document.createElement('span');
      span.className = 'trait-tag';
      span.textContent = t;
      elements.currentVoiceTraits.appendChild(span);
    });
    const locSpan = document.createElement('span');
    locSpan.className = 'trait-tag locale-tag';
    locSpan.textContent = voice.localeName || voice.locale;
    elements.currentVoiceTraits.appendChild(locSpan);
  }

  if (elements.dockFlag) elements.dockFlag.textContent = voice.flag || '🌐';
  if (elements.dockVoiceName) elements.dockVoiceName.textContent = voice.name;

  if (elements.quickVoiceSelect) {
    let opt = elements.quickVoiceSelect.querySelector(`option[value="${voice.id}"]`);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = voice.id;
      opt.textContent = `${voice.flag || '🌐'} ${voice.name} (${voice.localeName || voice.locale})`;
      elements.quickVoiceSelect.appendChild(opt);
    }
    elements.quickVoiceSelect.value = voice.id;
  }

  updateQuickStripActive();
  showToast(`VOXORA Voice Activated: ${voice.name}`);
}

function setupHeroCard() {
  if (elements.btnQuickPreview) {
    elements.btnQuickPreview.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.selectedVoice) return;
      playVoicePreview(state.selectedVoice.id);
    });
  }
}

async function playVoicePreview(voiceId) {
  try {
    elements.miniWave.classList.add('playing');
    state.activePreviewVoiceId = voiceId;

    const res = await fetch(`/api/preview/${encodeURIComponent(voiceId)}`);
    if (!res.ok) throw new Error('Preview synthesis failed');
    const data = await res.json();

    loadAndPlayAudio(data.audio_url, {
      title: `Sample: ${voiceId}`,
      stat: 'Audition Preview'
    });
  } catch (err) {
    showToast('Failed to audition: ' + err.message);
  } finally {
    setTimeout(() => {
      elements.miniWave.classList.remove('playing');
    }, 1500);
  }
}

// ==========================================================================
// Tab Navigation
// ==========================================================================

function setupNavigation() {
  elements.navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = pill.dataset.tab;
      elements.navPills.forEach(p => p.classList.remove('active'));
      elements.tabViews.forEach(v => v.classList.remove('active'));

      pill.classList.add('active');
      const view = document.getElementById(`tab-${target}`);
      if (view) view.classList.add('active');
      state.currentTab = target;

      if (target === 'history') loadVault();
      if (target === 'voices') {
        const activePill = document.querySelector('.matrix-filters-row .filter-pill.active');
        renderVoiceMatrix(activePill ? activePill.dataset.filter : 'featured');
      }
    });
  });

  if (elements.logoRefresh) {
    elements.logoRefresh.addEventListener('click', () => {
      document.querySelector('.nav-pill[data-tab="studio"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (elements.btnOpenMatrix) {
    elements.btnOpenMatrix.addEventListener('click', () => {
      document.querySelector('.nav-pill[data-tab="voices"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ==========================================================================
// TIME-WARP VIDEO PACER ENGINE
// ==========================================================================

function setupTimeWarpPacer() {
  elements.pacerEnabled.addEventListener('change', (e) => {
    state.pacerEnabled = e.target.checked;
    calculatePacing();
    showToast(state.pacerEnabled ? 'Time-Warp Auto-Pacer Locked' : 'Manual Tuning Mode Active');
  });

  elements.targetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.targetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const sec = parseFloat(chip.dataset.seconds);
      state.targetDurationSeconds = sec;
      calculatePacing();
      showToast(`Paced for ${sec}s video runtime`);
    });
  });

  elements.btnApplyCustom.addEventListener('click', () => {
    const m = parseInt(elements.customMin.value || '0');
    const s = parseInt(elements.customSec.value || '0');
    const totalSec = (m * 60) + s;

    if (totalSec <= 0) {
      showToast('Enter video length greater than 0s');
      return;
    }

    elements.targetChips.forEach(c => c.classList.remove('active'));
    state.targetDurationSeconds = totalSec;
    calculatePacing();
    showToast(`Locked custom runtime: ${totalSec}s (${m > 0 ? m + 'm ' : ''}${s}s)`);
  });

  elements.btnSyncPace.addEventListener('click', () => {
    applyPacingRate(true);
  });
}

function calculatePacing() {
  const text = elements.scriptInput.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const targetSec = state.targetDurationSeconds || 60;

  const naturalSec = words > 0 ? (words / 2.5) : 0;
  let multiplier = targetSec > 0 && naturalSec > 0 ? (naturalSec / targetSec) : 1.0;
  let ratePct = Math.round((multiplier - 1.0) * 100);

  const clampedRate = Math.max(-50, Math.min(100, ratePct));
  const wpm = targetSec > 0 ? Math.round((words / targetSec) * 60) : 150;
  const idealWords = Math.round(targetSec * 2.5);

  let score = 98;
  let status = 'optimal';
  let message = `🔥 Viral Retention Peak (${wpm} WPM). Perfectly locked to your ${Math.round(targetSec)}s cut.`;

  if (wpm >= 140 && wpm <= 175) {
    status = 'optimal';
    score = 98;
    message = `🔥 Viral Retention Peak (${wpm} WPM). Perfectly locked to your ${Math.round(targetSec)}s cut.`;
  } else if (wpm > 175 && wpm <= 210) {
    status = 'fast';
    score = 91;
    message = `⚡ High-Energy Hook (${wpm} WPM). Punchy pacing tailored for TikTok & Shorts.`;
  } else if (wpm > 210) {
    status = 'too_fast';
    score = 64;
    const excess = words - idealWords;
    message = `⚠️ Over-compressed (${wpm} WPM). Trim ~${excess} words or increase video target to ${Math.round(naturalSec)}s.`;
  } else if (wpm >= 115 && wpm < 140) {
    status = 'relaxed';
    score = 88;
    message = `🧘 Cinematic Flow (${wpm} WPM). Deep narrative style with room for B-roll breathing.`;
  } else {
    status = 'too_fast';
    score = 55;
    const deficit = idealWords - words;
    message = `⚠️ Under-paced (${wpm} WPM). Add ~${deficit} words to maintain audience engagement.`;
  }

  state.pacingCalc = {
    words,
    targetSec,
    naturalSec: Math.round(naturalSec * 10) / 10,
    multiplier: Math.round(multiplier * 100) / 100,
    ratePct: clampedRate,
    wpm,
    score,
    idealWords
  };

  elements.metricWords.textContent = words.toLocaleString();
  elements.metricTarget.textContent = targetSec >= 60 ? `${Math.floor(targetSec / 60)}m ${targetSec % 60}s` : `${targetSec}s`;
  elements.metricRate.textContent = `${clampedRate >= 0 ? '+' : ''}${clampedRate}%`;
  elements.metricWpm.textContent = `${wpm} WPM`;
  if (elements.metricScore) elements.metricScore.textContent = `${score}%`;

  elements.feedbackIndicator.className = `status-orb ${status}`;
  elements.feedbackText.textContent = message;

  if (state.pacerEnabled) {
    applyPacingRate(false);
  }
}

function applyPacingRate(notify = true) {
  if (!state.pacingCalc) return;
  const rate = state.pacingCalc.ratePct;

  state.settings.speed = rate;
  elements.speedSlider.value = rate;

  const factor = (1 + rate / 100).toFixed(2);
  elements.speedVal.textContent = `${factor}x (${rate >= 0 ? '+' : ''}${rate}%)`;

  const spdStr = rate >= 0 ? `+${rate}%` : `${rate}%`;
  elements.settingsSummary.textContent = `Speed: ${spdStr} (Auto-Locked) • Pitch: ${state.settings.pitch}Hz • Vol: ${100 + state.settings.volume}%`;

  if (notify) {
    showToast(`⚡ Voice pace locked: ${spdStr} (${state.pacingCalc.wpm} WPM for ${state.pacingCalc.targetSec}s video)`);
  }
}

// ==========================================================================
// ACOUSTIC FINE-TUNING DRAWER
// ==========================================================================

function setupTuningDrawer() {
  elements.drawerToggle.addEventListener('click', () => {
    elements.settingsDrawer.classList.toggle('open');
  });

  const updateSummary = () => {
    const spd = state.settings.speed >= 0 ? `+${state.settings.speed}%` : `${state.settings.speed}%`;
    const pitch = state.settings.pitch >= 0 ? `+${state.settings.pitch}Hz` : `${state.settings.pitch}Hz`;
    const vol = state.settings.volume >= 0 ? `+${state.settings.volume}%` : `${state.settings.volume}%`;
    elements.settingsSummary.textContent = `Speed: ${spd} • Pitch: ${pitch} • Vol: ${vol}`;
  };

  elements.speedSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.settings.speed = val;
    const factor = (1 + val / 100).toFixed(2);
    elements.speedVal.textContent = `${factor}x (${val >= 0 ? '+' : ''}${val}%)`;
    updateSummary();
  });

  elements.pitchSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.settings.pitch = val;
    elements.pitchVal.textContent = `${val >= 0 ? '+' : ''}${val} Hz ${val === 0 ? '(Normal)' : ''}`;
    updateSummary();
  });

  elements.volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.settings.volume = val;
    elements.volumeVal.textContent = `${100 + val}% (${val >= 0 ? '+' : ''}${val}%)`;
    updateSummary();
  });

  document.querySelectorAll('.btn-param-reset').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.target.dataset.target;
      const def = parseInt(e.target.dataset.default || '0');
      const input = document.getElementById(targetId);
      if (input) {
        input.value = def;
        input.dispatchEvent(new Event('input'));
      }
    });
  });

  document.querySelectorAll('.sig-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const voiceId = btn.dataset.voice;
      const spd = parseInt(btn.dataset.speed || '0');
      const pch = parseInt(btn.dataset.pitch || '0');
      const vol = parseInt(btn.dataset.vol || '0');

      if (voiceId && state.voices.all) {
        const found = state.voices.all.find(v => v.id === voiceId);
        if (found) activateVoice(found);
      }

      elements.speedSlider.value = spd;
      elements.pitchSlider.value = pch;
      elements.volumeSlider.value = vol;

      elements.speedSlider.dispatchEvent(new Event('input'));
      elements.pitchSlider.dispatchEvent(new Event('input'));
      elements.volumeSlider.dispatchEvent(new Event('input'));

      showToast(`Acoustic preset loaded: ${btn.textContent}`);
    });
  });
}

// ==========================================================================
// SCRIPT WORKSPACE
// ==========================================================================

function setupScriptWorkspace() {
  const updateStats = () => {
    const text = elements.scriptInput.value.trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).length : 0;
    const estSec = words > 0 ? Math.ceil(words / 2.5) : 0;

    elements.charCount.textContent = chars.toLocaleString();
    elements.wordCount.textContent = words.toLocaleString();
    elements.estTime.textContent = estSec > 60 ? `${Math.floor(estSec / 60)}m ${estSec % 60}s` : `${estSec}s`;

    calculatePacing();
  };

  elements.scriptInput.addEventListener('input', updateStats);
  updateStats();

  elements.btnClear.addEventListener('click', () => {
    elements.scriptInput.value = '';
    updateStats();
    elements.scriptInput.focus();
  });

  elements.btnPaste.addEventListener('click', async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        elements.scriptInput.value = clipText;
        updateStats();
        showToast('Pasted from clipboard');
      }
    } catch {
      showToast('Clipboard access was blocked by browser');
    }
  });

  elements.btnInsertPause.addEventListener('click', () => {
    const textarea = elements.scriptInput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const pauseTag = " ... ";

    textarea.value = text.substring(0, start) + pauseTag + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + pauseTag.length;
    textarea.focus();
    updateStats();
    showToast('0.5s B-roll transition pause inserted');
  });

  elements.subChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.prompt;
      if (PROMPT_TEMPLATES[type]) {
        elements.scriptInput.value = PROMPT_TEMPLATES[type];
        updateStats();
        showToast(`Template injected: ${chip.textContent}`);
      }
    });
  });
}

// ==========================================================================
// MASTER SYNTHESIS EXECUTION
// ==========================================================================

function setupMasterSynthesis() {
  elements.btnGenerate.addEventListener('click', executeSynthesis);
}

async function executeSynthesis() {
  const text = elements.scriptInput.value.trim();
  if (!text) {
    showToast('Enter script text to synthesize');
    elements.scriptInput.focus();
    return;
  }

  if (elements.btnGenerate.classList.contains('loading')) {
    return;
  }

  const voiceId = state.selectedVoice ? state.selectedVoice.id : 'en-US-AndrewNeural';

  elements.btnGenerate.classList.add('loading');
  const t0 = performance.now();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice_id: voiceId,
        rate: state.settings.speed,
        pitch: state.settings.pitch,
        volume: state.settings.volume,
        target_duration: state.targetDurationSeconds
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Synthesis request failed');
    }

    const data = await res.json();
    const elapsedSec = ((performance.now() - t0) / 1000).toFixed(2);

    state.srtUrl = data.srt_url;
    state.srtContent = data.srt_content;

    elements.dockGenStat.textContent = `⚡ Rendered in ${elapsedSec}s • ${data.words} words • Subtitles synced`;
    showToast(`Master Audio & Synchronized .SRT rendered in ${elapsedSec}s!`);

    loadAndPlayAudio(data.audio_url, {
      title: data.voice_name,
      stat: `⚡ ${data.words} words • ~${data.estimated_duration}s • CapCut & Premiere ready`
    });

    state.history.unshift(data);
    elements.historyCountBadge.textContent = state.history.length;
    renderVault();

  } catch (err) {
    showToast('Render error: ' + err.message);
  } finally {
    elements.btnGenerate.classList.remove('loading');
  }
}

// ==========================================================================
// AUDIO ENGINE & DECK
// ==========================================================================

function setupAudioEngine() {
  const audio = elements.audioEngine;

  elements.btnPlayPause.addEventListener('click', togglePlayPause);

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const cur = audio.currentTime;
    const dur = audio.duration;
    const pct = (cur / dur) * 100;

    elements.progressFill.style.width = `${pct}%`;
    elements.progressThumb.style.left = `${pct}%`;
    elements.timeCurrent.textContent = formatTime(cur);
    elements.timeTotal.textContent = formatTime(dur);
  });

  audio.addEventListener('ended', () => {
    state.isPlaying = false;
    updatePlayPauseUI();
    elements.progressFill.style.width = '0%';
    elements.progressThumb.style.left = '0%';
  });

  audio.addEventListener('play', () => {
    state.isPlaying = true;
    updatePlayPauseUI();
    resumeAudioContext();
  });

  audio.addEventListener('pause', () => {
    state.isPlaying = false;
    updatePlayPauseUI();
  });

  elements.progressTrack.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = elements.progressTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = pct * audio.duration;
  });

  elements.btnPlaybackSpeed.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.speedMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    elements.speedMenu.classList.add('hidden');
  });

  elements.speedMenu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const spd = parseFloat(btn.dataset.speed);
      audio.playbackRate = spd;
      elements.btnPlaybackSpeed.textContent = `${spd}x`;
      elements.speedMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  elements.playerVolume.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    updateVolumeIcon(val);
  });

  elements.btnMute.addEventListener('click', () => {
    if (audio.volume > 0) {
      audio.dataset.prevVolume = audio.volume;
      audio.volume = 0;
      elements.playerVolume.value = 0;
      updateVolumeIcon(0);
    } else {
      const prev = parseFloat(audio.dataset.prevVolume || '1');
      audio.volume = prev;
      elements.playerVolume.value = prev;
      updateVolumeIcon(prev);
    }
  });

  // Download MP3
  elements.btnDownload.addEventListener('click', () => {
    if (!state.audioUrl) {
      showToast('Synthesize audio before exporting');
      return;
    }
    const a = document.createElement('a');
    a.href = state.audioUrl;
    const voiceName = state.selectedVoice ? state.selectedVoice.name.replace(/\s+/g, '_') : 'voxora';
    a.download = `VOXORA_${voiceName}_${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('MP3 download started');
  });

  // Download .SRT Captions (Premiere / CapCut ready)
  elements.btnDownloadSrt.addEventListener('click', () => {
    if (!state.srtUrl) {
      showToast('Render speech to download synchronized .SRT captions');
      return;
    }
    const a = document.createElement('a');
    a.href = state.srtUrl;
    a.download = `VOXORA_Captions_${Date.now()}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('CapCut / Premiere Pro .SRT downloaded!');
  });

  // Copy Captions
  elements.btnCopySrt.addEventListener('click', () => {
    if (!state.srtContent) {
      showToast('Render speech first');
      return;
    }
    navigator.clipboard.writeText(state.srtContent).then(() => {
      showToast('Captions copied to clipboard');
    }).catch(() => {
      showToast('Could not copy captions');
    });
  });
}

function loadAndPlayAudio(url, meta = {}) {
  const audio = elements.audioEngine;
  state.audioUrl = url;
  audio.src = url;
  audio.load();

  if (meta.title) elements.dockVoiceName.textContent = meta.title;
  if (meta.stat) elements.dockGenStat.textContent = meta.stat;

  audio.play().catch(e => {
    console.log('Playback policy:', e);
  });
}

function togglePlayPause() {
  const audio = elements.audioEngine;
  if (!audio.src) {
    executeSynthesis();
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function updatePlayPauseUI() {
  if (state.isPlaying) {
    elements.playIcon.classList.add('hidden');
    elements.pauseIcon.classList.remove('hidden');
  } else {
    elements.playIcon.classList.remove('hidden');
    elements.pauseIcon.classList.add('hidden');
  }
}

function updateVolumeIcon(vol) {
  if (vol === 0) {
    elements.volHigh.classList.add('hidden');
    elements.volMuted.classList.remove('hidden');
  } else {
    elements.volHigh.classList.remove('hidden');
    elements.volMuted.classList.add('hidden');
  }
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ==========================================================================
// DUAL-MIRRORED NEON SPECTRUM WAVEFORM VISUALIZER
// ==========================================================================

function setupMirroredWaveform() {
  const canvas = elements.waveformCanvas;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.parentElement.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function renderSpectrum() {
    requestAnimationFrame(renderSpectrum);

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const midY = h / 2;

    ctx.clearRect(0, 0, w, h);

    if (state.analyser && state.isPlaying) {
      const bufferLength = state.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      state.analyser.getByteFrequencyData(dataArray);

      const numBars = 72;
      const step = Math.floor(bufferLength / numBars);
      const barWidth = (w / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const val = dataArray[i * step] / 255.0;
        const barHeight = Math.max(3, val * (midY - 4));
        const x = i * (barWidth + 2);

        // Crimson Flame Top Bar Gradient
        const topGrad = ctx.createLinearGradient(0, midY, 0, midY - barHeight);
        topGrad.addColorStop(0, '#881337');
        topGrad.addColorStop(0.5, '#e11d48');
        topGrad.addColorStop(0.9, '#ff1e42');
        topGrad.addColorStop(1, '#f59e0b');

        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.roundRect(x, midY - barHeight, barWidth, barHeight, 2);
        ctx.fill();

        // Glowing Floating Peak Cap Dot
        const peakY = midY - barHeight - 2;
        ctx.fillStyle = '#ffe4e6';
        ctx.shadowColor = '#ff1e42';
        ctx.shadowBlur = 6;
        ctx.fillRect(x, Math.max(2, peakY), barWidth, 1.5);
        ctx.shadowBlur = 0;

        // Bottom Mirrored Deep Velvet Burgundy Reflection
        const btmGrad = ctx.createLinearGradient(0, midY, 0, midY + barHeight);
        btmGrad.addColorStop(0, 'rgba(225, 29, 72, 0.45)');
        btmGrad.addColorStop(0.6, 'rgba(136, 19, 55, 0.25)');
        btmGrad.addColorStop(1, 'rgba(42, 5, 13, 0.02)');

        ctx.fillStyle = btmGrad;
        ctx.beginPath();
        ctx.roundRect(x, midY + 1, barWidth, barHeight * 0.75, 2);
        ctx.fill();
      }
    } else {
      // Dynamic ambient breathing crimson ember idle wave
      const numBars = 72;
      const barWidth = (w / numBars) - 2;
      const time = Date.now() * 0.0025;

      for (let i = 0; i < numBars; i++) {
        const wave = Math.sin(time + i * 0.12) * 0.5 + 0.5;
        const barHeight = 3 + wave * 9;
        const x = i * (barWidth + 2);

        const idleGrad = ctx.createLinearGradient(0, midY - barHeight, 0, midY + barHeight);
        idleGrad.addColorStop(0, 'rgba(255, 30, 66, 0.22)');
        idleGrad.addColorStop(0.5, 'rgba(225, 29, 72, 0.14)');
        idleGrad.addColorStop(1, 'rgba(72, 6, 22, 0.05)');

        ctx.fillStyle = idleGrad;
        ctx.beginPath();
        ctx.roundRect(x, midY - barHeight, barWidth, barHeight * 2, 2);
        ctx.fill();
      }
    }
  }

  renderSpectrum();
}

function resumeAudioContext() {
  if (!state.audioCtx) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioContext();
      state.analyser = state.audioCtx.createAnalyser();
      state.analyser.fftSize = 256;

      state.sourceNode = state.audioCtx.createMediaElementSource(elements.audioEngine);
      state.sourceNode.connect(state.analyser);
      state.analyser.connect(state.audioCtx.destination);
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  }

  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
}

// ==========================================================================
// VOICE SELECTION FLYOUT MODAL
// ==========================================================================

function setupVoiceModal() {
  if (elements.btnChangeVoice) {
    elements.btnChangeVoice.addEventListener('click', (e) => {
      e.stopPropagation();
      openVoiceModal();
    });
  }

  if (elements.activeVoiceHero) {
    elements.activeVoiceHero.addEventListener('click', (e) => {
      if (e.target.closest('#btn-quick-preview') || e.target.closest('#quick-voice-select') || e.target.closest('#btn-change-voice')) {
        return;
      }
      openVoiceModal();
    });
  }

  if (elements.quickVoiceSelect) {
    elements.quickVoiceSelect.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const found = (state.voices.featured || []).find(v => v.id === selectedId) ||
                    (state.voices.all || []).find(v => v.id === selectedId);
      if (found) {
        activateVoice(found);
      }
    });
  }

  elements.modalCloseBtn.addEventListener('click', closeVoiceModal);
  elements.voiceModal.addEventListener('click', (e) => {
    if (e.target === elements.voiceModal) closeVoiceModal();
  });

  elements.modalVoiceSearch.addEventListener('input', () => {
    renderModalVoices();
  });

  elements.sheetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.sheetChips.forEach(p => p.classList.remove('active'));
      chip.classList.add('active');
      renderModalVoices();
    });
  });
}

function openVoiceModal() {
  elements.voiceModal.classList.remove('hidden');
  elements.modalVoiceSearch.value = '';
  renderModalVoices();
  elements.modalVoiceSearch.focus();
}

function closeVoiceModal() {
  elements.voiceModal.classList.add('hidden');
}

function renderModalVoices() {
  const query = elements.modalVoiceSearch.value.trim().toLowerCase();
  const activeChip = document.querySelector('.sheet-chip.active');
  const filter = activeChip ? activeChip.dataset.modelfilter : 'featured';

  let list = (filter === 'featured' ? state.voices.featured : state.voices.all) || [];

  if (filter === 'male') {
    list = (state.voices.all || state.voices.featured || []).filter(v => v.gender === 'Male');
  } else if (filter === 'female') {
    list = (state.voices.all || state.voices.featured || []).filter(v => v.gender === 'Female');
  }

  if (query) {
    list = list.filter(v => 
      ((v.name || '').toLowerCase().includes(query)) ||
      ((v.localeName || '').toLowerCase().includes(query)) ||
      (v.traits && v.traits.some(t => (t || '').toLowerCase().includes(query)))
    );
  }

  elements.modalVoicesList.innerHTML = '';
  if (list.length === 0) {
    elements.modalVoicesList.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-muted);">No voices match your query.</div>';
    return;
  }

  list.slice(0, 100).forEach(v => {
    const item = document.createElement('div');
    item.className = 'modal-voice-item';
    if (state.selectedVoice && state.selectedVoice.id === v.id) {
      item.classList.add('selected');
    }

    const initials = v.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    const grad = v.gradient || 'linear-gradient(135deg, #ff1e42, #881337)';

    item.innerHTML = `
      <div class="card-avatar" style="background: ${grad}; width: 38px; height: 38px; font-size: 13px;">${initials}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong style="font-size: 14.5px; color: #fff;">${v.name}</strong>
          <span style="font-size: 14px;">${v.flag || '🌐'}</span>
          <span class="trait-tag" style="font-size: 10px;">${v.gender}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
          ${v.localeName} • ${(v.traits || []).join(', ')}
        </div>
      </div>
      <button class="btn-item-select" type="button" title="Select this voice">Use Voice</button>
      <button class="btn-card-preview" title="Audition Sample" type="button" data-voice="${v.id}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.btn-card-preview') || e.target.closest('.btn-item-select')) return;
      activateVoice(v);
      closeVoiceModal();
    });

    const selectBtn = item.querySelector('.btn-item-select');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        activateVoice(v);
        closeVoiceModal();
      });
    }

    const prevBtn = item.querySelector('.btn-card-preview');
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playVoicePreview(v.id);
    });

    elements.modalVoicesList.appendChild(item);
  });
}

// ==========================================================================
// VOICE MATRIX TAB
// ==========================================================================

function setupVoiceMatrix() {
  elements.voiceSearch.addEventListener('input', () => {
    const activePill = document.querySelector('.matrix-filters-row .filter-pill.active');
    renderVoiceMatrix(activePill ? activePill.dataset.filter : 'all');
  });

  elements.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.filterPills.forEach(c => c.classList.remove('active'));
      pill.classList.add('active');
      renderVoiceMatrix(pill.dataset.filter);
    });
  });
}

function renderVoiceMatrix(filter = 'featured') {
  if (!elements.voicesGrid) return;
  const query = (elements.voiceSearch ? elements.voiceSearch.value : '').trim().toLowerCase();
  let list = [];

  const featured = state.voices.featured || [];
  const all = state.voices.all || [];

  if (filter === 'featured') {
    list = featured.length > 0 ? featured : all.slice(0, 14);
  } else if (filter === 'all') {
    list = all;
  } else if (filter === 'en-us') {
    list = all.filter(v => v.locale === 'en-US');
  } else if (filter === 'en-gb') {
    list = all.filter(v => v.locale === 'en-GB');
  } else if (filter === 'male') {
    list = all.filter(v => v.gender === 'Male');
  } else if (filter === 'female') {
    list = all.filter(v => v.gender === 'Female');
  } else if (filter === 'multilingual') {
    list = all.filter(v => !(v.locale || '').startsWith('en-'));
  } else {
    list = all;
  }

  if (query) {
    list = list.filter(v => 
      ((v.name || '').toLowerCase().includes(query)) ||
      ((v.localeName || '').toLowerCase().includes(query)) ||
      (v.traits && v.traits.some(t => (t || '').toLowerCase().includes(query)))
    );
  }

  elements.voicesGrid.innerHTML = '';
  if (list.length === 0) {
    elements.voicesGrid.innerHTML = '<div style="grid-column: 1/-1; padding: 60px; text-align: center; color: var(--text-muted);">No voices match your query.</div>';
    return;
  }

  list.slice(0, 350).forEach(v => {
    const card = document.createElement('div');
    card.className = 'voice-card';
    const initials = v.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    const grad = v.gradient || 'linear-gradient(135deg, #475569, #1e293b)';

    const traitsHtml = (v.traits || []).map(t => `<span class="trait-tag">${t}</span>`).join('');

    card.innerHTML = `
      <div class="card-top">
        <div class="card-avatar" style="background: ${grad};">${initials}</div>
        <div class="card-title-group">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="card-title">${v.name}</span>
            <span>${v.flag || '🌐'}</span>
          </div>
          <span class="card-sub">${v.localeName} • ${v.gender}</span>
        </div>
      </div>
      <div class="card-desc">${v.description || 'Natural Neural Voice.'}</div>
      <div class="card-traits">${traitsHtml}</div>
      <div class="card-actions">
        <button class="btn-card-preview" title="Audition Sample" data-id="${v.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button class="btn-card-use" data-id="${v.id}">Load into Studio</button>
      </div>
    `;

    card.querySelector('.btn-card-preview').addEventListener('click', (e) => {
      e.stopPropagation();
      playVoicePreview(v.id);
    });

    card.querySelector('.btn-card-use').addEventListener('click', () => {
      activateVoice(v);
      document.querySelector('.nav-pill[data-tab="studio"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    elements.voicesGrid.appendChild(card);
  });
}

// ==========================================================================
// PRODUCTION VAULT (HISTORY & SUBTITLES)
// ==========================================================================

async function loadVault() {
  try {
    const res = await fetch('/api/history');
    if (!res.ok) return;
    const items = await res.json();
    state.history = items;
    elements.historyCountBadge.textContent = items.length;
    renderVault();
  } catch (e) {
    console.error('Vault load error', e);
  }
}

function setupVault() {
  elements.btnClearHistory.addEventListener('click', async () => {
    if (!confirm('Clear all synthesized audio and subtitle files in the vault?')) return;
    try {
      await fetch('/api/history', { method: 'DELETE' });
      state.history = [];
      elements.historyCountBadge.textContent = 0;
      renderVault();
      showToast('Vault cleared');
    } catch (e) {
      showToast('Failed to clear vault');
    }
  });
}

function renderVault() {
  elements.historyList.innerHTML = '';
  if (state.history.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-history">Vault is currently empty. Render your first faceless video clip in the studio deck!</div>';
    return;
  }

  state.history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';

    const dateStr = item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const sizeKb = item.file_size ? `${Math.round(item.file_size / 1024)} KB` : '';
    const srtBtn = item.srt_url ? `<a class="btn-history-action" href="${item.srt_url}" download="VOXORA_Captions_${item.id}.srt" title="Download SRT Subtitles">.SRT Captions</a>` : '';

    div.innerHTML = `
      <button class="history-play-btn" title="Play audio">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <div class="history-content">
        <div class="history-text" title="${escapeHtml(item.text)}">${escapeHtml(item.text)}</div>
        <div class="history-meta">
          <span>${item.voice_flag || '🇺🇸'} <strong>${item.voice_name || 'Neural Voice'}</strong></span>
          <span>•</span>
          <span>${item.words || 0} words</span>
          <span>•</span>
          <span>${sizeKb}</span>
          <span>•</span>
          <span>${dateStr}</span>
        </div>
      </div>
      <div class="history-actions">
        <button class="btn-history-action btn-reuse" title="Load script into studio">Use Script</button>
        ${srtBtn}
        <a class="btn-history-action" href="${item.audio_url}" download="VOXORA_${item.id}.mp3" title="Download MP3">Audio</a>
        <button class="btn-history-action btn-history-delete" title="Delete audio">Delete</button>
      </div>
    `;

    div.querySelector('.history-play-btn').addEventListener('click', () => {
      loadAndPlayAudio(item.audio_url, {
        title: item.voice_name,
        stat: `${item.words} words • ${dateStr}`
      });
      state.srtUrl = item.srt_url;
      state.srtContent = item.srt_content;
    });

    div.querySelector('.btn-reuse').addEventListener('click', () => {
      elements.scriptInput.value = item.text;
      elements.scriptInput.dispatchEvent(new Event('input'));
      document.querySelector('.nav-pill[data-tab="studio"]').click();
      showToast('Script loaded into editor');
    });

    div.querySelector('.btn-history-delete').addEventListener('click', async () => {
      try {
        await fetch(`/api/history/${item.id}`, { method: 'DELETE' });
        state.history = state.history.filter(h => h.id !== item.id);
        elements.historyCountBadge.textContent = state.history.length;
        renderVault();
        showToast('Item deleted');
      } catch (e) {
        showToast('Failed to delete item');
      }
    });

    elements.historyList.appendChild(div);
  });
}

// ==========================================================================
// SHORTCUTS & HELPERS
// ==========================================================================

function setupShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeSynthesis();
      return;
    }

    if (e.code === 'Space' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      togglePlayPause();
    }
  });
}

function showToast(msg) {
  const toast = elements.toast;
  toast.textContent = msg;
  toast.classList.remove('hidden');

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}
