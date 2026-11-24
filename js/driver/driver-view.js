// js/driver/driver-view.js - Complete 7-Screen Driver Application & Cockpit

import { store } from '../storage/store.js';
import { CityMap } from '../maps/city-map.js';
import { renderIcon } from '../utils/icons.js';
import { i18n } from '../utils/i18n.js';
import { audioService } from '../services/audio-service.js';

export const DriverView = {
  currentTab: 'dashboard', // dashboard, requests, navigation, earnings, history, documents, profile
  activeRideRequest: null,
  countdownTimer: null,
  countdownSeconds: 30,

  render(container) {
    const driver = store.getCurrentUser() || store.get('drivers')[0];
    const isOnline = driver.isOnline;

    container.innerHTML = `
      <div class="driver-mobile-frame view-container" style="max-width:540px; margin:0 auto;">
        <!-- Driver Cockpit Header -->
        <header class="app-header" style="position:sticky; top:0; z-index:100; padding:12px 18px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="brand-logo-badge" style="width:36px; height:36px; background:linear-gradient(135deg,#00b0ff,#0069c0);">
              ${renderIcon('bike', 20)}
            </div>
            <div>
              <div style="font-size:1.05rem; font-weight:800; color:var(--text-primary); line-height:1;">CAPTAIN COCKPIT</div>
              <div style="font-size:0.65rem; color:var(--color-accent);">${driver.name} • ${driver.vehicle.model}</div>
            </div>
          </div>

          <!-- Online / Offline Toggle Switch (Section 11) -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; font-weight:700; color:${isOnline ? 'var(--color-success)' : 'var(--text-muted)'};" id="status-label">
              ${isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
            <label class="switch">
              <input type="checkbox" id="driver-online-toggle" ${isOnline ? 'checked' : ''}>
              <span class="slider" style="${isOnline ? 'background:var(--color-success); border-color:var(--color-success);' : ''}"></span>
            </label>
          </div>
        </header>

        <!-- Driver Dynamic Main Content -->
        <main id="driver-main-content" style="padding:16px; min-height:640px;">
          <!-- Loaded dynamically based on currentTab -->
        </main>

        <!-- Driver Mobile Bottom Navigation -->
        <nav class="bottom-nav">
          <button class="nav-item ${this.currentTab === 'dashboard' ? 'active' : ''}" data-dtab="dashboard">
            <span class="nav-icon">${renderIcon('activity', 20)}</span>
            <span>Dashboard</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'navigation' ? 'active' : ''}" data-dtab="navigation">
            <span class="nav-icon">${renderIcon('navigation', 20)}</span>
            <span>Route</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'earnings' ? 'active' : ''}" data-dtab="earnings">
            <span class="nav-icon">${renderIcon('dollarSign', 20)}</span>
            <span>Earnings</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'documents' ? 'active' : ''}" data-dtab="documents">
            <span class="nav-icon">${renderIcon('fileText', 20)}</span>
            <span>Docs</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'profile' ? 'active' : ''}" data-dtab="profile">
            <span class="nav-icon">${renderIcon('user', 20)}</span>
            <span>Profile</span>
            <div class="active-dot"></div>
          </button>
        </nav>
      </div>

      <!-- Full-Screen 30s Request Overlay Container -->
      <div id="driver-modal-root"></div>
    `;

    // Navigation item listeners
    container.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-dtab');
        this.switchTab(tab, container);
      });
    });

    // Online/Offline Toggle Listener
    const toggle = container.querySelector('#driver-online-toggle');
    if (toggle) {
      toggle.addEventListener('change', (e) => {
        driver.isOnline = e.target.checked;
        store.upsert('drivers', driver);
        store.setSession('driver', driver);
        audioService.playNotification();
        this.render(container);
      });
    }

    this.renderActiveTab(container);
  },

  switchTab(tab, container) {
    this.currentTab = tab;
    container.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-dtab') === tab);
    });
    this.renderActiveTab(container);
  },

  renderActiveTab(container) {
    const main = container.querySelector('#driver-main-content');
    if (!main) return;

    if (this.currentTab === 'dashboard') this.renderDashboardScreen(main, container);
    else if (this.currentTab === 'navigation') this.renderNavigationScreen(main, container);
    else if (this.currentTab === 'earnings') this.renderEarningsScreen(main, container);
    else if (this.currentTab === 'documents') this.renderDocumentsScreen(main, container);
    else if (this.currentTab === 'profile') this.renderProfileScreen(main, container);
  },

  // ================= 1. DASHBOARD SCREEN =================
  renderDashboardScreen(main, container) {
    const driver = store.getCurrentUser() || store.get('drivers')[0];
    const isOnline = driver.isOnline;

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Status Banner -->
        <div class="card-3d ${isOnline ? 'card-neon' : ''}" style="padding:14px 18px; display:flex; align-items:center; justify-content:space-between; border-color:${isOnline ? 'var(--color-success)' : 'var(--border-subtle)'};">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:12px; height:12px; border-radius:50%; background:${isOnline ? 'var(--color-success)' : 'var(--text-muted)'}; box-shadow:0 0 10px ${isOnline ? 'var(--color-success)' : 'transparent'};"></div>
            <div>
              <div style="font-weight:700; font-size:0.95rem;">${isOnline ? 'Ready for Rides' : 'Cockpit Offline'}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${isOnline ? 'Simulating requests in Kalol/Ahmedabad' : 'Toggle online above to receive ride requests'}</div>
            </div>
          </div>
          <span class="badge ${isOnline ? 'badge-success' : 'badge-purple'}">${isOnline ? 'ACTIVE' : 'IDLE'}</span>
        </div>

        <!-- 3D City Map Preview -->
        <div id="driver-map-container" style="height:220px; width:100%;"></div>

        <!-- Key Metrics Cards (Section 11) -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
          <div class="card-3d" style="padding:12px; text-align:center;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Today's Net</div>
            <div style="font-size:1.35rem; font-weight:800; color:var(--color-success); margin-top:4px;">₹1,240</div>
          </div>
          <div class="card-3d" style="padding:12px; text-align:center;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Rides</div>
            <div style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:4px;">14</div>
          </div>
          <div class="card-3d" style="padding:12px; text-align:center;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Rating</div>
            <div style="font-size:1.35rem; font-weight:800; color:var(--color-warning); margin-top:4px;">★ 4.9</div>
          </div>
        </div>

        <!-- Active Vehicle Selector (Section 9 & 11) -->
        <div class="card-3d" style="padding:16px;">
          <div style="font-size:0.85rem; font-weight:700; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>Active Vehicle (${driver.category.toUpperCase()})</span>
            <span class="badge badge-purple">${driver.vehicle.regNo}</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
            ${driver.vehicle.model} (${driver.vehicle.color}, ${driver.vehicle.year})
          </div>
          <button id="btn-switch-vehicle" class="btn btn-secondary btn-block btn-sm">
            ${renderIcon('bike', 14)} Switch Active Registered Bike
          </button>
        </div>

        <!-- Simulate Incoming Request Button (Prompt Section 11 & 34) -->
        <div class="card-3d" style="padding:16px; background:linear-gradient(135deg,rgba(0,176,255,0.15),rgba(157,0,255,0.1)); border:1px solid var(--border-glow);">
          <div style="font-size:0.9rem; font-weight:700; margin-bottom:4px;">Simulate Customer Ride Request</div>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
            Test the full-screen 30-second countdown request notification, accept/reject lifecycle, and timeout handler.
          </p>
          <button id="btn-trigger-demo-request" class="btn btn-primary btn-block" style="background:linear-gradient(135deg,#00b0ff,#0069c0);">
            ${renderIcon('zap', 16)} Trigger Incoming Ride Request (30s Timer)
          </button>
        </div>
      </div>
    `;

    CityMap.render('driver-map-container', { showRoute: false });

    main.querySelector('#btn-trigger-demo-request').addEventListener('click', () => {
      this.triggerIncomingRideRequest();
    });

    main.querySelector('#btn-switch-vehicle').addEventListener('click', () => {
      const models = ['Bajaj Pulsar 150', 'Royal Enfield Classic 350', 'Ather 450X Gen 3', 'Honda Activa 6G'];
      const current = driver.vehicle.model;
      const next = models[(models.indexOf(current) + 1) % models.length];
      driver.vehicle.model = next;
      store.upsert('drivers', driver);
      store.setSession('driver', driver);
      alert(`Active bike changed to: ${next}`);
      this.renderDashboardScreen(main, container);
    });
  },

  // ================= 2. FULL-SCREEN 30-SECOND RIDE REQUEST POPUP (Section 11) =================
  triggerIncomingRideRequest() {
    const root = document.getElementById('driver-modal-root');
    if (!root) return;

    this.countdownSeconds = 30;
    audioService.playNotification();

    const requestData = {
      id: `TXS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Priya Sharma',
      customerPhone: '+91 98250 11002',
      pickup: 'Panchvati Garden, Kalol',
      destination: 'Infocity Circle, Gandhinagar',
      distanceKm: 8.4,
      grossFare: 110,
      platformFee: 20,
      netEarnings: 90,
      category: 'Standard Bike'
    };
    this.activeRideRequest = requestData;

    root.innerHTML = `
      <div class="modal-overlay active" id="ride-request-overlay" style="z-index:99999;">
        <div class="modal-content card-neon" style="max-width:440px; padding:28px 22px; text-align:center; border:2px solid var(--color-accent); box-shadow:0 0 50px rgba(0,242,254,0.35);">
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="badge badge-info" style="font-size:0.8rem;">NEW RIDE INCOMING</span>
            <span class="badge badge-purple">${requestData.category}</span>
          </div>

          <!-- 30-Second Countdown Dial -->
          <div style="position:relative; width:90px; height:90px; margin:0 auto 16px;">
            <div class="empty-icon-wrap" style="width:90px; height:90px; margin:0; background:rgba(0,242,254,0.15); border:3px solid var(--color-accent);">
              <span id="countdown-number" style="font-size:2.2rem; font-weight:900; color:var(--color-accent);">30</span>
            </div>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:16px;">
            Seconds to accept before auto-timeout
          </div>

          <!-- Earnings Highlight -->
          <div style="background:var(--bg-surface-elevated); padding:12px; border-radius:var(--radius-md); margin-bottom:16px;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Captain Net Earnings (after ₹20 platform fee):</div>
            <div style="font-size:1.8rem; font-weight:900; color:var(--color-success);">₹${requestData.netEarnings}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${requestData.distanceKm} km trip</div>
          </div>

          <!-- Pickup & Drop Details -->
          <div style="text-align:left; font-size:0.85rem; display:flex; flex-direction:column; gap:8px; margin-bottom:20px; background:var(--bg-surface-elevated); padding:14px; border-radius:var(--radius-md);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--color-success);">${renderIcon('mapPin', 16)}</span>
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted);">PICKUP</div>
                <div style="font-weight:700;">${requestData.pickup}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; border-top:1px dashed var(--border-subtle); padding-top:8px;">
              <span style="color:var(--color-primary);">${renderIcon('navigation', 16)}</span>
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted);">DESTINATION</div>
                <div style="font-weight:700;">${requestData.destination}</div>
              </div>
            </div>
          </div>

          <!-- Accept & Reject Action Buttons (Section 11) -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button id="btn-reject-request" class="btn btn-outline btn-lg" style="color:var(--color-danger); border-color:rgba(255,23,68,0.4);">
              ${renderIcon('x', 18)} Reject
            </button>
            <button id="btn-accept-request" class="btn btn-success btn-lg" style="box-shadow:0 0 20px rgba(0,230,118,0.4);">
              ${renderIcon('check', 18)} Accept Ride
            </button>
          </div>
        </div>
      </div>
    `;

    // 30s Countdown interval
    clearInterval(this.countdownTimer);
    const countEl = root.querySelector('#countdown-number');
    this.countdownTimer = setInterval(() => {
      this.countdownSeconds--;
      if (this.countdownSeconds > 0) {
        if (countEl) countEl.textContent = this.countdownSeconds;
      } else {
        // Timed out!
        clearInterval(this.countdownTimer);
        alert('Ride request timed out (30 seconds elapsed). Passed to next available Captain.');
        root.innerHTML = '';
      }
    }, 1000);

    // Accept Listener
    root.querySelector('#btn-accept-request').addEventListener('click', () => {
      clearInterval(this.countdownTimer);
      audioService.playBookingChime();
      alert(`Ride accepted! Navigate to pickup: ${requestData.pickup}`);
      root.innerHTML = '';
      this.currentTab = 'navigation';
      const container = document.querySelector('.driver-mobile-frame').parentElement;
      this.render(container);
    });

    // Reject Listener
    root.querySelector('#btn-reject-request').addEventListener('click', () => {
      clearInterval(this.countdownTimer);
      alert('Ride declined. Customer will be matched with an alternate Captain.');
      root.innerHTML = '';
    });
  },

  // ================= 3. NAVIGATION SCREEN (Section 13) =================
  renderNavigationScreen(main, container) {
    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('navigation', 24)} Live Navigation</div>
        <div id="driver-nav-map" style="height:260px; width:100%;"></div>

        <!-- Next Turn Instruction Card -->
        <div class="card-3d card-neon" style="padding:16px; display:flex; align-items:center; gap:14px; background:linear-gradient(90deg, rgba(0,242,254,0.15), rgba(157,0,255,0.1));">
          <div class="empty-icon-wrap" style="width:48px; height:48px; margin:0; background:var(--color-accent); color:#000;">
            ${renderIcon('navigation', 24)}
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--color-accent); text-transform:uppercase; font-weight:800;">Turn Right in 250m</div>
            <div style="font-weight:700; font-size:1.05rem; color:var(--text-primary);">Onto SG Highway Service Road</div>
          </div>
        </div>

        <!-- Trip OTP Entry Box for Captain (Section 13 verification) -->
        <div class="card-3d" style="padding:16px;">
          <div style="font-size:0.85rem; font-weight:700; margin-bottom:4px;">Passenger OTP Verification</div>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">
            Ask passenger for the 4-digit demo ride OTP shown on their screen to authorize and commence journey.
          </p>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <input type="text" id="captain-otp-input" class="form-input" placeholder="e.g. 4021" maxlength="4" style="text-align:center; font-size:1.3rem; letter-spacing:6px; font-weight:800;">
            <button id="btn-verify-captain-otp" class="btn btn-primary" style="white-space:nowrap;">
              ${renderIcon('check', 16)} Verify OTP
            </button>
          </div>
          <button id="btn-complete-driver-trip" class="btn btn-success btn-block">
            ${renderIcon('checkCircle', 16)} End Journey & Collect Fare
          </button>
        </div>
      </div>
    `;

    CityMap.render('driver-nav-map', { showRoute: true, etaMins: 3 });

    main.querySelector('#btn-verify-captain-otp').addEventListener('click', () => {
      const otp = main.querySelector('#captain-otp-input').value;
      if (otp.length === 4) {
        audioService.playNotification();
        alert(`OTP ${otp} successfully verified! Trip started.`);
      } else {
        alert('Please enter a 4-digit OTP.');
      }
    });

    main.querySelector('#btn-complete-driver-trip').addEventListener('click', () => {
      audioService.playPaymentSuccess();
      alert('Trip ended! Fare of ₹90 credited to your driver wallet balance.');
      this.currentTab = 'earnings';
      this.render(container);
    });
  },

  // ================= 4. EARNINGS SCREEN =================
  renderEarningsScreen(main, container) {
    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('dollarSign', 24)} Captain Earnings</div>
        <p class="page-subtitle" style="margin-bottom:12px;">Transparent daily payout calculation with flat ₹20 platform deduction.</p>

        <!-- Balance Card -->
        <div class="card-3d card-neon" style="padding:22px; text-align:center;">
          <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">This Week's Net Payout</div>
          <div style="font-size:2.4rem; font-weight:900; color:var(--color-success); margin:6px 0;">₹7,480</div>
          <span class="badge badge-success">Direct Bank Transfer Scheduled</span>
        </div>

        <!-- Breakdown Table -->
        <div class="card-3d" style="padding:16px;">
          <div style="font-weight:700; margin-bottom:10px;">Weekly Summary</div>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">Total Gross Fares:</span>
              <span style="font-weight:700;">₹9,280</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--color-warning);">
              <span>Platform Commission (₹20 x 90 rides):</span>
              <span>-₹1,800</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--color-success); font-weight:800; border-top:1px solid var(--border-medium); padding-top:6px;">
              <span>Net Driver Earnings:</span>
              <span>₹7,480</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ================= 5. DOCUMENTS SCREEN (Section 12) =================
  renderDocumentsScreen(main, container) {
    const driver = store.getCurrentUser() || store.get('drivers')[0];
    const docs = driver.documents || { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' };

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('fileText', 24)} Driver Registration</div>
        <p class="page-subtitle" style="margin-bottom:10px;">KYC verification status & document resubmission.</p>

        <div class="card-3d" style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <span style="font-weight:700;">Overall Status</span>
            <span class="badge ${driver.approvalStatus === 'Approved' ? 'badge-success' : 'badge-warning'}">${driver.approvalStatus}</span>
          </div>

          <!-- Document checklist -->
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
              <div>
                <div style="font-weight:600; font-size:0.85rem;">Driving Licence (DL)</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Commercial transport endorsement</div>
              </div>
              <span class="badge badge-success">${docs.licence}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
              <div>
                <div style="font-weight:600; font-size:0.85rem;">Vehicle RC Card</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${driver.vehicle.regNo}</div>
              </div>
              <span class="badge ${docs.rc === 'verified' ? 'badge-success' : 'badge-danger'}">${docs.rc}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
              <div>
                <div style="font-weight:600; font-size:0.85rem;">Vehicle Insurance</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Valid 3rd party liability</div>
              </div>
              <span class="badge badge-success">${docs.insurance}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
              <div>
                <div style="font-weight:600; font-size:0.85rem;">Profile Selfie</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Live face verification</div>
              </div>
              <span class="badge badge-success">${docs.selfie}</span>
            </div>
          </div>
        </div>

        <!-- Simulated Document Upload / Resubmission -->
        <div class="card-3d" style="padding:16px;">
          <h4 style="font-weight:700; margin-bottom:8px;">Simulate Document Resubmission</h4>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
            Upload updated document scans for Admin audit approval.
          </p>
          <button id="btn-simulate-upload" class="btn btn-primary btn-block">
            ${renderIcon('download', 14)} Upload Scanned RC Card
          </button>
        </div>
      </div>
    `;

    main.querySelector('#btn-simulate-upload').addEventListener('click', () => {
      docs.rc = 'verified';
      driver.approvalStatus = 'Approved';
      store.upsert('drivers', driver);
      store.setSession('driver', driver);
      store.logAudit(`Driver ${driver.name} uploaded renewed RC Card`);
      alert('RC document uploaded! Status set to Approved.');
      this.renderDocumentsScreen(main, container);
    });
  },

  // ================= 6. PROFILE & SAFETY TUTORIAL SCREEN =================
  renderProfileScreen(main, container) {
    const driver = store.getCurrentUser() || store.get('drivers')[0];

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('user', 24)} Captain Profile</div>

        <div class="card-3d" style="padding:20px; display:flex; align-items:center; gap:16px;">
          <div style="font-size:2.5rem;">${driver.avatar}</div>
          <div>
            <div style="font-size:1.2rem; font-weight:800;">${driver.name}</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">${driver.phone}</div>
            <div style="font-size:0.8rem; color:var(--color-warning); font-weight:700; margin-top:2px;">
              ★ ${driver.rating} (${driver.ratingCount} reviews) • ${driver.completedRides} rides
            </div>
          </div>
        </div>

        <div class="card-3d" style="padding:16px;">
          <h4 style="font-weight:700; margin-bottom:8px;">Driver Safety Protocol</h4>
          <ul style="font-size:0.8rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
            <li>✓ Always provide ISI-marked helmet to pillion passenger</li>
            <li>✓ Never exceed 50 km/h in city traffic limits</li>
            <li>✓ Verify 4-digit ride OTP prior to starting ignition</li>
            <li>✓ Maintain vehicle brakes and tire pressure weekly</li>
          </ul>
        </div>

        <button id="btn-switch-role-drv" class="btn btn-outline btn-block">
          ${renderIcon('refreshCw', 16)} Switch User Role (Demo Selection)
        </button>
      </div>
    `;

    main.querySelector('#btn-switch-role-drv').addEventListener('click', () => {
      window.location.hash = '#role-select';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
};
