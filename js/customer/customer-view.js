// js/customer/customer-view.js - Complete 14-Screen Customer Mobile/Desktop Application

import { store } from '../storage/store.js';
import { BookingService } from '../services/booking-service.js';
import { CityMap } from '../maps/city-map.js';
import { renderIcon } from '../utils/icons.js';
import { i18n } from '../utils/i18n.js';
import { audioService } from '../services/audio-service.js';
import { settings } from '../utils/settings.js';

export const CustomerView = {
  currentTab: 'home',
  bookingState: {
    step: 1, // 1 to 12
    bookingType: 'instant', // instant, scheduled, round_trip, recurring
    pickup: 'Vastrapur Lake, Ahmedabad',
    destination: 'Sindhu Bhavan Road, Ahmedabad',
    stops: [],
    selectedCategory: 'standard',
    selectedDriver: null,
    paymentMethod: 'UPI',
    couponCode: '',
    scheduleDate: '',
    scheduleTime: '',
    roundTripWaitMins: 15,
    recurringPattern: 'daily',
    fare: null
  },

  render(container) {
    const user = store.getCurrentUser() || { name: 'Aarav Patel', loyaltyPoints: 240, referralCode: 'AARAV24' };
    const activeRide = store.getActiveRide();

    container.innerHTML = `
      <div class="customer-mobile-frame view-container">
        <!-- Floating Customer App Header -->
        <header class="app-header" style="position:sticky; top:0; z-index:100; padding:12px 18px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="brand-logo-badge" style="width:36px; height:36px;">
              ${renderIcon('bike', 20)}
            </div>
            <div>
              <div style="font-size:1.1rem; font-weight:800; color:var(--text-primary); line-height:1;">TEXSUS</div>
              <div style="font-size:0.65rem; color:var(--color-primary-light);">${i18n.t('customer')} • ${user.name.split(' ')[0]}</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button id="btn-cust-sos" class="btn btn-danger btn-sm" style="padding:6px 12px; font-size:0.75rem; font-weight:800; border-radius:var(--radius-full); box-shadow:0 0 10px rgba(255,23,68,0.4);">
              ${renderIcon('shield', 14)} SOS
            </button>
            <button id="btn-cust-notifications" class="btn btn-secondary btn-icon-only" style="width:34px; height:34px;" title="Notifications">
              ${renderIcon('bell', 16)}
            </button>
          </div>
        </header>

        <!-- Active Ride Quick Alert Banner (if exists) -->
        ${activeRide && activeRide.status !== 'Completed' && activeRide.status !== 'Cancelled' ? `
          <div id="banner-active-ride" style="background:linear-gradient(90deg, #9d00ff, #00f2fe); padding:10px 16px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; color:#fff;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="spinner" style="width:16px; height:16px; border-width:2px; border-top-color:#fff;"></span>
              <span style="font-size:0.8rem; font-weight:700;">Ride Active (${activeRide.id}) • ${activeRide.status}</span>
            </div>
            <span style="font-size:0.75rem; text-decoration:underline;">View Tracking &rarr;</span>
          </div>
        ` : ''}

        <!-- Dynamic Main Content Area -->
        <main id="customer-main-content" style="padding:16px; min-height:640px;">
          <!-- Loaded dynamically based on currentTab -->
        </main>

        <!-- Mobile Bottom Navigation (5 Core Icons) -->
        <nav class="bottom-nav">
          <button class="nav-item ${this.currentTab === 'home' ? 'active' : ''}" data-tab="home">
            <span class="nav-icon">${renderIcon('bike', 20)}</span>
            <span>Home</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'booking' ? 'active' : ''}" data-tab="booking">
            <span class="nav-icon">${renderIcon('navigation', 20)}</span>
            <span>Book</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'history' ? 'active' : ''}" data-tab="history">
            <span class="nav-icon">${renderIcon('clock', 20)}</span>
            <span>Rides</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'safety' ? 'active' : ''}" data-tab="safety">
            <span class="nav-icon">${renderIcon('shield', 20)}</span>
            <span>Safety</span>
            <div class="active-dot"></div>
          </button>
          <button class="nav-item ${this.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">
            <span class="nav-icon">${renderIcon('user', 20)}</span>
            <span>Account</span>
            <div class="active-dot"></div>
          </button>
        </nav>
      </div>

      <!-- Global Support & Safety Modal Container -->
      <div id="customer-modal-root"></div>
    `;

    // Attach navigation listeners
    container.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab, container);
      });
    });

    // SOS Header Button
    const btnSos = container.querySelector('#btn-cust-sos');
    if (btnSos) {
      btnSos.addEventListener('click', () => this.openSOSModal());
    }

    // Notifications Button
    const btnNotif = container.querySelector('#btn-cust-notifications');
    if (btnNotif) {
      btnNotif.addEventListener('click', () => this.switchTab('notifications', container));
    }

    // Active Ride banner click
    const activeBanner = container.querySelector('#banner-active-ride');
    if (activeBanner) {
      activeBanner.addEventListener('click', () => {
        this.bookingState.step = 11;
        this.switchTab('booking', container);
      });
    }

    // Render initial screen
    this.renderActiveTab(container);
  },

  switchTab(tab, container) {
    this.currentTab = tab;
    container.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    this.renderActiveTab(container);
  },

  renderActiveTab(container) {
    const main = container.querySelector('#customer-main-content');
    if (!main) return;

    if (this.currentTab === 'home') this.renderHomeScreen(main, container);
    else if (this.currentTab === 'booking') this.renderBookingScreen(main, container);
    else if (this.currentTab === 'history') this.renderHistoryScreen(main, container);
    else if (this.currentTab === 'safety') this.renderSafetyScreen(main, container);
    else if (this.currentTab === 'profile') this.renderProfileScreen(main, container);
    else if (this.currentTab === 'offers') this.renderOffersScreen(main, container);
    else if (this.currentTab === 'notifications') this.renderNotificationsScreen(main, container);
    else if (this.currentTab === 'support') this.renderSupportScreen(main, container);
    else if (this.currentTab === 'scheduled') this.renderScheduledScreen(main, container);
  },

  // ================= 1. HOME SCREEN =================
  renderHomeScreen(main, container) {
    const user = store.getCurrentUser();
    const presets = BookingService.getPresetLocations();

    main.innerHTML = `
      <div class="home-screen" style="display:flex; flex-direction:column; gap:18px;">
        <!-- 3D City Map Preview -->
        <div id="home-map-container" style="height:260px; width:100%;"></div>

        <!-- Quick Where-To Card -->
        <div class="card-3d card-neon" style="padding:18px;">
          <div style="font-size:0.8rem; font-weight:700; color:var(--color-primary-light); text-transform:uppercase; margin-bottom:8px;">
            ${i18n.t('whereTo')}
          </div>
          <div class="input-wrapper" style="margin-bottom:12px;">
            <span class="input-icon" style="color:var(--color-success);">${renderIcon('mapPin', 18)}</span>
            <input type="text" id="home-pickup-input" class="form-input input-with-icon" value="${this.bookingState.pickup}">
          </div>
          <div class="input-wrapper" style="margin-bottom:14px;">
            <span class="input-icon" style="color:var(--color-primary);">${renderIcon('navigation', 18)}</span>
            <input type="text" id="home-dest-input" class="form-input input-with-icon" value="${this.bookingState.destination}" placeholder="Enter destination in Gujarat...">
          </div>
          <button id="btn-home-start-booking" class="btn btn-primary btn-block btn-lg" style="box-shadow:var(--shadow-neon);">
            ${renderIcon('bike', 18)} ${i18n.t('bookNow')} &rarr;
          </button>
        </div>

        <!-- Quick Booking Shortcuts -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; text-align:center;">
          <div class="quick-hub-btn card-3d" data-dest="Infocity Circle, Gandhinagar" style="padding:12px 6px; cursor:pointer;">
            <div style="font-size:1.3rem; margin-bottom:4px;">🏢</div>
            <div style="font-size:0.7rem; font-weight:600; color:var(--text-primary);">Infocity</div>
          </div>
          <div class="quick-hub-btn card-3d" data-dest="Panchvati Garden, Kalol" style="padding:12px 6px; cursor:pointer;">
            <div style="font-size:1.3rem; margin-bottom:4px;">🌳</div>
            <div style="font-size:0.7rem; font-weight:600; color:var(--text-primary);">Kalol Hub</div>
          </div>
          <div class="quick-hub-btn card-3d" data-dest="GIFT City Tower 1, Gandhinagar" style="padding:12px 6px; cursor:pointer;">
            <div style="font-size:1.3rem; margin-bottom:4px;">⚡</div>
            <div style="font-size:0.7rem; font-weight:600; color:var(--text-primary);">GIFT City</div>
          </div>
          <div class="quick-hub-btn card-3d" data-dest="Gujarat University, Ahmedabad" style="padding:12px 6px; cursor:pointer;">
            <div style="font-size:1.3rem; margin-bottom:4px;">🎓</div>
            <div style="font-size:0.7rem; font-weight:600; color:var(--text-primary);">Uni Campus</div>
          </div>
        </div>

        <!-- Offers & Loyalty Card Banner -->
        <div class="card-3d" id="card-loyalty-banner" style="background:linear-gradient(135deg,rgba(157,0,255,0.2),rgba(0,242,254,0.1)); border:1px solid var(--border-glow); padding:16px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="empty-icon-wrap" style="width:42px; height:42px; margin:0; background:rgba(157,0,255,0.3); color:#fff;">
              ${renderIcon('award', 22)}
            </div>
            <div>
              <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${user.loyaltyPoints} Loyalty Points</div>
              <div style="font-size:0.75rem; color:var(--color-primary-light);">Redeem for ride discounts &rarr;</div>
            </div>
          </div>
          <span class="badge badge-purple">PROMO</span>
        </div>

        <!-- More Services Row -->
        <div style="display:flex; gap:10px;">
          <button id="btn-open-offers" class="btn btn-secondary btn-block btn-sm" style="flex:1;">
            ${renderIcon('tag', 14)} Offers & Coupons
          </button>
          <button id="btn-open-scheduled" class="btn btn-secondary btn-block btn-sm" style="flex:1;">
            ${renderIcon('calendar', 14)} Scheduled Rides
          </button>
          <button id="btn-open-support" class="btn btn-secondary btn-block btn-sm" style="flex:1;">
            ${renderIcon('headphones', 14)} Help Desk
          </button>
        </div>
      </div>
    `;

    // Render city map
    CityMap.render('home-map-container', { showRoute: false });

    // Handle Start Booking click
    main.querySelector('#btn-home-start-booking').addEventListener('click', () => {
      this.bookingState.pickup = main.querySelector('#home-pickup-input').value;
      this.bookingState.destination = main.querySelector('#home-dest-input').value;
      this.bookingState.step = 3; // Jump directly to categories & stops
      this.switchTab('booking', container);
    });

    // Handle Quick Hub Clicks
    main.querySelectorAll('.quick-hub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.bookingState.destination = btn.getAttribute('data-dest');
        this.bookingState.step = 3;
        this.switchTab('booking', container);
      });
    });

    main.querySelector('#card-loyalty-banner').addEventListener('click', () => this.switchTab('offers', container));
    main.querySelector('#btn-open-offers').addEventListener('click', () => this.switchTab('offers', container));
    main.querySelector('#btn-open-scheduled').addEventListener('click', () => this.switchTab('scheduled', container));
    main.querySelector('#btn-open-support').addEventListener('click', () => this.switchTab('support', container));
  },

  // ================= 2. COMPLETE 12-STEP BOOKING SCREEN =================
  renderBookingScreen(main, container) {
    const s = this.bookingState;
    const distanceKm = BookingService.calculateDistance(s.pickup, s.destination, s.stops);
    s.fare = BookingService.calculateFare(s.selectedCategory, distanceKm, s.bookingType === 'round_trip' ? s.roundTripWaitMins : 0, s.couponCode);

    // Calculate Available Drivers
    const availableDrivers = BookingService.getAvailableDrivers(s.selectedCategory);
    if (!s.selectedDriver && availableDrivers.length > 0) {
      s.selectedDriver = availableDrivers[0];
    }

    main.innerHTML = `
      <div class="booking-screen" style="display:flex; flex-direction:column; gap:16px;">
        
        <!-- Booking Progress Header -->
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="btn-booking-back" class="btn btn-secondary btn-icon-only" style="width:32px; height:32px;">
              ${renderIcon('chevronLeft', 16)}
            </button>
            <h3 style="font-size:1.15rem; font-weight:800;">
              ${s.step <= 10 ? 'Configure Ride' : (s.step === 11 ? 'Live Ride Telemetry' : 'Ride Receipt')}
            </h3>
          </div>
          <span class="badge badge-purple">Step ${s.step} of 12</span>
        </div>

        <!-- 3D City Map (Interactive & Animated) -->
        <div id="booking-map-container" style="height:220px; width:100%;"></div>

        <!-- Step Views -->
        ${this.renderBookingStepContent(s, distanceKm, availableDrivers)}
      </div>
    `;

    // Render city map with route
    CityMap.render('booking-map-container', { 
      showRoute: true, 
      etaMins: s.selectedDriver ? (s.selectedDriver.etaMins || 4) : 4 
    });

    // Attach step-specific listeners
    this.attachBookingStepListeners(main, container);
  },

  renderBookingStepContent(s, distanceKm, availableDrivers) {
    const config = store.get('config');

    // Step 1 to 10: Configuration & Confirmation
    if (s.step <= 10) {
      return `
        <!-- Booking Mode Selector: Instant, Scheduled, Round-Trip, Recurring -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px;">
          <button class="btn btn-sm ${s.bookingType === 'instant' ? 'btn-primary' : 'btn-secondary'} btn-booking-type" data-type="instant" style="font-size:0.7rem; padding:8px 4px;">
            ${renderIcon('zap', 12)} Instant
          </button>
          <button class="btn btn-sm ${s.bookingType === 'scheduled' ? 'btn-primary' : 'btn-secondary'} btn-booking-type" data-type="scheduled" style="font-size:0.7rem; padding:8px 4px;">
            ${renderIcon('calendar', 12)} Later
          </button>
          <button class="btn btn-sm ${s.bookingType === 'round_trip' ? 'btn-primary' : 'btn-secondary'} btn-booking-type" data-type="round_trip" style="font-size:0.7rem; padding:8px 4px;">
            ${renderIcon('refreshCw', 12)} Round
          </button>
          <button class="btn btn-sm ${s.bookingType === 'recurring' ? 'btn-primary' : 'btn-secondary'} btn-booking-type" data-type="recurring" style="font-size:0.7rem; padding:8px 4px;">
            ${renderIcon('clock', 12)} Recurring
          </button>
        </div>

        <!-- Scheduled / Round Trip / Recurring Options -->
        ${s.bookingType === 'scheduled' ? `
          <div class="card-3d" style="padding:12px; background:var(--bg-surface-elevated);">
            <div style="display:flex; gap:10px;">
              <input type="date" id="booking-sched-date" class="form-input" value="${s.scheduleDate || new Date().toISOString().split('T')[0]}">
              <input type="time" id="booking-sched-time" class="form-input" value="${s.scheduleTime || '10:00'}">
            </div>
          </div>
        ` : ''}

        ${s.bookingType === 'round_trip' ? `
          <div class="card-3d" style="padding:12px; background:var(--bg-surface-elevated);">
            <div style="font-size:0.8rem; font-weight:600; margin-bottom:6px;">Round-Trip Destination Waiting Time:</div>
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="range" id="booking-round-wait" min="5" max="60" step="5" value="${s.roundTripWaitMins}" style="flex:1;">
              <span class="badge badge-purple" id="wait-val-badge">${s.roundTripWaitMins} mins</span>
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">First 3 mins free, ₹1/min thereafter.</div>
          </div>
        ` : ''}

        ${s.bookingType === 'recurring' ? `
          <div class="card-3d" style="padding:12px; background:var(--bg-surface-elevated); display:flex; gap:10px;">
            <select id="booking-recurring-pattern" class="form-select">
              <option value="daily" ${s.recurringPattern === 'daily' ? 'selected' : ''}>Daily Commute (Mon - Sat)</option>
              <option value="weekly" ${s.recurringPattern === 'weekly' ? 'selected' : ''}>Weekly Recurring</option>
            </select>
          </div>
        ` : ''}

        <!-- Locations & Up to 5 Intermediate Stops (Section 8) -->
        <div class="card-3d" style="padding:16px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="color:var(--color-success);">${renderIcon('mapPin', 16)}</span>
            <input type="text" id="booking-pickup-val" class="form-input" value="${s.pickup}" placeholder="Pickup location">
          </div>

          <!-- Intermediate Stops List -->
          ${(s.stops || []).map((stop, idx) => `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; padding-left:14px; border-left:2px dashed var(--color-primary);">
              <span style="font-size:0.75rem; color:var(--color-primary-light);">Stop ${idx + 1}</span>
              <input type="text" class="form-input stop-val-input" data-idx="${idx}" value="${stop}">
              <button class="btn btn-outline btn-icon-only btn-remove-stop" data-idx="${idx}" style="width:28px; height:28px; color:var(--color-danger); border-color:rgba(255,23,68,0.3);">
                ${renderIcon('x', 14)}
              </button>
            </div>
          `).join('')}

          ${(s.stops || []).length < 5 ? `
            <button id="btn-add-intermediate-stop" class="btn btn-outline btn-sm" style="font-size:0.75rem; margin-bottom:8px; width:100%;">
              ${renderIcon('plus', 14)} ${i18n.t('addStop')} (Max 5)
            </button>
          ` : ''}

          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--color-primary);">${renderIcon('navigation', 16)}</span>
            <input type="text" id="booking-dest-val" class="form-input" value="${s.destination}" placeholder="Destination">
          </div>
        </div>

        <!-- 5 Bike Categories (Section 9) -->
        <div>
          <div style="font-size:0.9rem; font-weight:700; margin-bottom:10px; display:flex; justify-content:space-between;">
            <span>5 Bike Categories</span>
            <span style="color:var(--color-primary-light); font-size:0.75rem;">Est. ${distanceKm} km</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; margin-bottom:12px;">
            ${['standard', 'premium', 'electric', 'heavy', 'scooter'].map(catKey => {
              const cat = config.categories[catKey];
              const isSelected = s.selectedCategory === catKey;
              return `
                <div class="card-3d cat-choice-card ${isSelected ? 'card-neon' : ''}" data-cat="${catKey}" 
                  style="padding:10px 4px; text-align:center; cursor:pointer; border-color:${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}; background:${isSelected ? 'rgba(157,0,255,0.18)' : 'var(--bg-surface-elevated)'};">
                  <div style="width:36px; height:24px; margin:0 auto 4px;">
                    <img src="./assets/bikes/${catKey}.svg" alt="${cat.name}" style="width:100%; height:100%; object-fit:contain;">
                  </div>
                  <div style="font-size:0.7rem; font-weight:700; color:var(--text-primary); text-transform:capitalize;">${catKey}</div>
                  <div style="font-size:0.65rem; color:var(--color-primary-light); font-weight:800;">₹${cat.baseFare + Math.round(distanceKm * cat.perKm)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Available Drivers & Manual Selection (Step 5, 6, 7) -->
        <div>
          <div style="font-size:0.9rem; font-weight:700; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>Choose Your Captain (Manual Select)</span>
            <span class="badge badge-purple">${availableDrivers.length} Online</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; max-height:190px; overflow-y:auto; padding-right:4px;">
            ${availableDrivers.length === 0 ? `
              <div class="card-3d" style="padding:14px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
                No drivers currently online for ${s.selectedCategory}. Switch category or wait a moment.
              </div>
            ` : availableDrivers.map(drv => {
              const isChosen = s.selectedDriver && s.selectedDriver.id === drv.id;
              return `
                <div class="card-3d drv-choice-card ${isChosen ? 'card-neon' : ''}" data-drvid="${drv.id}" 
                  style="padding:12px 14px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; border-color:${isChosen ? 'var(--color-primary)' : 'var(--border-subtle)'}; background:${isChosen ? 'rgba(157,0,255,0.14)' : 'var(--bg-surface-elevated)'};">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="font-size:1.6rem;">${drv.avatar}</div>
                    <div>
                      <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">${drv.name}</div>
                      <div style="font-size:0.75rem; color:var(--text-secondary);">${drv.vehicle.model} • ${drv.vehicle.regNo}</div>
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <div style="display:flex; align-items:center; gap:3px; color:var(--color-warning); font-size:0.8rem; font-weight:700;">
                      ${renderIcon('star', 12)} ${drv.rating}
                    </div>
                    <div style="font-size:0.7rem; color:var(--color-success); font-weight:600;">~3 min away</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Fare Breakdown Card (Step 8) -->
        <div class="card-3d" style="background:var(--bg-surface-elevated); padding:16px;">
          <div style="font-size:0.85rem; font-weight:700; margin-bottom:10px; color:var(--color-primary-light);">
            Fare Accounting Breakdown
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem; color:var(--text-secondary);">
            <div style="display:flex; justify-content:space-between;">
              <span>Base Fare (${s.fare.category})</span>
              <span style="color:var(--text-primary); font-weight:600;">₹${s.fare.baseFare}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Distance Charge (${distanceKm} km)</span>
              <span style="color:var(--text-primary); font-weight:600;">₹${s.fare.distanceCharge}</span>
            </div>
            ${s.fare.waitingCharge > 0 ? `
              <div style="display:flex; justify-content:space-between; color:var(--color-warning);">
                <span>Waiting Charges (${s.fare.waitingMinutes} mins)</span>
                <span>₹${s.fare.waitingCharge}</span>
              </div>
            ` : ''}
            ${s.fare.discount > 0 ? `
              <div style="display:flex; justify-content:space-between; color:var(--color-success);">
                <span>Coupon Applied (${s.couponCode})</span>
                <span>-₹${s.fare.discount}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); padding-top:4px; border-top:1px dashed var(--border-subtle);">
              <span>Platform Commission (Included in Driver Payout)</span>
              <span>₹${s.fare.platformCommission}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:800; color:#fff; padding-top:6px; border-top:1px solid var(--border-medium);">
              <span>Customer Amount</span>
              <span style="color:var(--color-primary-light);">₹${s.fare.finalAmount}</span>
            </div>
          </div>
        </div>

        <!-- Payment Method Selector (Step 9) -->
        <div style="display:flex; gap:8px;">
          ${['UPI', 'Card', 'QR Code', 'Cash'].map(pMethod => `
            <button class="btn btn-sm ${s.paymentMethod === pMethod ? 'btn-primary' : 'btn-secondary'} btn-pay-method" data-method="${pMethod}" style="flex:1; font-size:0.75rem;">
              ${pMethod}
            </button>
          `).join('')}
        </div>

        <!-- Confirm Booking Button (Step 10) -->
        <button id="btn-confirm-ride-booking" class="btn btn-primary btn-block btn-lg" style="box-shadow:var(--shadow-neon-hover);">
          ${renderIcon('check', 18)} Confirm & Request Ride (₹${s.fare.finalAmount})
        </button>
      `;
    }

    // Step 11: Live Ride Telemetry & Tracking
    else if (s.step === 11) {
      const activeRide = store.getActiveRide() || {
        id: 'TXS-DEMO',
        driverName: s.selectedDriver ? s.selectedDriver.name : 'Vikram Thakor',
        driverVehicle: s.selectedDriver ? s.selectedDriver.vehicle : { model: 'Bajaj Pulsar 150', regNo: 'GJ-18-AB-4021' },
        status: 'Accepted',
        rideOtp: '4021',
        fare: s.fare
      };

      return `
        <div class="card-3d card-neon" style="padding:20px; text-align:center;">
          <div class="empty-icon-wrap animate-float" style="width:64px; height:64px; margin:0 auto 12px; background:rgba(0,242,254,0.15); color:var(--color-accent);">
            ${renderIcon('bike', 32)}
          </div>
          
          <span class="badge badge-purple" style="margin-bottom:8px;">${activeRide.status}</span>
          <h3 style="font-size:1.3rem; font-weight:800; margin-bottom:4px;">Captain ${activeRide.driverName}</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
            ${activeRide.driverVehicle.model} • <b style="color:var(--text-primary);">${activeRide.driverVehicle.regNo}</b>
          </p>

          <!-- Ride Start Demo OTP Card (Section 13) -->
          <div style="background:var(--bg-surface-elevated); padding:16px; border-radius:var(--radius-md); border:1px dashed var(--color-primary); margin-bottom:20px;">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">
              ${i18n.t('rideOtpLabel')}
            </div>
            <div style="font-size:2rem; font-weight:900; letter-spacing:8px; color:var(--color-primary-light);">
              ${activeRide.rideOtp || '4021'}
            </div>
            <div style="font-size:0.7rem; color:var(--color-success); margin-top:4px;">
              ${renderIcon('shield', 12)} Captain verifies this OTP to begin trip
            </div>
          </div>

          <!-- Simulated Telemetry Actions -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button id="btn-sim-driver-arrived" class="btn btn-secondary btn-block">
              ${renderIcon('mapPin', 16)} Simulate: Captain Arrived
            </button>
            <button id="btn-sim-start-ride" class="btn btn-primary btn-block">
              ${renderIcon('zap', 16)} Simulate: Captain Enters OTP & Starts Ride
            </button>
            <button id="btn-sim-complete-ride" class="btn btn-success btn-block">
              ${renderIcon('checkCircle', 16)} Simulate: Complete Ride
            </button>
            <button id="btn-cancel-active-ride" class="btn btn-outline btn-block" style="color:var(--color-danger); border-color:rgba(255,23,68,0.4);">
              ${renderIcon('x', 14)} Cancel Ride
            </button>
          </div>
        </div>
      `;
    }

    // Step 12: Ride Completed, Receipt & Rating
    else if (s.step === 12) {
      return `
        <div class="card-3d card-neon" style="padding:24px; text-align:center;">
          <div class="empty-icon-wrap" style="width:72px; height:72px; margin:0 auto 14px; background:rgba(0,230,118,0.15); color:var(--color-success);">
            ${renderIcon('checkCircle', 36)}
          </div>

          <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">Ride Completed!</h2>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
            You have arrived safely at ${s.destination}.
          </p>

          <div class="badge badge-success" style="margin-bottom:20px; font-size:0.85rem; padding:6px 14px;">
            +25 Loyalty Points Earned!
          </div>

          <!-- Printable / Downloadable Receipt Summary (Section 15) -->
          <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:var(--radius-md); text-align:left; font-size:0.85rem; margin-bottom:20px; border:1px solid var(--border-subtle);">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
              <span style="font-weight:700;">Ride ID:</span>
              <span style="font-family:monospace;">TXS-1042</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span>Amount Paid:</span>
              <span style="font-weight:700; color:var(--color-success);">₹${s.fare.finalAmount} via ${s.paymentMethod}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span>Distance:</span>
              <span>${distanceKm} km</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Captain:</span>
              <span>${s.selectedDriver ? s.selectedDriver.name : 'Vikram Thakor'}</span>
            </div>
          </div>

          <!-- Rating & Written Review (Section 21) -->
          <div style="margin-bottom:24px;">
            <div style="font-size:0.9rem; font-weight:700; margin-bottom:8px;">Rate Your Experience</div>
            <div style="display:flex; justify-content:center; gap:8px; margin-bottom:12px; color:var(--color-warning);">
              ${[1, 2, 3, 4, 5].map(star => `
                <button class="star-rating-btn" data-star="${star}" style="font-size:1.5rem; cursor:pointer;">
                  ★
                </button>
              `).join('')}
            </div>
            <textarea id="ride-review-text" class="form-textarea" placeholder="Write feedback for your Captain (polite, timely, safe helmet)..." style="font-size:0.85rem;"></textarea>
          </div>

          <div style="display:flex; gap:10px;">
            <button id="btn-download-pdf-receipt" class="btn btn-secondary btn-block">
              ${renderIcon('download', 16)} Download PDF Receipt
            </button>
            <button id="btn-finish-booking-flow" class="btn btn-primary btn-block">
              Done & Return Home
            </button>
          </div>
        </div>
      `;
    }
  },

  attachBookingStepListeners(main, container) {
    const s = this.bookingState;

    // Back button
    const btnBack = main.querySelector('#btn-booking-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (s.step > 1 && s.step <= 10) {
          s.step--;
          this.renderBookingScreen(main, container);
        } else {
          this.switchTab('home', container);
        }
      });
    }

    // Booking Type switches (instant, scheduled, round_trip, recurring)
    main.querySelectorAll('.btn-booking-type').forEach(btn => {
      btn.addEventListener('click', () => {
        s.bookingType = btn.getAttribute('data-type');
        this.renderBookingScreen(main, container);
      });
    });

    // Round trip wait range
    const roundWait = main.querySelector('#booking-round-wait');
    if (roundWait) {
      roundWait.addEventListener('input', (e) => {
        s.roundTripWaitMins = parseInt(e.target.value);
        main.querySelector('#wait-val-badge').textContent = `${s.roundTripWaitMins} mins`;
      });
    }

    // Add Intermediate Stop (Up to 5)
    const btnAddStop = main.querySelector('#btn-add-intermediate-stop');
    if (btnAddStop) {
      btnAddStop.addEventListener('click', () => {
        if (!s.stops) s.stops = [];
        if (s.stops.length < 5) {
          s.stops.push(`Stop Point ${s.stops.length + 1}, Ahmedabad`);
          this.renderBookingScreen(main, container);
        }
      });
    }

    // Remove Stop
    main.querySelectorAll('.btn-remove-stop').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        s.stops.splice(idx, 1);
        this.renderBookingScreen(main, container);
      });
    });

    // Category selection
    main.querySelectorAll('.cat-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        s.selectedCategory = card.getAttribute('data-cat');
        // Clear selected driver so it updates to an online driver in this category
        s.selectedDriver = null;
        this.renderBookingScreen(main, container);
      });
    });

    // Driver manual selection
    main.querySelectorAll('.drv-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const drvId = card.getAttribute('data-drvid');
        s.selectedDriver = store.findById('drivers', drvId);
        this.renderBookingScreen(main, container);
      });
    });

    // Payment method selector
    main.querySelectorAll('.btn-pay-method').forEach(btn => {
      btn.addEventListener('click', () => {
        s.paymentMethod = btn.getAttribute('data-method');
        this.renderBookingScreen(main, container);
      });
    });

    // Confirm booking
    const btnConfirm = main.querySelector('#btn-confirm-ride-booking');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        if (!s.selectedDriver) {
          alert('Please select an available Captain from the list.');
          return;
        }

        const distanceKm = BookingService.calculateDistance(s.pickup, s.destination, s.stops);
        const bookingPayload = {
          pickup: s.pickup,
          destination: s.destination,
          stops: s.stops,
          category: s.selectedCategory,
          driver: s.selectedDriver,
          distanceKm: distanceKm,
          bookingType: s.bookingType,
          scheduleDate: s.scheduleDate,
          scheduleTime: s.scheduleTime,
          roundTripWaitMins: s.roundTripWaitMins,
          recurringPattern: s.recurringPattern,
          fare: s.fare,
          paymentMethod: s.paymentMethod
        };

        BookingService.createBooking(bookingPayload);
        audioService.playBookingChime();
        s.step = 11; // Move to live tracking
        this.renderBookingScreen(main, container);
      });
    }

    // Step 11 simulation triggers
    const btnArrived = main.querySelector('#btn-sim-driver-arrived');
    if (btnArrived) {
      btnArrived.addEventListener('click', () => {
        const ride = store.getActiveRide();
        if (ride) {
          ride.status = 'Driver Arrived';
          store.setActiveRide(ride);
          audioService.playNotification();
          alert('Captain has arrived at pickup location!');
          this.renderBookingScreen(main, container);
        }
      });
    }

    const btnStart = main.querySelector('#btn-sim-start-ride');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        const ride = store.getActiveRide();
        if (ride) {
          ride.status = 'Ride Started';
          store.setActiveRide(ride);
          audioService.playNotification();
          alert('Demo OTP verified! Ride is now in progress.');
          this.renderBookingScreen(main, container);
        }
      });
    }

    const btnComplete = main.querySelector('#btn-sim-complete-ride');
    if (btnComplete) {
      btnComplete.addEventListener('click', () => {
        const ride = store.getActiveRide();
        if (ride) {
          ride.status = 'Completed';
          ride.paymentStatus = 'Paid';
          store.upsert('rides', ride);
          store.clearActiveRide();
          
          // Award 25 loyalty points to customer
          const user = store.getCurrentUser();
          user.loyaltyPoints = (user.loyaltyPoints || 0) + 25;
          store.upsert('customers', user);
          store.setSession('customer', user);

          audioService.playPaymentSuccess();
          s.step = 12; // Move to receipt & rating
          this.renderBookingScreen(main, container);
        }
      });
    }

    const btnCancel = main.querySelector('#btn-cancel-active-ride');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        if (confirm('Cancel this active ride? First 3 mins are free, ₹30 cancellation fee applies thereafter.')) {
          const ride = store.getActiveRide();
          if (ride) BookingService.cancelBooking(ride.id);
          alert('Ride cancelled.');
          this.switchTab('home', container);
        }
      });
    }

    // Step 12 buttons
    const btnPdf = main.querySelector('#btn-download-pdf-receipt');
    if (btnPdf) {
      btnPdf.addEventListener('click', () => {
        window.print();
      });
    }

    const btnFinish = main.querySelector('#btn-finish-booking-flow');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        s.step = 1;
        this.switchTab('home', container);
      });
    }
  },

  // ================= 3. RIDE HISTORY SCREEN =================
  renderHistoryScreen(main, container) {
    const rides = store.get('rides', []).slice(0, 20);

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="page-title">${renderIcon('clock', 24)} Ride History</div>
        <p class="page-subtitle" style="margin-bottom:12px;">Past bookings, fare receipts, and trip status.</p>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${rides.map(ride => `
            <div class="card-3d" style="padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="badge ${ride.status === 'Completed' ? 'badge-success' : 'badge-danger'}">${ride.status}</span>
                <span style="font-size:0.8rem; color:var(--text-muted);">${new Date(ride.createdAt).toLocaleDateString()}</span>
              </div>
              <div style="font-weight:700; font-size:1.05rem; margin-bottom:4px; color:var(--text-primary);">${ride.destination}</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">From: ${ride.pickup}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px solid var(--border-subtle); font-size:0.85rem;">
                <span style="color:var(--color-primary-light); font-weight:700;">₹${ride.fare.finalAmount}</span>
                <span style="color:var(--text-muted);">${ride.distanceKm} km • ${ride.payment ? ride.payment.method : 'UPI'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ================= 4. SAFETY DASHBOARD (Section 18) =================
  renderSafetyScreen(main, container) {
    const contacts = store.get('emergencyContacts', [
      { name: 'Papa (Home)', phone: '+91 98250 99881' },
      { name: 'Sister Priya', phone: '+91 98250 99882' }
    ]);

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('shield', 24)} Safety Shield</div>
        <p class="page-subtitle" style="margin-bottom:10px;">24x7 Emergency assistance, trusted contacts, and live sharing.</p>

        <!-- SOS Big Button -->
        <div class="card-3d card-neon" style="padding:24px; text-align:center; border-color:var(--color-danger); box-shadow:0 0 25px rgba(255,23,68,0.25);">
          <div class="empty-icon-wrap radar-ping-danger" style="width:72px; height:72px; margin:0 auto 12px; background:rgba(255,23,68,0.2); color:var(--color-danger);">
            ${renderIcon('alertTriangle', 36)}
          </div>
          <h3 style="font-size:1.35rem; font-weight:900; color:var(--color-danger); margin-bottom:4px;">Emergency SOS</h3>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:16px;">
            Hold to trigger 3-second emergency countdown and alert National Emergency Service 112 & your trusted contacts.
          </p>
          <button id="btn-trigger-sos-panel" class="btn btn-danger btn-block btn-lg" style="font-weight:800; letter-spacing:1px;">
            ${renderIcon('alertTriangle', 18)} ACTIVATE SOS DEFENSE
          </button>
        </div>

        <!-- Trusted Contacts (Up to 5) -->
        <div class="card-3d" style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div style="font-weight:700; font-size:0.95rem;">Trusted Contacts (${contacts.length}/5)</div>
            <button id="btn-add-contact" class="btn btn-outline btn-sm">${renderIcon('plus', 14)} Add</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${contacts.map((c, i) => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
                <div>
                  <div style="font-weight:600; font-size:0.85rem;">${c.name}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${c.phone}</div>
                </div>
                <button class="btn btn-outline btn-icon-only btn-del-contact" data-idx="${i}" style="width:28px; height:28px; color:var(--color-danger); border:none;">
                  ${renderIcon('trash', 14)}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Trip Sharing Link Simulation -->
        <div class="card-3d" style="padding:16px;">
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:6px;">Share Live Ride Telemetry</div>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
            Share an encrypted live tracking link with family or colleagues for real-time peace of mind.
          </p>
          <button id="btn-share-ride-link" class="btn btn-secondary btn-block">
            ${renderIcon('share2', 16)} Copy Live Tracking Link
          </button>
        </div>
      </div>
    `;

    main.querySelector('#btn-trigger-sos-panel').addEventListener('click', () => this.openSOSModal());

    main.querySelector('#btn-add-contact').addEventListener('click', () => {
      const name = prompt('Enter contact name (e.g. Brother, Friend):');
      const phone = prompt('Enter phone number (+91):');
      if (name && phone) {
        contacts.push({ name, phone });
        store.set('emergencyContacts', contacts.slice(0, 5));
        this.renderSafetyScreen(main, container);
      }
    });

    main.querySelectorAll('.btn-del-contact').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        contacts.splice(idx, 1);
        store.set('emergencyContacts', contacts);
        this.renderSafetyScreen(main, container);
      });
    });

    main.querySelector('#btn-share-ride-link').addEventListener('click', () => {
      navigator.clipboard ? navigator.clipboard.writeText(window.location.href) : null;
      alert('Live telemetry tracking link copied to clipboard!');
    });
  },

  // ================= SOS MODAL (3-Second Countdown) =================
  openSOSModal() {
    const root = document.getElementById('customer-modal-root');
    if (!root) return;

    let countdown = 3;
    audioService.playSOSSiren();

    root.innerHTML = `
      <div class="modal-overlay active" id="sos-modal-overlay">
        <div class="modal-content" style="text-align:center; border:2px solid var(--color-danger); box-shadow:0 0 40px rgba(255,23,68,0.5);">
          <div class="empty-icon-wrap" style="width:72px; height:72px; margin:0 auto 16px; background:rgba(255,23,68,0.2); color:var(--color-danger);">
            ${renderIcon('alertTriangle', 36)}
          </div>
          <h2 style="font-size:1.6rem; font-weight:900; color:var(--color-danger); margin-bottom:8px;">EMERGENCY SOS TRIGGERED</h2>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px;">
            Simulating immediate alert dispatch to Police Control Room (112) and 5 trusted contacts with live GPS coordinates.
          </p>

          <div id="sos-counter-display" style="font-size:4rem; font-weight:900; color:var(--color-danger); margin-bottom:24px; text-shadow:0 0 20px rgba(255,23,68,0.6);">
            ${countdown}
          </div>

          <button id="btn-cancel-sos" class="btn btn-secondary btn-block btn-lg" style="background:#fff; color:#0a0910; font-weight:800;">
            Cancel False Alarm
          </button>
        </div>
      </div>
    `;

    const display = root.querySelector('#sos-counter-display');
    const timer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        if (display) display.textContent = countdown;
      } else {
        clearInterval(timer);
        if (display) display.innerHTML = `<span style="font-size:1.5rem; color:var(--color-success);">${renderIcon('checkCircle', 24)} 112 Notified (Simulated)</span>`;
      }
    }, 1000);

    root.querySelector('#btn-cancel-sos').addEventListener('click', () => {
      clearInterval(timer);
      root.innerHTML = '';
    });
  },

  // ================= 5. PROFILE SCREEN =================
  renderProfileScreen(main, container) {
    const user = store.getCurrentUser();
    const currentTheme = settings.getTheme();
    const currentLang = i18n.getLanguage();

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('user', 24)} My Profile</div>

        <div class="card-3d" style="padding:20px; display:flex; align-items:center; gap:16px;">
          <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,var(--color-primary),var(--color-accent)); display:flex; align-items:center; justify-content:center; font-size:2rem; color:#fff;">
            ${user.avatar || '👨🏽'}
          </div>
          <div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--text-primary);">${user.name}</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">${user.phone}</div>
            <div style="font-size:0.8rem; color:var(--color-primary-light); font-weight:600; margin-top:2px;">
              ${user.loyaltyPoints} Loyalty Points • Ref: <b>${user.referralCode}</b>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card-3d" style="padding:16px; display:flex; flex-direction:column; gap:14px;">
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px;">App Settings</div>
          
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Theme</span>
            <button id="btn-toggle-theme-prof" class="btn btn-secondary btn-sm">
              ${renderIcon(currentTheme === 'dark' ? 'moon' : 'sun', 14)} ${currentTheme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Language</span>
            <select id="select-lang-prof" class="form-select" style="width:auto; padding:6px 12px;">
              <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
              <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
              <option value="gu" ${currentLang === 'gu' ? 'selected' : ''}>ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Audio Sound Effects</span>
            <button id="btn-toggle-sound-prof" class="btn btn-secondary btn-sm">
              ${renderIcon(settings.isSoundEnabled() ? 'volume2' : 'volumeX', 14)} ${settings.isSoundEnabled() ? 'Unmuted' : 'Muted'}
            </button>
          </div>
        </div>

        <button id="btn-switch-role-prof" class="btn btn-outline btn-block">
          ${renderIcon('refreshCw', 16)} Switch User Role (Demo Selection)
        </button>

        <button id="btn-reset-demo-prof" class="btn btn-secondary btn-block" style="color:var(--color-warning);">
          ${renderIcon('trash', 14)} Reset All Demo Data
        </button>
      </div>
    `;

    main.querySelector('#btn-toggle-theme-prof').addEventListener('click', () => {
      settings.toggleTheme();
      this.renderProfileScreen(main, container);
    });

    main.querySelector('#select-lang-prof').addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
      this.renderProfileScreen(main, container);
    });

    main.querySelector('#btn-toggle-sound-prof').addEventListener('click', () => {
      settings.toggleSound();
      this.renderProfileScreen(main, container);
    });

    main.querySelector('#btn-switch-role-prof').addEventListener('click', () => {
      window.location.hash = '#role-select';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    main.querySelector('#btn-reset-demo-prof').addEventListener('click', () => {
      if (confirm('Reset all demo state to original seed?')) {
        store.reset();
        alert('All demo records reset successfully.');
        window.location.reload();
      }
    });
  },

  // ================= 6. OFFERS SCREEN =================
  renderOffersScreen(main, container) {
    const coupons = store.get('coupons', []);

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('tag', 24)} Offers & Coupons</div>
        <p class="page-subtitle" style="margin-bottom:12px;">Exclusive mobility vouchers & promo codes across Gujarat.</p>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${coupons.map(c => `
            <div class="card-3d card-neon" style="padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:800; font-size:1.15rem; color:var(--color-primary-light); letter-spacing:1px;">${c.code}</span>
                <span class="badge badge-purple">${c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT`}</span>
              </div>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">${c.desc}</p>
              <button class="btn btn-secondary btn-sm btn-copy-coupon" data-code="${c.code}">
                ${renderIcon('tag', 12)} Copy Code
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    main.querySelectorAll('.btn-copy-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        this.bookingState.couponCode = code;
        alert(`Coupon ${code} copied and applied to your next booking!`);
        this.switchTab('booking', container);
      });
    });
  },

  // ================= 7. NOTIFICATIONS SCREEN =================
  renderNotificationsScreen(main, container) {
    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="page-title">${renderIcon('bell', 24)} Notifications</div>
        <div class="card-3d" style="padding:16px;">
          <div style="font-weight:700; margin-bottom:4px;">Ride Booking Confirmed</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">Captain Vikram Thakor has accepted your ride request.</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">10 mins ago</div>
        </div>
        <div class="card-3d" style="padding:16px;">
          <div style="font-weight:700; margin-bottom:4px;">Festival Voucher Credited</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">Apply code FESTIVE25 for flat ₹25 discount on all rides!</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">2 hours ago</div>
        </div>
      </div>
    `;
  },

  // ================= 8. SUPPORT & FAQ SCREEN =================
  renderSupportScreen(main, container) {
    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('headphones', 24)} Support Center</div>
        <p class="page-subtitle" style="margin-bottom:12px;">Raise complaints, track ticket resolution, and read FAQs.</p>

        <div class="card-3d" style="padding:16px;">
          <h4 style="font-weight:700; margin-bottom:8px;">Raise a New Support Ticket</h4>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select id="ticket-category-input" class="form-select">
              <option value="Payment">Payment / Refund Issue</option>
              <option value="Driver">Captain Behaviour / Route</option>
              <option value="Ride">Ride Cancellation Charge</option>
              <option value="Safety">Safety & Vehicle Condition</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Issue Details</label>
            <textarea id="ticket-text-input" class="form-textarea" placeholder="Explain what happened..."></textarea>
          </div>
          <button id="btn-submit-support-ticket" class="btn btn-primary btn-block">
            Submit Support Request
          </button>
        </div>

        <div class="card-3d" style="padding:16px;">
          <h4 style="font-weight:700; margin-bottom:10px;">Frequently Asked Questions</h4>
          <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:8px;">
            <details style="padding:6px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
              <summary style="font-weight:600; cursor:pointer;">How do waiting charges work?</summary>
              <p style="margin-top:6px; color:var(--text-secondary);">First 3 minutes of waiting are completely free! Thereafter, ₹1 per minute is charged.</p>
            </details>
            <details style="padding:6px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
              <summary style="font-weight:600; cursor:pointer;">What is the cancellation policy?</summary>
              <p style="margin-top:6px; color:var(--text-secondary);">Free cancellation within the first 3 minutes of booking. After 3 minutes, ₹30 is applied. If a driver cancels, no charge is ever made.</p>
            </details>
          </div>
        </div>
      </div>
    `;

    main.querySelector('#btn-submit-support-ticket').addEventListener('click', () => {
      const cat = main.querySelector('#ticket-category-input').value;
      const text = main.querySelector('#ticket-text-input').value;
      if (!text) { alert('Please enter issue details.'); return; }

      const tickets = store.get('supportTickets', []);
      const newTicket = {
        id: `TCK-${Date.now().toString().slice(-4)}`,
        customerId: store.getCurrentUser().id,
        customerName: store.getCurrentUser().name,
        category: cat,
        subject: text.slice(0, 40) + '...',
        priority: 'Medium',
        status: 'Open',
        createdAt: new Date().toISOString(),
        messages: [{ sender: 'customer', text: text, time: 'Just now' }]
      };
      tickets.unshift(newTicket);
      store.set('supportTickets', tickets);
      store.logAudit(`Support ticket created: ${newTicket.id} (${cat})`);
      alert(`Ticket ${newTicket.id} submitted! Our support team will review it.`);
      main.querySelector('#ticket-text-input').value = '';
    });
  },

  // ================= 9. SCHEDULED RIDES SCREEN =================
  renderScheduledScreen(main, container) {
    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="page-title">${renderIcon('calendar', 24)} Scheduled Rides</div>
        <p class="page-subtitle" style="margin-bottom:12px;">Manage upcoming scheduled, round-trip and recurring commutes.</p>

        <div class="card-3d" style="padding:16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span class="badge badge-purple">DAILY COMMUTE</span>
            <span style="font-size:0.75rem; color:var(--color-success); font-weight:700;">Active</span>
          </div>
          <div style="font-weight:700; margin-bottom:4px;">Vastrapur Lake &rarr; Infocity Gandhinagar</div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">Every Mon-Sat at 09:30 AM</div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" style="flex:1;">Edit Schedule</button>
            <button class="btn btn-outline btn-sm" style="color:var(--color-danger); border-color:rgba(255,23,68,0.3);">Pause</button>
          </div>
        </div>
      </div>
    `;
  }
};
