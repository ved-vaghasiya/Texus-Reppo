// js/utils/i18n.js - Translation Manager supporting EN, HI, GU

import { en } from '../../data/translations/en.js';
import { hi } from '../../data/translations/hi.js';
import { gu } from '../../data/translations/gu.js';

const dictionaries = { en, hi, gu };
const STORAGE_KEY = 'texsus_lang';

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (!dictionaries[lang]) lang = 'en';
    this.currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    this.translateDOM();
    window.dispatchEvent(new CustomEvent('language:changed', { detail: lang }));
  }

  t(key, defaultVal = '') {
    const dict = dictionaries[this.currentLang] || dictionaries.en;
    return dict[key] || dictionaries.en[key] || defaultVal || key;
  }

  translateDOM(container = document) {
    const elements = container.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
  }
}

export const i18n = new I18nManager();
