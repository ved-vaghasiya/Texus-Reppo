// js/app.js - Main Application Bootstrap, PWA Installation & Service Worker Integration

import { store } from './storage/store.js';
import { settings } from './utils/settings.js';
import { i18n } from './utils/i18n.js';
import { router } from './router.js';
import { renderIcon } from './utils/icons.js';

let deferredInstallPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize settings & translations
  settings.init();
  i18n.translateDOM();

  // 2. Initialize Router
  const root = document.getElementById('app-root');
  router.init(root);

  // 3. Register Service Worker for PWA & Offline mode (Section 27)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => {
          console.log('TEXSUS Service Worker registered:', reg.scope);
          // Check for worker updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateBanner();
              }
            });
          });
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
    });
  }

  // 4. Custom PWA Installation Prompt (Section 27)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showPWAInstallPrompt();
  });

  // 5. Offline / Online Connectivity Listeners
  window.addEventListener('offline', () => {
    showConnectivityToast(false);
  });
  window.addEventListener('online', () => {
    showConnectivityToast(true);
  });
});

function showPWAInstallPrompt() {
  const existing = document.getElementById('pwa-install-banner');
  if (existing) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'card-3d card-neon';
  banner.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    max-width: 360px;
    z-index: 9999;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-glow);
    box-shadow: var(--shadow-lg), var(--shadow-neon-sm);
  `;

  banner.innerHTML = `
    <div class="brand-logo-badge" style="width:40px; height:40px; flex-shrink:0;">
      ${renderIcon('bike', 20)}
    </div>
    <div style="flex:1;">
      <div style="font-weight:700; font-size:0.9rem;">Install TEXSUS App</div>
      <div style="font-size:0.75rem; color:var(--text-secondary);">Add to Home screen for instant offline rides.</div>
    </div>
    <button id="btn-do-install" class="btn btn-primary btn-sm" style="flex-shrink:0;">Install</button>
    <button id="btn-close-install" class="btn btn-secondary btn-icon-only" style="width:28px; height:28px; flex-shrink:0;">✕</button>
  `;

  document.body.appendChild(banner);

  banner.querySelector('#btn-do-install').addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      console.log('PWA installation choice:', choice.outcome);
      deferredInstallPrompt = null;
      banner.remove();
    }
  });

  banner.querySelector('#btn-close-install').addEventListener('click', () => {
    banner.remove();
  });
}

function showUpdateBanner() {
  const toast = document.createElement('div');
  toast.className = 'toast toast-success show';
  toast.style.cssText = 'position:fixed; bottom:20px; left:20px; z-index:99999;';
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">TEXSUS Update Available</div>
      <div class="toast-message">A newer version of the PWA is ready. Click to refresh.</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="window.location.reload()">Refresh</button>
  `;
  document.body.appendChild(toast);
}

function showConnectivityToast(isOnline) {
  const toast = document.createElement('div');
  toast.className = `toast ${isOnline ? 'toast-success' : 'toast-warning'} show`;
  toast.style.cssText = 'position:fixed; top:20px; right:20px; z-index:99999;';
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${isOnline ? 'Online Reconnected' : 'Offline Mode Active'}</div>
      <div class="toast-message">${isOnline ? 'Network telemetry synchronized.' : 'Cached data and offline screens available.'}</div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
