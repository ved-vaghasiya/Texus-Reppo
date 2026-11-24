// js/auth/role-selector.js - 3D Role Selection Cards, Quick Demo Access & Simulated Auth Modals

import { AuthService } from '../services/auth-service.js';
import { Animator } from '../animations/animator.js';
import { renderIcon } from '../utils/icons.js';
import { i18n } from '../utils/i18n.js';

export const RoleSelector = {
  render(container, onRoleSelected) {
    const creds = AuthService.getDemoCredentials();

    container.innerHTML = `
      <div class="role-selector-view" style="padding: 30px 20px; max-width: 1200px; margin: 0 auto;">
        <!-- Header Wordmark & Intro -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display:inline-flex; align-items:center; gap:12px; margin-bottom:12px;" class="animate-float">
            <div class="brand-logo-badge" style="width:52px; height:52px; font-size:24px;">
              ${renderIcon('bike', 28)}
            </div>
            <h1 class="brand-title" style="font-size:2.8rem; letter-spacing:3px;">TEXSUS</h1>
          </div>
          <p class="brand-tagline" style="font-size:1rem; letter-spacing:2px; margin-bottom:8px;">${i18n.t('tagline')}</p>
          <p style="color:var(--text-secondary); max-width:600px; margin:0 auto; font-size:0.95rem;">
            Select any role below to experience the complete futuristic bike taxi ecosystem. Fast, interactive, and powered by simulated local storage.
          </p>
        </div>

        <!-- 4 Role Cards Grid -->
        <div class="role-cards-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px; margin-bottom:40px;">
          
          <!-- 1. CUSTOMER -->
          <div class="card-3d card-neon role-card" data-role="customer" style="display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div class="empty-icon-wrap" style="width:48px; height:48px; margin:0; background:rgba(157,0,255,0.15); color:var(--color-primary-light);">
                  ${renderIcon('user', 24)}
                </div>
                <span class="badge badge-purple">PASSENGER</span>
              </div>
              <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Customer</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
                Instant & multi-stop booking, manual driver selection, 3D animated route tracking, and multi-payment checkout.
              </p>
              <ul style="font-size:0.8rem; color:var(--text-muted); margin-bottom:20px; display:flex; flex-direction:column; gap:6px;">
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} 12-Step Booking Workflow</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} 5 Bike Categories</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Round Trip & Recurring</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} 3s SOS Defense Suite</li>
              </ul>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary btn-block btn-demo-access" data-role="customer">
                ${renderIcon('zap', 16)} One-Click Demo
              </button>
              <button class="btn btn-outline btn-block btn-sm btn-open-auth" data-role="customer">
                ${renderIcon('lock', 14)} Phone / Google Login
              </button>
            </div>
          </div>

          <!-- 2. DRIVER -->
          <div class="card-3d card-neon role-card" data-role="driver" style="display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div class="empty-icon-wrap" style="width:48px; height:48px; margin:0; background:rgba(0,242,254,0.15); color:var(--color-accent);">
                  ${renderIcon('bike', 24)}
                </div>
                <span class="badge badge-info">CAPTAIN</span>
              </div>
              <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Driver</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
                Online/offline cockpit, 30s ride countdown popups, document registration, and transparent payout calculations.
              </p>
              <ul style="font-size:0.8rem; color:var(--text-muted); margin-bottom:20px; display:flex; flex-direction:column; gap:6px;">
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} 30s Acceptance Timer</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Active Vehicle Switcher</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Turn-by-Turn Navigation</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Document Verification</li>
              </ul>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary btn-block btn-demo-access" data-role="driver" style="background:linear-gradient(135deg,#00b0ff,#0069c0);">
                ${renderIcon('zap', 16)} One-Click Demo
              </button>
              <button class="btn btn-outline btn-block btn-sm btn-open-auth" data-role="driver">
                ${renderIcon('lock', 14)} Phone OTP Login
              </button>
            </div>
          </div>

          <!-- 3. ADMIN -->
          <div class="card-3d card-neon role-card" data-role="admin" style="display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div class="empty-icon-wrap" style="width:48px; height:48px; margin:0; background:rgba(255,179,0,0.15); color:var(--color-warning);">
                  ${renderIcon('sliders', 24)}
                </div>
                <span class="badge badge-warning">OPERATIONS</span>
              </div>
              <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Admin</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
                10-screen operations hub to approve drivers, modify per-km pricing, adjust waiting charges, and manage tickets.
              </p>
              <ul style="font-size:0.8rem; color:var(--text-muted); margin-bottom:20px; display:flex; flex-direction:column; gap:6px;">
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Driver Doc Approvals</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Fare & Waiting Controls</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Coupon & Offer Engine</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Comprehensive Audit Logs</li>
              </ul>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary btn-block btn-demo-access" data-role="admin" style="background:linear-gradient(135deg,#ff9100,#c66900);">
                ${renderIcon('zap', 16)} One-Click Demo
              </button>
              <button class="btn btn-outline btn-block btn-sm btn-open-auth" data-role="admin">
                ${renderIcon('lock', 14)} Email Login
              </button>
            </div>
          </div>

          <!-- 4. OWNER -->
          <div class="card-3d card-neon role-card" data-role="owner" style="display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div class="empty-icon-wrap" style="width:48px; height:48px; margin:0; background:rgba(0,230,118,0.15); color:var(--color-success);">
                  ${renderIcon('award', 24)}
                </div>
                <span class="badge badge-success">EXECUTIVE</span>
              </div>
              <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">Owner</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
                C-level executive analytics, SVG revenue charts, ₹20 platform commission audits, and administrator accounts.
              </p>
              <ul style="font-size:0.8rem; color:var(--text-muted); margin-bottom:20px; display:flex; flex-direction:column; gap:6px;">
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Dynamic SVG Charts</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Revenue & Payout Split</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} Admin Staff Management</li>
                <li style="display:flex; align-items:center; gap:6px;">${renderIcon('check', 14, 'text-success')} CSV / Financial Exports</li>
              </ul>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary btn-block btn-demo-access" data-role="owner" style="background:linear-gradient(135deg,#00e676,#00a152); color:#032910;">
                ${renderIcon('zap', 16)} One-Click Demo
              </button>
              <button class="btn btn-outline btn-block btn-sm btn-open-auth" data-role="owner">
                ${renderIcon('lock', 14)} Executive Login
              </button>
            </div>
          </div>

        </div>

        <!-- Fictional Demo Credentials Quick Reference (Section 6 Requirement) -->
        <div class="card-3d" style="background:var(--bg-surface-elevated); padding:20px 24px; border-radius:var(--radius-lg);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              ${renderIcon('fileText', 20, 'text-neon')}
              <h4 style="font-size:1.05rem; font-weight:700;">Simulated Demo Credentials Reference</h4>
            </div>
            <span class="badge badge-purple">No real phone, OTP or passwords needed</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; font-size:0.85rem;">
            <div style="padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <div style="font-weight:700; color:var(--color-primary-light);">Customer (Aarav Patel)</div>
              <div style="color:var(--text-secondary); margin-top:4px;">Phone: <b>${creds.customer.phone}</b></div>
              <div style="color:var(--text-muted);">Demo OTP: <b>4021</b></div>
            </div>
            <div style="padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <div style="font-weight:700; color:var(--color-accent);">Driver (Vikram Thakor)</div>
              <div style="color:var(--text-secondary); margin-top:4px;">Phone: <b>${creds.driver.phone}</b></div>
              <div style="color:var(--text-muted);">Demo OTP: <b>4021</b></div>
            </div>
            <div style="padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <div style="font-weight:700; color:var(--color-warning);">Admin (Kavita Iyer)</div>
              <div style="color:var(--text-secondary); margin-top:4px;">Email: <b>${creds.admin.email}</b></div>
              <div style="color:var(--text-muted);">Pass: <b>${creds.admin.pass}</b></div>
            </div>
            <div style="padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <div style="font-weight:700; color:var(--color-success);">Owner (Vikramaditya S.)</div>
              <div style="color:var(--text-secondary); margin-top:4px;">Email: <b>${creds.owner.email}</b></div>
              <div style="color:var(--text-muted);">Pass: <b>${creds.owner.pass}</b></div>
            </div>
          </div>
        </div>

        <!-- Auth Modal Container -->
        <div id="auth-modal-root"></div>
      </div>
    `;

    // Attach 3D tilt
    container.querySelectorAll('.role-card').forEach(card => {
      Animator.attach3DTilt(card, 8);
    });

    // One-Click Demo Access buttons
    container.querySelectorAll('.btn-demo-access').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const role = btn.getAttribute('data-role');
        AuthService.loginAsDemoRole(role);
        if (onRoleSelected) onRoleSelected(role);
      });
    });

    // Open Auth Modal
    container.querySelectorAll('.btn-open-auth').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const role = btn.getAttribute('data-role');
        RoleSelector.showAuthModal(role, onRoleSelected);
      });
    });
  },

  showAuthModal(role, onRoleSelected) {
    const root = document.getElementById('auth-modal-root');
    if (!root) return;

    let modalHTML = '';
    const creds = AuthService.getDemoCredentials()[role];

    if (role === 'customer') {
      modalHTML = `
        <div class="modal-overlay active" id="auth-modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Customer Sign In</h3>
              <button class="modal-close" id="btn-close-modal">${renderIcon('x', 18)}</button>
            </div>
            
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
              Enter your mobile number to receive a simulated 4-digit verification code.
            </p>

            <div class="form-group">
              <label class="form-label">Phone Number (India)</label>
              <div class="input-wrapper">
                <span class="input-icon">${renderIcon('phone', 18)}</span>
                <input type="tel" id="input-phone" class="form-input input-with-icon" value="${creds.phone}">
              </div>
            </div>

            <div class="form-group" id="otp-group" style="margin-bottom:24px;">
              <label class="form-label">
                <span>Enter 4-Digit Demo OTP</span>
                <span class="badge badge-purple" style="cursor:pointer;" id="badge-autofill">Use 4021</span>
              </label>
              <input type="text" id="input-otp" class="form-input" placeholder="e.g. 4021" maxlength="4" style="text-align:center; font-size:1.4rem; letter-spacing:8px; font-weight:700;">
            </div>

            <button class="btn btn-primary btn-block btn-lg" id="btn-submit-otp" style="margin-bottom:16px;">
              Verify & Enter Customer App
            </button>

            <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
              <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
              <span style="font-size:0.8rem; color:var(--text-muted);">OR</span>
              <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
            </div>

            <button class="btn btn-secondary btn-block" id="btn-google-login" style="display:flex; gap:10px;">
              <span style="font-weight:700; color:#ea4335;">G</span> Continue with Google (Simulation)
            </button>
          </div>
        </div>
      `;
    } else if (role === 'driver') {
      modalHTML = `
        <div class="modal-overlay active" id="auth-modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Captain (Driver) Sign In</h3>
              <button class="modal-close" id="btn-close-modal">${renderIcon('x', 18)}</button>
            </div>
            
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
              Sign in with your registered phone number to access your ride requests and earnings.
            </p>

            <div class="form-group">
              <label class="form-label">Registered Phone Number</label>
              <div class="input-wrapper">
                <span class="input-icon">${renderIcon('phone', 18)}</span>
                <input type="tel" id="input-phone" class="form-input input-with-icon" value="${creds.phone}">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:24px;">
              <label class="form-label">
                <span>Enter 4-Digit Demo OTP</span>
                <span class="badge badge-purple" style="cursor:pointer;" id="badge-autofill">Use 4021</span>
              </label>
              <input type="text" id="input-otp" class="form-input" placeholder="4021" maxlength="4" style="text-align:center; font-size:1.4rem; letter-spacing:8px; font-weight:700;">
            </div>

            <button class="btn btn-primary btn-block btn-lg" id="btn-submit-otp">
              Verify & Launch Cockpit
            </button>
          </div>
        </div>
      `;
    } else {
      // Admin / Owner Email login
      modalHTML = `
        <div class="modal-overlay active" id="auth-modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">${role === 'admin' ? 'Admin Portal Login' : 'Executive Owner Suite'}</h3>
              <button class="modal-close" id="btn-close-modal">${renderIcon('x', 18)}</button>
            </div>
            
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
              Enter administrative credentials to access management controls and fiscal telemetry.
            </p>

            <div class="form-group">
              <label class="form-label">Administrative Email</label>
              <input type="email" id="input-email" class="form-input" value="${creds.email}">
            </div>

            <div class="form-group" style="margin-bottom:24px;">
              <label class="form-label">Password</label>
              <input type="password" id="input-pass" class="form-input" value="${creds.pass}">
            </div>

            <button class="btn btn-primary btn-block btn-lg" id="btn-submit-creds">
              Authenticate & Open Dashboard
            </button>
          </div>
        </div>
      `;
    }

    root.innerHTML = modalHTML;

    // Attach listeners
    const overlay = root.querySelector('#auth-modal-overlay');
    root.querySelector('#btn-close-modal').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    const autofillBadge = root.querySelector('#badge-autofill');
    if (autofillBadge) {
      autofillBadge.addEventListener('click', () => {
        root.querySelector('#input-otp').value = '4021';
      });
    }

    const btnSubmitOtp = root.querySelector('#btn-submit-otp');
    if (btnSubmitOtp) {
      btnSubmitOtp.addEventListener('click', () => {
        AuthService.loginAsDemoRole(role);
        overlay.classList.remove('active');
        if (onRoleSelected) onRoleSelected(role);
      });
    }

    const btnGoogle = root.querySelector('#btn-google-login');
    if (btnGoogle) {
      btnGoogle.addEventListener('click', () => {
        AuthService.simulateGoogleLogin();
        overlay.classList.remove('active');
        if (onRoleSelected) onRoleSelected('customer');
      });
    }

    const btnSubmitCreds = root.querySelector('#btn-submit-creds');
    if (btnSubmitCreds) {
      btnSubmitCreds.addEventListener('click', () => {
        AuthService.loginAsDemoRole(role);
        overlay.classList.remove('active');
        if (onRoleSelected) onRoleSelected(role);
      });
    }
  }
};
