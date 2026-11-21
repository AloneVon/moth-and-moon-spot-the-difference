// Moth & Moon — the casebook, clock and finding logic that ties the three rooms together.
import { CASES } from './scenes/index.js';
import { GameRenderer } from './renderer.js';
import { SoundGarden } from './audio.js';
import { bindCanvasInput, bindKeyboard } from './input.js';
import { readShotPreset } from './screenshots.js';

const $ = (id) => document.getElementById(id);

const ui = {
  leftCanvas: $('left-canvas'),
  rightCanvas: $('right-canvas'),
  caseKicker: $('case-kicker'),
  caseObjective: $('case-objective'),
  timerCard: $('timer-card'),
  timerValue: $('timer-value'),
  timerFill: $('timer-fill'),
  foundCount: $('found-count'),
  totalCount: $('total-count'),
  remainingCount: $('remaining-count'),
  pipRow: $('pip-row'),
  hintText: $('hint-text'),
  hintCharges: $('hint-charges'),
  hintBtn: $('hint-btn'),
  muteBtn: $('mute-btn'),
  muteIcon: $('mute-icon'),
  pauseBtn: $('pause-btn'),
  streakStamp: $('streak-stamp'),
  introScreen: $('intro-screen'),
  beginBtn: $('begin-btn'),
  clearScreen: $('clear-screen'),
  clearEyebrow: $('clear-eyebrow'),
  clearStars: $('clear-stars'),
  clearTitle: $('clear-title'),
  clearCopy: $('clear-copy'),
  clearFound: $('clear-found'),
  clearTime: $('clear-time'),
  clearScore: $('clear-score'),
  clearFineprint: $('clear-fineprint'),
  nextBtn: $('next-btn'),
  pauseScreen: $('pause-screen'),
  resumeBtn: $('resume-btn'),
  finalScreen: $('final-screen'),
  finalScore: $('final-score'),
  againBtn: $('again-btn'),
  toast: $('toast'),
  screenFlash: $('screen-flash'),
};

function formatClock(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function showOverlay(element) {
  element.classList.add('visible');
}

function hideOverlay(element) {
  element.classList.remove('visible');
}

class MothAndMoonGame {
  constructor() {
    this.renderer = new GameRenderer(ui.leftCanvas, ui.rightCanvas);
    this.sound = new SoundGarden();
    this.caseIndex = 0;
    this.phase = 'intro';
    this.found = new Set();
    this.foundOrder = [];
    this.effects = [];
    this.wrong = null;
    this.hint = null;
    this.wrongClicks = 0;
    this.hintsLeft = CASES[0].hints;
    this.remaining = CASES[0].duration;
    this.caseScore = 0;
    this.totalScore = 0;
    this.streak = 1;
    this.lastFoundAt = 0;
    this.overlayMode = 'next';
    this.frozen = false;
    this.screenshotMode = false;
    this.keyboardCursor = { x: 500, y: 400, visible: false };
    this.hintCycle = 0;
    this.toastTimer = 0;
    this.inputsBound = false;
    this.bindUi();
    this.buildPips();
    this.updateUi();
    this.bindInputs();
  }

  get scene() {
    return CASES[this.caseIndex];
  }

  bindUi() {
    ui.beginBtn.addEventListener('click', () => {
      this.sound.wake();
      this.sound.click();
      this.startCase(0, { freshRun: true });
    });
    ui.hintBtn.addEventListener('click', () => this.useHint());
    ui.pauseBtn.addEventListener('click', () => this.togglePause());
    ui.muteBtn.addEventListener('click', () => this.toggleMute());
    ui.resumeBtn.addEventListener('click', () => this.togglePause());
    ui.nextBtn.addEventListener('click', () => this.advanceFromOverlay());
    ui.againBtn.addEventListener('click', () => {
      this.totalScore = 0;
      hideOverlay(ui.finalScreen);
      this.sound.click();
      this.startCase(0, { freshRun: true });
    });
  }

  bindInputs() {
    const inspectLeft = (point) => this.inspect(point, 0);
    const inspectRight = (point) => this.inspect(point, 1);
    bindCanvasInput(ui.leftCanvas, {
      onInspect: inspectLeft,
      onPointerMoved: () => this.hideKeyboardCursor(),
    });
    bindCanvasInput(ui.rightCanvas, {
      onInspect: inspectRight,
      onPointerMoved: () => this.hideKeyboardCursor(),
    });
    bindKeyboard({
      onArrow: (dx, dy) => this.nudgeCursor(dx, dy),
      onInspect: () => this.inspectAtCursor(),
      onHint: () => this.useHint(),
      onPause: () => this.togglePause(),
      onMute: () => this.toggleMute(),
      onRestart: () => {
        if (this.phase === 'playing' || this.phase === 'paused') this.restartCase();
      },
    });
  }

  buildPips() {
    ui.pipRow.replaceChildren();
    for (let i = 0; i < this.scene.differences.length; i++) {
      const pip = document.createElement('span');
      pip.className = 'pip';
      pip.dataset.index = String(i);
      ui.pipRow.appendChild(pip);
    }
    ui.totalCount.textContent = String(this.scene.differences.length);
  }

  startCase(index, options = {}) {
    this.caseIndex = index;
    const scene = this.scene;
    this.phase = 'playing';
    this.frozen = Boolean(options.frozen);
    this.screenshotMode = Boolean(this.screenshotMode || options.screenshotMode);
    this.found = new Set();
    this.foundOrder = [];
    this.effects = [];
    this.wrong = null;
    this.hint = null;
    this.hintCycle = 0;
    this.wrongClicks = 0;
    this.hintsLeft = options.hintsLeft ?? scene.hints;
    this.remaining = options.remaining ?? scene.duration;
    this.caseScore = 0;
    this.streak = 1;
    this.lastFoundAt = 0;
    this.keyboardCursor = { x: 500, y: 400, visible: false };
    if (options.freshRun) this.totalScore = 0;
    hideOverlay(ui.introScreen);
    hideOverlay(ui.clearScreen);
    hideOverlay(ui.pauseScreen);
    hideOverlay(ui.finalScreen);
    this.buildPips();
    if (Array.isArray(options.found)) {
      for (const foundIndex of options.found) {
        const diff = scene.differences[foundIndex];
        if (diff) {
          this.found.add(diff.id);
          this.foundOrder.push(diff.id);
        }
      }
      if (options.found.length > 0) this.lastFoundAt = performance.now();
    }
    ui.caseKicker.textContent = `CASE ${scene.number} · ${scene.title.toUpperCase()}`;
    ui.caseObjective.textContent = scene.objective;
    ui.hintText.className = '';
    ui.hintText.textContent = options.hintText || 'Something in this room is wearing a different face. Click a difference in either picture.';
    if (options.hintIndex !== undefined && options.hintIndex !== null) {
      this.activateHint(options.hintIndex, false);
    }
    this.updateUi();
    if (options.found && options.found.length === scene.differences.length) {
      this.completeCase({ instant: true });
    }
  }

  restartCase() {
    if (this.phase !== 'playing' && this.phase !== 'paused') return;
    hideOverlay(ui.pauseScreen);
    const keepScore = this.totalScore;
    this.startCase(this.caseIndex);
    this.totalScore = keepScore;
    this.showToast('The room has been reset. Look again.');
    this.sound.click();
  }

  inspect(point, panel) {
    if (this.phase !== 'playing') return;
    this.sound.wake();
    const scene = this.scene;
    let candidate = null;
    let bestDistance = Infinity;
    for (const diff of scene.differences) {
      if (this.found.has(diff.id)) continue;
      const distance = Math.hypot(point.x - diff.x, point.y - diff.y);
      if (distance <= diff.r * 1.16 && distance < bestDistance) {
        candidate = diff;
        bestDistance = distance;
      }
    }
    const now = performance.now();
    if (candidate) {
      this.registerFind(candidate, now);
    } else {
      this.registerMiss(point, panel, now);
    }
  }

  registerFind(diff, now) {
    this.found.add(diff.id);
    this.foundOrder.push(diff.id);
    const wasQuick = now - this.lastFoundAt < 4800;
    this.streak = wasQuick ? Math.min(9, this.streak + 1) : 1;
    this.lastFoundAt = now;
    this.caseScore += 100 + this.streak * 25 + Math.round(this.remaining) * 2;
    this.effects.push({ x: diff.x, y: diff.y, at: now, seed: this.foundOrder.length * 0.73 });
    this.hint = null;
    this.sound.found(this.streak);
    ui.hintText.className = 'found-message';
    ui.hintText.textContent = `Found: ${diff.name}. ${this.found.size === this.scene.differences.length ? 'The room is holding its breath.' : 'The odd copy gives up another secret.'}`;
    this.updateUi();
    if (this.found.size === this.scene.differences.length) this.completeCase();
  }

  registerMiss(point, panel, now) {
    this.wrong = { x: point.x, y: point.y, panel, at: now };
    this.streak = 1;
    this.wrongClicks += 1;
    this.remaining = Math.max(0, this.remaining - 3);
    this.hint = null;
    this.sound.wrong();
    ui.hintText.className = 'whisper';
    ui.hintText.textContent = this.remaining > 0
      ? 'Only a shadow there. The candle loses three seconds, and the room pretends not to notice.'
      : 'The last of the candlelight slips away.';
    ui.screenFlash.classList.remove('flash');
    void ui.screenFlash.offsetWidth;
    ui.screenFlash.classList.add('flash');
    this.updateUi();
    if (this.remaining <= 0) this.failCase();
  }

  activateHint(index, spend = true) {
    const diff = this.scene.differences[index];
    if (!diff) return;
    if (spend) {
      this.hintsLeft = Math.max(0, this.hintsLeft - 1);
      this.remaining = Math.max(0, this.remaining - 6);
      this.caseScore = Math.max(0, this.caseScore - 40);
      this.streak = 1;
      this.sound.hint();
    }
    const now = performance.now();
    this.hint = { diff, startedAt: now, until: now + 5200 };
    ui.hintText.className = 'whisper';
    ui.hintText.textContent = `“${diff.hint}”`;
    this.updateUi();
    if (this.remaining <= 0 && this.phase === 'playing') this.failCase();
  }

  useHint() {
    if (this.phase !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.showToast('No whispers left in this room.');
      this.sound.click();
      return;
    }
    const available = this.scene.differences.filter((diff) => !this.found.has(diff.id));
    if (available.length === 0) return;
    this.hintCycle = (this.hintCycle + 1) % available.length;
    const chosen = available[this.hintCycle];
    const index = this.scene.differences.indexOf(chosen);
    this.activateHint(index, true);
  }

  completeCase({ instant = false } = {}) {
    if (this.phase === 'cleared') return;
    this.phase = 'cleared';
    const scene = this.scene;
    const timeBonus = Math.round(this.remaining) * 10;
    const hintBonus = this.hintsLeft * 35;
    const precisionBonus = Math.max(0, 120 - this.wrongClicks * 15);
    this.caseScore += timeBonus + hintBonus + precisionBonus;
    if (!instant) {
      this.totalScore += this.caseScore;
      this.sound.clear();
    }
    ui.clearEyebrow.textContent = `CASE ${scene.number} CLOSED`;
    ui.clearStars.textContent = this.remaining > scene.duration * 0.45 ? '✦ ✦ ✦' : this.remaining > scene.duration * 0.2 ? '✦ ✦' : '✦';
    ui.clearTitle.textContent = this.remaining > 45 ? 'A fine pair of eyes.' : 'Close. But the room knows you saw it.';
    ui.clearCopy.textContent = `Every odd detail in ${scene.title} has been found.`;
    ui.clearFound.textContent = `${this.found.size} / ${scene.differences.length}`;
    ui.clearTime.textContent = formatClock(this.remaining);
    ui.clearScore.textContent = this.caseScore.toLocaleString();
    ui.nextBtn.innerHTML = this.caseIndex < CASES.length - 1 ? 'NEXT ROOM <span>→</span>' : 'CLOSE THE CASEBOOK <span>→</span>';
    ui.clearFineprint.textContent = this.caseIndex < CASES.length - 1
      ? 'The candle clock is reset in the next room.'
      : 'All three rooms are waiting to be remembered.';
    this.overlayMode = 'next';
    this.updateUi();
    showOverlay(ui.clearScreen);
  }

  failCase() {
    if (this.phase !== 'playing') return;
    this.phase = 'failed';
    this.sound.fail();
    ui.clearEyebrow.textContent = 'THE CANDLE WENT OUT';
    ui.clearStars.textContent = '✦';
    ui.clearTitle.textContent = 'The room keeps its secrets.';
    ui.clearCopy.textContent = `You found ${this.found.size} of ${this.scene.differences.length} differences in ${this.scene.title}.`;
    ui.clearFound.textContent = `${this.found.size} / ${this.scene.differences.length}`;
    ui.clearTime.textContent = '00:00';
    ui.clearScore.textContent = this.caseScore.toLocaleString();
    ui.nextBtn.innerHTML = 'TRY THIS ROOM AGAIN <span>↻</span>';
    ui.clearFineprint.textContent = 'The candle clock will be generous enough for one more attempt.';
    this.overlayMode = 'retry';
    this.updateUi();
    showOverlay(ui.clearScreen);
  }

  advanceFromOverlay() {
    this.sound.click();
    hideOverlay(ui.clearScreen);
    if (this.overlayMode === 'retry') {
      this.startCase(this.caseIndex);
      return;
    }
    if (this.caseIndex < CASES.length - 1) {
      this.startCase(this.caseIndex + 1);
      return;
    }
    this.showFinal();
  }

  showFinal() {
    this.phase = 'final';
    const totalDifferences = CASES.reduce((sum, scene) => sum + scene.differences.length, 0);
    ui.finalScore.textContent = this.totalScore.toLocaleString();
    const finalStats = ui.finalScreen.querySelector('.score-grid');
    if (finalStats) finalStats.children[1].querySelector('strong').textContent = `${totalDifferences} / ${totalDifferences}`;
    hideOverlay(ui.clearScreen);
    showOverlay(ui.finalScreen);
    this.sound.clear();
  }

  togglePause() {
    if (this.phase === 'playing') {
      this.phase = 'paused';
      showOverlay(ui.pauseScreen);
      this.sound.click();
    } else if (this.phase === 'paused') {
      this.phase = 'playing';
      hideOverlay(ui.pauseScreen);
      this.sound.click();
    }
  }

  toggleMute() {
    this.sound.wake();
    this.sound.setMuted(!this.sound.muted);
    ui.muteIcon.textContent = this.sound.muted ? '∅' : '♪';
    ui.muteBtn.title = this.sound.muted ? 'Unmute sound (M)' : 'Mute sound (M)';
    this.showToast(this.sound.muted ? 'The room is silent.' : 'The room has its music back.');
  }

  nudgeCursor(dx, dy) {
    if (this.phase !== 'playing') return;
    this.keyboardCursor.visible = true;
    this.keyboardCursor.x = Math.max(12, Math.min(988, this.keyboardCursor.x + dx));
    this.keyboardCursor.y = Math.max(12, Math.min(788, this.keyboardCursor.y + dy));
  }

  hideKeyboardCursor() {
    this.keyboardCursor.visible = false;
  }

  inspectAtCursor() {
    if (this.phase !== 'playing') return;
    if (!this.keyboardCursor.visible) {
      this.keyboardCursor.visible = true;
      this.showToast('Arrow keys move the brass sight. Enter inspects.');
      return;
    }
    this.inspect({ x: this.keyboardCursor.x, y: this.keyboardCursor.y }, 1);
  }

  showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => ui.toast.classList.remove('show'), 2300);
  }

  updateUi() {
    const scene = this.scene;
    const foundCount = this.found.size;
    const total = scene.differences.length;
    ui.foundCount.textContent = String(foundCount);
    ui.totalCount.textContent = String(total);
    ui.remainingCount.textContent = String(Math.max(0, total - foundCount));
    ui.hintCharges.textContent = `${this.hintsLeft} left`;
    ui.hintBtn.disabled = this.phase !== 'playing' || this.hintsLeft <= 0;
    ui.pauseBtn.disabled = this.phase !== 'playing' && this.phase !== 'paused';
    const pips = ui.pipRow.children;
    for (let i = 0; i < pips.length; i++) {
      const diff = scene.differences[i];
      pips[i].classList.toggle('found', Boolean(diff && this.found.has(diff.id)));
    }
    const ratio = Math.max(0, Math.min(1, this.remaining / scene.duration));
    ui.timerValue.textContent = formatClock(this.remaining);
    ui.timerFill.style.width = `${ratio * 100}%`;
    ui.timerCard.classList.toggle('urgent', this.remaining <= 30 && this.phase === 'playing');
    ui.streakStamp.classList.toggle('hot', this.streak > 1);
    ui.streakStamp.querySelector('strong').textContent = `×${this.streak}`;
  }

  tick(now) {
    if (this.phase === 'playing' && !this.frozen) {
      const delta = Math.min(120, Math.max(0, now - (this.lastFrameAt || now)));
      this.remaining = Math.max(0, this.remaining - delta / 1000);
      this.lastFrameAt = now;
      if (this.remaining <= 0) {
        this.updateUi();
        this.failCase();
      }
    } else {
      this.lastFrameAt = now;
    }
    this.effects = this.effects.filter((effect) => now - effect.at < 1050);
    if (this.wrong && now - this.wrong.at > 500) this.wrong = null;
    if (this.hint && now > this.hint.until) this.hint = null;
    this.updateUi();
  }

  render(now) {
    this.renderer.render(this.scene, this, now);
  }

  applyShotPreset(preset) {
    this.screenshotMode = true;
    this.frozen = true;
    const found = preset.found === 'all'
      ? this.scene.differences.map((_, index) => index)
      : preset.found;
    this.startCase(preset.caseIndex, {
      frozen: true,
      screenshotMode: true,
      found,
      remaining: preset.remaining,
      hintsLeft: preset.hintsLeft,
      hintText: preset.hintText,
      hintIndex: preset.hintIndex,
    });
    if (preset.showClear) {
      this.totalScore = 0;
      this.found = new Set(this.scene.differences.map((diff) => diff.id));
      this.foundOrder = this.scene.differences.map((diff) => diff.id);
      this.completeCase({ instant: true });
    }
    if (preset.showFinal) {
      this.showFinal();
    }
  }
}

const game = new MothAndMoonGame();
const preset = readShotPreset();
if (preset) {
  // The three showcase presets start at the right room and let the game paint itself normally.
  game.screenshotMode = true;
  game.caseIndex = preset.caseIndex;
  game.applyShotPreset(preset);
} else {
  game.phase = 'intro';
  game.buildPips();
  game.updateUi();
  showOverlay(ui.introScreen);
}

let lastPaint = 0;
function frame(now) {
  // Cap rendering at ~40 fps: enough for the candle flicker, gentle on two rich canvases.
  if (now - lastPaint >= 24) {
    game.tick(now);
    game.render(now);
    lastPaint = now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Expose a deliberately small inspection hook for local play-testing and the screenshot rig.
window.mothAndMoon = {
  inspect: (x, y) => game.inspect({ x, y }, 1),
  state: () => ({
    caseIndex: game.caseIndex,
    phase: game.phase,
    found: [...game.found],
    remaining: game.remaining,
  }),
};
