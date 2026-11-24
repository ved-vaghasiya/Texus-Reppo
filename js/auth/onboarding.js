// js/auth/onboarding.js - Interactive 3D Onboarding Carousel

import { renderIcon } from '../utils/icons.js';

const ONBOARDING_KEY = 'texsus_onboarding_completed_v1';

export const Onboarding = {
  shouldShow() {
    return localStorage.getItem(ONBOARDING_KEY) !== 'true';
  },

  markCompleted() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },

  reset() {
    localStorage.removeItem(ONBOARDING_KEY);
  },

  render(container, onComplete) {
    let currentSlide = 0;
    const slides = [
      {
        icon: 'bike',
        tag: 'NEXT-GEN COMMUTE',
        title: 'Ride Beyond Limits',
        desc: 'Lightning-fast bike taxi bookings across Kalol, Gandhinagar, and Ahmedabad with zero surge pricing and transparent fares.'
      },
      {
        icon: 'sliders',
        tag: 'TOTAL CONTROL',
        title: 'Manual Driver Selection',
        desc: 'Review verified driver ratings, bike models, arrival ETAs, and hand-pick the exact driver you trust for every journey.'
      },
      {
        icon: 'shield',
        tag: 'UNCOMPROMISED SAFETY',
        title: '3D Tracking & SOS Defense',
        desc: 'Live 3D telemetry tracking, demo ride OTP verification, and 3-second SOS integration with 112 emergency response.'
      }
    ];

    function draw() {
      const s = slides[currentSlide];
      container.innerHTML = `
        <div class="onboarding-overlay" style="position:fixed;inset:0;background:var(--bg-base);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;">
          <div class="ambient-glow ambient-glow-1"></div>
          <div class="ambient-glow ambient-glow-2"></div>

          <div class="card-3d perspective-container" style="max-width:440px;width:100%;text-align:center;padding:36px 28px;position:relative;z-index:10;">
            <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
              <button id="btn-skip-onboard" class="btn btn-outline btn-sm" style="font-size:0.75rem;">Skip Intro</button>
            </div>

            <div class="empty-icon-wrap animate-float" style="width:90px;height:90px;margin:0 auto 20px;background:linear-gradient(135deg,rgba(157,0,255,0.25),rgba(0,242,254,0.15));border:1px solid var(--border-glow);">
              ${renderIcon(s.icon, 44, 'text-neon')}
            </div>

            <span class="badge badge-purple" style="margin-bottom:12px;">${s.tag}</span>
            <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:12px;color:var(--text-primary);">${s.title}</h2>
            <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.6;margin-bottom:28px;">${s.desc}</p>

            <!-- Indicators -->
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:28px;">
              ${slides.map((_, i) => `
                <div style="width:${i === currentSlide ? '28px' : '8px'};height:8px;border-radius:4px;background:${i === currentSlide ? 'var(--color-primary)' : 'var(--border-medium)'};transition:all 0.3s ease;"></div>
              `).join('')}
            </div>

            <button id="btn-next-onboard" class="btn btn-primary btn-block btn-lg" style="box-shadow:var(--shadow-neon);">
              ${currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
              ${renderIcon('chevronRight', 18)}
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-skip-onboard').addEventListener('click', () => {
        Onboarding.markCompleted();
        container.innerHTML = '';
        if (onComplete) onComplete();
      });

      container.querySelector('#btn-next-onboard').addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          draw();
        } else {
          Onboarding.markCompleted();
          container.innerHTML = '';
          if (onComplete) onComplete();
        }
      });
    }

    draw();
  }
};
