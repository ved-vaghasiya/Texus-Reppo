// js/utils/settings.js - Theme, Audio, and Animation Preference Controls

const THEME_KEY = 'texsus_theme';
const SOUND_KEY = 'texsus_sound';
const ANIM_KEY = 'texsus_animations';

class SettingsManager {
  constructor() {
    this.init();
  }

  init() {
    // Theme setup (default dark)
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    this.applyTheme(savedTheme);

    // Audio setup (default MUTED as required by prompt Section 19 & 30)
    if (localStorage.getItem(SOUND_KEY) === null) {
      localStorage.setItem(SOUND_KEY, 'false');
    }

    // Animation setup (default enabled)
    const anim = localStorage.getItem(ANIM_KEY) !== 'false';
    this.applyAnimations(anim);
  }

  // Theme
  getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
    window.dispatchEvent(new CustomEvent('theme:changed', { detail: theme }));
  }

  toggleTheme() {
    const next = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Sound
  isSoundEnabled() {
    return localStorage.getItem(SOUND_KEY) === 'true';
  }

  setSoundEnabled(enabled) {
    localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('sound:changed', { detail: enabled }));
  }

  toggleSound() {
    const next = !this.isSoundEnabled();
    this.setSoundEnabled(next);
    return next;
  }

  // Animations
  isAnimationsEnabled() {
    return localStorage.getItem(ANIM_KEY) !== 'false';
  }

  setAnimationsEnabled(enabled) {
    localStorage.setItem(ANIM_KEY, enabled ? 'true' : 'false');
    this.applyAnimations(enabled);
    window.dispatchEvent(new CustomEvent('animations:changed', { detail: enabled }));
  }

  applyAnimations(enabled) {
    document.documentElement.setAttribute('data-animations', enabled ? 'true' : 'false');
  }
}

export const settings = new SettingsManager();
