// Tiny procedural score: no audio files, no network, just warm oscillators.
// Every sound is synthesized after the player's first gesture, as browsers require.
export class SoundGarden {
  constructor() {
    this.context = null;
    this.muted = false;
    this.master = null;
  }

  wake() {
    if (this.context) {
      if (this.context.state === 'suspended') this.context.resume();
      return;
    }
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    this.context = new AudioCtor();
    this.master = this.context.createGain();
    this.master.gain.value = this.muted ? 0 : 0.22;
    this.master.connect(this.context.destination);
    this.ambient();
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.22, this.context.currentTime, 0.04);
  }

  tone(frequency, start, duration, gain = 0.18, type = 'sine', slide = frequency) {
    if (!this.context || this.muted) return;
    const ctx = this.context;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, slide), start + duration);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  ambient() {
    if (!this.context) return;
    const ctx = this.context;
    const drone = ctx.createOscillator();
    const breath = ctx.createOscillator();
    const gain = ctx.createGain();
    drone.type = 'sine';
    breath.type = 'triangle';
    drone.frequency.value = 55;
    breath.frequency.value = 110;
    gain.gain.value = 0.018;
    drone.connect(gain);
    breath.connect(gain);
    gain.connect(this.master);
    drone.start();
    breath.start();
  }

  found(streak = 1) {
    this.wake();
    if (!this.context) return;
    const t = this.context.currentTime + 0.01;
    const base = 392 * Math.pow(1.05946, Math.min(8, streak));
    this.tone(base, t, 0.2, 0.18, 'sine');
    this.tone(base * 1.5, t + 0.055, 0.3, 0.14, 'sine');
    this.tone(base * 2, t + 0.13, 0.38, 0.09, 'triangle');
    this.tone(1046, t + 0.07, 0.7, 0.035, 'sine', 880);
  }

  wrong() {
    this.wake();
    if (!this.context) return;
    const t = this.context.currentTime + 0.01;
    this.tone(150, t, 0.17, 0.18, 'triangle', 98);
    this.tone(102, t + 0.07, 0.23, 0.1, 'sine', 72);
  }

  hint() {
    this.wake();
    if (!this.context) return;
    const t = this.context.currentTime + 0.01;
    this.tone(523, t, 0.55, 0.08, 'sine', 523);
    this.tone(659, t + 0.08, 0.65, 0.065, 'sine', 659);
    this.tone(784, t + 0.17, 0.8, 0.045, 'triangle', 784);
  }

  clear() {
    this.wake();
    if (!this.context) return;
    const t = this.context.currentTime + 0.03;
    const notes = [392, 523, 659, 784, 1046];
    notes.forEach((note, i) => this.tone(note, t + i * 0.105, 0.7, 0.1, i % 2 ? 'triangle' : 'sine'));
    this.tone(1318, t + 0.55, 1.4, 0.035, 'sine', 1046);
  }

  fail() {
    this.wake();
    if (!this.context) return;
    const t = this.context.currentTime + 0.03;
    this.tone(330, t, 0.35, 0.11, 'triangle', 294);
    this.tone(262, t + 0.22, 0.45, 0.1, 'sine', 196);
    this.tone(196, t + 0.43, 0.8, 0.08, 'sine', 130);
  }

  click() {
    this.wake();
    if (!this.context) return;
    const t = this.context.currentTime + 0.005;
    this.tone(740, t, 0.06, 0.065, 'triangle', 580);
  }
}
