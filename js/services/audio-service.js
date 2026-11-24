// js/services/audio-service.js - Procedural Web Audio synthesizer (100% offline, muted by default)

import { settings } from '../utils/settings.js';

class AudioService {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.15) {
    if (!settings.isSoundEnabled()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error:', e);
    }
  }

  playBookingChime() {
    if (!settings.isSoundEnabled()) return;
    // Ascending major arpeggio
    setTimeout(() => this.playTone(523.25, 'triangle', 0.2, 0.15), 0);    // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.2, 0.15), 100);  // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.35, 0.2), 200);  // G5
  }

  playNotification() {
    if (!settings.isSoundEnabled()) return;
    this.playTone(587.33, 'sine', 0.15, 0.12);
    setTimeout(() => this.playTone(880, 'sine', 0.25, 0.12), 120);
  }

  playPaymentSuccess() {
    if (!settings.isSoundEnabled()) return;
    // Celebratory harmonic chord
    setTimeout(() => this.playTone(440, 'triangle', 0.25, 0.15), 0);
    setTimeout(() => this.playTone(554.37, 'triangle', 0.25, 0.15), 80);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.3, 0.18), 160);
    setTimeout(() => this.playTone(880, 'triangle', 0.5, 0.22), 240);
  }

  playSOSSiren() {
    if (!settings.isSoundEnabled()) return;
    // Two-tone warning siren
    let count = 0;
    const interval = setInterval(() => {
      this.playTone(count % 2 === 0 ? 800 : 600, 'sawtooth', 0.18, 0.25);
      count++;
      if (count > 6) clearInterval(interval);
    }, 200);
  }
}

export const audioService = new AudioService();
