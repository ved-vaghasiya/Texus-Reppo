// js/router.js - Dynamic Hash & View Router with Role Guards

import { store } from './storage/store.js';
import { Onboarding } from './auth/onboarding.js';
import { RoleSelector } from './auth/role-selector.js';
import { CustomerView } from './customer/customer-view.js';
import { DriverView } from './driver/driver-view.js';
import { AdminView } from './admin/admin-view.js';
import { OwnerView } from './owner/owner-view.js';
import { Animator } from './animations/animator.js';

class AppRouter {
  constructor() {
    this.appRoot = null;
    this.currentRoute = null;
  }

  init(rootElement) {
    this.appRoot = rootElement;
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(route) {
    window.location.hash = route;
  }

  handleRoute() {
    let hash = window.location.hash.replace('#', '') || 'splash';
    this.currentRoute = hash;

    if (!this.appRoot) return;

    // Splash route
    if (hash === 'splash') {
      this.renderSplash();
      return;
    }

    // Role Selector route
    if (hash === 'role-select') {
      this.appRoot.innerHTML = '';
      RoleSelector.render(this.appRoot, (role) => {
        this.navigate(role);
      });
      Animator.animateViewTransition(this.appRoot);
      return;
    }

    // Role-specific screens
    const role = store.getCurrentRole();

    if (hash === 'customer') {
      store.setSession('customer', store.getCurrentUser());
      this.appRoot.innerHTML = '';
      CustomerView.render(this.appRoot);
      Animator.animateViewTransition(this.appRoot);
    } 
    else if (hash === 'driver') {
      store.setSession('driver', store.getCurrentUser());
      this.appRoot.innerHTML = '';
      DriverView.render(this.appRoot);
      Animator.animateViewTransition(this.appRoot);
    } 
    else if (hash === 'admin') {
      store.setSession('admin', store.getCurrentUser());
      this.appRoot.innerHTML = '';
      AdminView.render(this.appRoot);
      Animator.animateViewTransition(this.appRoot);
    } 
    else if (hash === 'owner') {
      store.setSession('owner', store.getCurrentUser());
      this.appRoot.innerHTML = '';
      OwnerView.render(this.appRoot);
      Animator.animateViewTransition(this.appRoot);
    } 
    else {
      // Default fallback
      this.navigate('role-select');
    }
  }

  renderSplash() {
    this.appRoot.innerHTML = `
      <div class="splash-screen" style="position:fixed; inset:0; background:var(--bg-base); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
        <div class="ambient-glow ambient-glow-1"></div>
        <div class="ambient-glow ambient-glow-2"></div>

        <div id="splash-logo" class="brand-logo-badge" style="width:96px; height:96px; border-radius:var(--radius-xl); font-size:44px; margin-bottom:20px; box-shadow:var(--shadow-neon);">
          <svg class="lucide-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5.5 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M18.5 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M15 6h-3l-3 7h7.5"/><path d="M12 13l-4-4"/><circle cx="15" cy="5" r="1"/>
          </svg>
        </div>

        <div id="splash-text">
          <h1 class="brand-title" style="font-size:3.2rem; letter-spacing:4px; margin-bottom:8px;">TEXSUS</h1>
          <p class="brand-tagline" style="font-size:1.1rem; letter-spacing:2px;">RIDE BEYOND LIMITS</p>
          <div style="margin-top:24px;">
            <span class="spinner" style="width:24px; height:24px; border-width:2.5px;"></span>
          </div>
        </div>
      </div>
    `;

    const logo = this.appRoot.querySelector('#splash-logo');
    const text = this.appRoot.querySelector('#splash-text');

    Animator.animateSplash(logo, text, () => {
      // After splash, check onboarding
      if (Onboarding.shouldShow()) {
        Onboarding.render(this.appRoot, () => {
          this.navigate('role-select');
        });
      } else {
        this.navigate('role-select');
      }
    });
  }
}

export const router = new AppRouter();
