// js/admin/admin-view.js - Complete 10-Screen Admin Management Console

import { store } from '../storage/store.js';
import { renderIcon } from '../utils/icons.js';
import { DEMO_CONFIG } from '../../data/demo-config.js';

export const AdminView = {
  currentTab: 'overview', // overview, customers, drivers, rides, pricing, payments, coupons, reports, support, settings

  render(container) {
    const admin = store.getCurrentUser() || { name: 'Kavita Iyer', email: 'admin@texsus.com', role: 'Super Admin' };

    container.innerHTML = `
      <div class="dashboard-layout">
        <!-- Fixed Desktop Sidebar (Section 22) -->
        <aside class="sidebar">
          <div style="display:flex; align-items:center; gap:10px; padding:0 8px 16px; border-bottom:1px solid var(--border-subtle);">
            <div class="brand-logo-badge" style="width:36px; height:36px; background:linear-gradient(135deg,#ff9100,#c66900);">
              ${renderIcon('sliders', 20)}
            </div>
            <div>
              <div style="font-size:1.05rem; font-weight:800; color:var(--text-primary); line-height:1;">TEXSUS ADMIN</div>
              <div style="font-size:0.65rem; color:var(--color-warning);">${admin.name}</div>
            </div>
          </div>

          <div class="sidebar-heading">OPERATIONS</div>
          <a class="sidebar-nav-item ${this.currentTab === 'overview' ? 'active' : ''}" data-atab="overview">
            ${renderIcon('activity', 18)} Overview
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'customers' ? 'active' : ''}" data-atab="customers">
            ${renderIcon('user', 18)} Customers
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'drivers' ? 'active' : ''}" data-atab="drivers">
            ${renderIcon('bike', 18)} Drivers & KYC
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'rides' ? 'active' : ''}" data-atab="rides">
            ${renderIcon('navigation', 18)} Rides Telemetry
          </a>

          <div class="sidebar-heading">COMMERCE & RULES</div>
          <a class="sidebar-nav-item ${this.currentTab === 'pricing' ? 'active' : ''}" data-atab="pricing">
            ${renderIcon('dollarSign', 18)} Pricing & Fares
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'payments' ? 'active' : ''}" data-atab="payments">
            ${renderIcon('creditCard', 18)} Payments & Refunds
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'coupons' ? 'active' : ''}" data-atab="coupons">
            ${renderIcon('tag', 18)} Coupons & Promo
          </a>

          <div class="sidebar-heading">SYSTEM & DESK</div>
          <a class="sidebar-nav-item ${this.currentTab === 'reports' ? 'active' : ''}" data-atab="reports">
            ${renderIcon('download', 18)} Export Reports
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'support' ? 'active' : ''}" data-atab="support">
            ${renderIcon('headphones', 18)} Support Tickets
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'settings' ? 'active' : ''}" data-atab="settings">
            ${renderIcon('fileText', 18)} Audit Logs & Conf
          </a>

          <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button id="btn-switch-role-admin" class="btn btn-outline btn-block btn-sm" style="font-size:0.75rem;">
              ${renderIcon('refreshCw', 14)} Switch Role
            </button>
          </div>
        </aside>

        <!-- Main Workspace Area -->
        <main class="dashboard-content" id="admin-main-pane">
          <!-- Loaded dynamically based on currentTab -->
        </main>
      </div>
    `;

    // Attach sidebar navigation
    container.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-atab');
        this.switchTab(tab, container);
      });
    });

    // Switch Role
    container.querySelector('#btn-switch-role-admin').addEventListener('click', () => {
      window.location.hash = '#role-select';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    this.renderActiveTab(container);
  },

  switchTab(tab, container) {
    this.currentTab = tab;
    container.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-atab') === tab);
    });
    this.renderActiveTab(container);
  },

  renderActiveTab(container) {
    const pane = container.querySelector('#admin-main-pane');
    if (!pane) return;

    if (this.currentTab === 'overview') this.renderOverview(pane);
    else if (this.currentTab === 'customers') this.renderCustomers(pane);
    else if (this.currentTab === 'drivers') this.renderDrivers(pane);
    else if (this.currentTab === 'rides') this.renderRides(pane);
    else if (this.currentTab === 'pricing') this.renderPricing(pane);
    else if (this.currentTab === 'payments') this.renderPayments(pane);
    else if (this.currentTab === 'coupons') this.renderCoupons(pane);
    else if (this.currentTab === 'reports') this.renderReports(pane);
    else if (this.currentTab === 'support') this.renderSupport(pane);
    else if (this.currentTab === 'settings') this.renderSettings(pane);
  },

  // ================= 1. OVERVIEW =================
  renderOverview(pane) {
    const rides = store.get('rides', []);
    const drivers = store.get('drivers', []);
    const customers = store.get('customers', []);
    const tickets = store.get('supportTickets', []);

    const totalGMV = rides.reduce((sum, r) => sum + (r.fare.finalAmount || 0), 0);
    const completedRides = rides.filter(r => r.status === 'Completed').length;
    const totalCommissions = completedRides * 20;

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 class="page-title">${renderIcon('activity', 26)} Operations Control Center</h2>
            <p class="page-subtitle" style="margin-bottom:0;">Live administrative monitoring across Kalol, Ahmedabad & Gandhinagar.</p>
          </div>
          <span class="badge badge-success" style="font-size:0.85rem; padding:8px 14px;">Operational • All Nodes Active</span>
        </div>

        <!-- 4 KPI Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
          <div class="card-3d card-neon" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Gross GMV</div>
            <div style="font-size:2rem; font-weight:900; color:var(--text-primary); margin:6px 0;">₹${totalGMV.toLocaleString()}</div>
            <div style="font-size:0.75rem; color:var(--color-success); font-weight:600;">↑ 18.4% this month</div>
          </div>
          <div class="card-3d" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Platform Fees (₹20/Ride)</div>
            <div style="font-size:2rem; font-weight:900; color:var(--color-primary-light); margin:6px 0;">₹${totalCommissions.toLocaleString()}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">From ${completedRides} completed rides</div>
          </div>
          <div class="card-3d" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Active Drivers</div>
            <div style="font-size:2rem; font-weight:900; color:var(--color-accent); margin:6px 0;">${drivers.filter(d => d.isOnline).length} / ${drivers.length}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">2 pending verification</div>
          </div>
          <div class="card-3d" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Registered Customers</div>
            <div style="font-size:2rem; font-weight:900; color:var(--color-warning); margin:6px 0;">${customers.length}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${tickets.filter(t => t.status === 'Open').length} open support tickets</div>
          </div>
        </div>

        <!-- Quick Action Shortcuts -->
        <div class="card-3d" style="padding:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:12px;">Immediate Administrative Actions</h3>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" id="btn-quick-pricing">Change Category Per-KM Rates</button>
            <button class="btn btn-secondary btn-sm" id="btn-quick-drivers">Review Pending Driver Documents</button>
            <button class="btn btn-secondary btn-sm" id="btn-quick-coupons">Create Festival Coupon</button>
          </div>
        </div>
      </div>
    `;

    pane.querySelector('#btn-quick-pricing').addEventListener('click', () => this.switchTab('pricing', pane.parentElement.parentElement));
    pane.querySelector('#btn-quick-drivers').addEventListener('click', () => this.switchTab('drivers', pane.parentElement.parentElement));
    pane.querySelector('#btn-quick-coupons').addEventListener('click', () => this.switchTab('coupons', pane.parentElement.parentElement));
  },

  // ================= 2. CUSTOMERS =================
  renderCustomers(pane) {
    const customers = store.get('customers', []);

    pane.innerHTML = `
      <div>
        <h2 class="page-title">${renderIcon('user', 24)} Customer Directory (${customers.length})</h2>
        <p class="page-subtitle">Passenger profiles, loyalty balances, and registered saved locations.</p>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Loyalty Points</th>
                <th>Referral Code</th>
                <th>Saved Hubs</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td style="font-family:monospace; font-weight:700; color:var(--color-primary-light);">${c.id}</td>
                  <td style="font-weight:600;">${c.name}</td>
                  <td>${c.phone}</td>
                  <td><span class="badge badge-purple">${c.loyaltyPoints} pts</span></td>
                  <td style="font-family:monospace;">${c.referralCode}</td>
                  <td style="font-size:0.8rem; color:var(--text-muted);">${(c.savedLocations || []).length} locations</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ================= 3. DRIVERS & KYC APPROVAL (Section 12 & 22) =================
  renderDrivers(pane) {
    const drivers = store.get('drivers', []);

    pane.innerHTML = `
      <div>
        <h2 class="page-title">${renderIcon('bike', 24)} Captain Fleet & Document Verification</h2>
        <p class="page-subtitle">Review driving licences, vehicle RC cards, and approve or reject applications.</p>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Captain</th>
                <th>Category</th>
                <th>Vehicle & Reg</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${drivers.map(drv => `
                <tr>
                  <td>
                    <div style="font-weight:700;">${drv.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${drv.phone}</div>
                  </td>
                  <td><span class="badge badge-purple">${drv.category}</span></td>
                  <td>
                    <div style="font-weight:600;">${drv.vehicle.model}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${drv.vehicle.regNo}</div>
                  </td>
                  <td><span style="color:var(--color-warning); font-weight:700;">★ ${drv.rating || 'New'}</span></td>
                  <td>
                    <span class="badge ${drv.approvalStatus === 'Approved' ? 'badge-success' : (drv.approvalStatus === 'Under Review' ? 'badge-warning' : 'badge-danger')}">
                      ${drv.approvalStatus}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn btn-success btn-sm btn-approve-drv" data-id="${drv.id}">Approve</button>
                      <button class="btn btn-outline btn-sm btn-reject-drv" data-id="${drv.id}" style="color:var(--color-danger); border-color:rgba(255,23,68,0.3);">Reject</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    pane.querySelectorAll('.btn-approve-drv').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const drv = store.findById('drivers', id);
        if (drv) {
          drv.approvalStatus = 'Approved';
          store.upsert('drivers', drv);
          store.logAudit(`Admin approved Driver ${drv.name} (${id})`);
          alert(`Driver ${drv.name} approved!`);
          this.renderDrivers(pane);
        }
      });
    });

    pane.querySelectorAll('.btn-reject-drv').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const drv = store.findById('drivers', id);
        const reason = prompt('Enter rejection reason for driver:', 'Blurred RC card document scan');
        if (drv && reason) {
          drv.approvalStatus = 'Resubmission Required';
          drv.rejectionReason = reason;
          store.upsert('drivers', drv);
          store.logAudit(`Admin rejected Driver ${drv.name} (${id}): ${reason}`);
          alert(`Driver ${drv.name} marked as Resubmission Required.`);
          this.renderDrivers(pane);
        }
      });
    });
  },

  // ================= 4. RIDES =================
  renderRides(pane) {
    const rides = store.get('rides', []).slice(0, 50);

    pane.innerHTML = `
      <div>
        <h2 class="page-title">${renderIcon('navigation', 24)} Ride Telemetry Logs (Showing 50 of 100)</h2>
        <p class="page-subtitle">Detailed records of journeys, distance, accounting, and completion statuses.</p>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ride ID</th>
                <th>Customer</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Distance</th>
                <th>Fare & Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rides.map(r => `
                <tr>
                  <td style="font-family:monospace; font-weight:700; color:var(--color-primary-light);">${r.id}</td>
                  <td>${r.customerName}</td>
                  <td>${r.driverName}</td>
                  <td style="font-size:0.8rem; max-width:220px;">
                    <div><b>From:</b> ${r.pickup}</div>
                    <div><b>To:</b> ${r.destination}</div>
                  </td>
                  <td>${r.distanceKm} km</td>
                  <td>
                    <div style="font-weight:700; color:var(--color-success);">₹${r.fare.finalAmount}</div>
                    <div style="font-size:0.7rem; color:var(--text-muted);">Fee: ₹${r.fare.platformCommission} • Payout: ₹${r.fare.driverEarnings}</div>
                  </td>
                  <td><span class="badge ${r.status === 'Completed' ? 'badge-success' : 'badge-danger'}">${r.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ================= 5. PRICING CONTROLS (Section 10 & 22) =================
  renderPricing(pane) {
    const config = store.get('config', DEMO_CONFIG);

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:800px;">
        <h2 class="page-title">${renderIcon('dollarSign', 24)} Dynamic Pricing & Commission Engine</h2>
        <p class="page-subtitle">Configure base fares, per-km rates, waiting fees, and platform deductions.</p>

        <!-- 5 Category Fares Table -->
        <div class="card-3d" style="padding:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:14px;">Bike Category Rates</h3>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${Object.keys(config.categories).map(k => {
              const cat = config.categories[k];
              return `
                <div style="display:grid; grid-template-columns:140px 1fr 1fr; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-subtle);">
                  <span style="font-weight:700; text-transform:capitalize;">${cat.name}</span>
                  <div>
                    <label style="font-size:0.7rem; color:var(--text-muted);">Base Fare (₹)</label>
                    <input type="number" class="form-input cat-base-val" data-cat="${k}" value="${cat.baseFare}">
                  </div>
                  <div>
                    <label style="font-size:0.7rem; color:var(--text-muted);">Per KM Rate (₹)</label>
                    <input type="number" class="form-input cat-perkm-val" data-cat="${k}" value="${cat.perKm}">
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Waiting & Commission Rules -->
        <div class="card-3d" style="padding:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:14px;">Waiting, Cancellation & Platform Fee</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Platform Commission (Fixed ₹)</label>
              <input type="number" id="input-commission" class="form-input" value="${config.commissionFixed || 20}">
            </div>
            <div class="form-group">
              <label class="form-label">Waiting Fee (₹/min after 3 mins)</label>
              <input type="number" id="input-wait-rate" class="form-input" value="${config.waitingRules.perMinuteRate}">
            </div>
            <div class="form-group">
              <label class="form-label">Customer Cancel Fee (₹ after 3m)</label>
              <input type="number" id="input-cancel-fee" class="form-input" value="${config.cancellationRules.customerCancelFee}">
            </div>
            <div class="form-group">
              <label class="form-label">No-Show Penalty Fee (₹)</label>
              <input type="number" id="input-noshow-fee" class="form-input" value="${config.cancellationRules.noShowFee}">
            </div>
          </div>

          <button id="btn-save-pricing" class="btn btn-primary btn-block btn-lg" style="margin-top:16px;">
            ${renderIcon('save', 16)} Update Pricing Engine Settings
          </button>
        </div>
      </div>
    `;

    pane.querySelector('#btn-save-pricing').addEventListener('click', () => {
      pane.querySelectorAll('.cat-base-val').forEach(inp => {
        const cat = inp.getAttribute('data-cat');
        config.categories[cat].baseFare = parseInt(inp.value) || 25;
      });
      pane.querySelectorAll('.cat-perkm-val').forEach(inp => {
        const cat = inp.getAttribute('data-cat');
        config.categories[cat].perKm = parseInt(inp.value) || 8;
      });
      config.commissionFixed = parseInt(pane.querySelector('#input-commission').value) || 20;
      config.waitingRules.perMinuteRate = parseInt(pane.querySelector('#input-wait-rate').value) || 1;
      config.cancellationRules.customerCancelFee = parseInt(pane.querySelector('#input-cancel-fee').value) || 30;
      config.cancellationRules.noShowFee = parseInt(pane.querySelector('#input-noshow-fee').value) || 50;

      store.set('config', config);
      store.logAudit('Admin updated category pricing, waiting charges and platform fees');
      alert('Pricing engine configurations saved successfully!');
    });
  },

  // ================= 6. PAYMENTS & REFUNDS (Section 15 & 16) =================
  renderPayments(pane) {
    const rides = store.get('rides', []).filter(r => r.payment && r.payment.status === 'Paid').slice(0, 20);

    pane.innerHTML = `
      <div>
        <h2 class="page-title">${renderIcon('creditCard', 24)} Transaction & Refund Processing</h2>
        <p class="page-subtitle">Verify payment reconciliations and trigger simulated customer refunds.</p>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Ride ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rides.map(r => `
                <tr>
                  <td style="font-family:monospace; font-weight:700;">${r.payment.transactionId}</td>
                  <td style="font-family:monospace;">${r.id}</td>
                  <td>${r.customerName}</td>
                  <td style="font-weight:700; color:var(--color-success);">₹${r.fare.finalAmount}</td>
                  <td><span class="badge badge-purple">${r.payment.method}</span></td>
                  <td><span class="badge badge-success">${r.payment.status}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm btn-issue-refund" data-rideid="${r.id}" style="color:var(--color-danger); border-color:rgba(255,23,68,0.3);">
                      Issue Refund
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    pane.querySelectorAll('.btn-issue-refund').forEach(btn => {
      btn.addEventListener('click', () => {
        const rideId = btn.getAttribute('data-rideid');
        const reason = prompt(`Enter reason for instant refund of ${rideId}:`, 'Customer requested dispute resolution');
        if (reason) {
          const allRides = store.get('rides', []);
          const ride = allRides.find(r => r.id === rideId);
          if (ride) {
            ride.payment.status = 'Refunded';
            ride.status = 'Cancelled';
            ride.cancelReason = reason;
            store.set('rides', allRides);
            store.logAudit(`Admin processed simulated refund for ${rideId}: ${reason}`);
            alert(`Instant refund of ₹${ride.fare.finalAmount} confirmed to original ${ride.payment.method} source!`);
            this.renderPayments(pane);
          }
        }
      });
    });
  },

  // ================= 7. COUPONS (Section 17) =================
  renderCoupons(pane) {
    const coupons = store.get('coupons', []);

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 class="page-title">${renderIcon('tag', 24)} Promo Coupons & Discount Rules</h2>
            <p class="page-subtitle" style="margin-bottom:0;">Create, edit, pause, and configure customer discounts.</p>
          </div>
          <button id="btn-show-add-coupon" class="btn btn-primary btn-sm">${renderIcon('plus', 14)} Create New Coupon</button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount Type</th>
                <th>Value</th>
                <th>Min Ride (₹)</th>
                <th>Redemptions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${coupons.map(c => `
                <tr>
                  <td style="font-weight:800; color:var(--color-primary-light); font-family:monospace;">${c.code}</td>
                  <td>${c.discountType}</td>
                  <td style="font-weight:700;">${c.discountType === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td>₹${c.minRideAmount}</td>
                  <td>${c.usedCount} / ${c.usageLimit}</td>
                  <td><span class="badge ${c.isActive ? 'badge-success' : 'badge-danger'}">${c.isActive ? 'ACTIVE' : 'PAUSED'}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm btn-toggle-coupon" data-code="${c.code}">
                      ${c.isActive ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    pane.querySelectorAll('.btn-toggle-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        const c = coupons.find(x => x.code === code);
        if (c) {
          c.isActive = !c.isActive;
          store.set('coupons', coupons);
          store.logAudit(`Admin toggled coupon ${code}: ${c.isActive ? 'Active' : 'Paused'}`);
          this.renderCoupons(pane);
        }
      });
    });

    pane.querySelector('#btn-show-add-coupon').addEventListener('click', () => {
      const code = prompt('Enter coupon code (e.g. FLASH30):');
      const val = parseInt(prompt('Enter discount percentage or flat amount:'));
      if (code && val) {
        coupons.push({
          code: code.toUpperCase(),
          discountType: 'percentage',
          value: val,
          maxDiscount: 50,
          minRideAmount: 40,
          usageLimit: 500,
          usedCount: 0,
          expiresAt: '2027-12-31',
          isActive: true,
          desc: `Special ${val}% discount for commuter rides`
        });
        store.set('coupons', coupons);
        store.logAudit(`Admin created new coupon ${code}`);
        this.renderCoupons(pane);
      }
    });
  },

  // ================= 8. REPORTS (Section 22) =================
  renderReports(pane) {
    pane.innerHTML = `
      <div style="max-width:700px; display:flex; flex-direction:column; gap:16px;">
        <h2 class="page-title">${renderIcon('download', 24)} Report Generator</h2>
        <p class="page-subtitle">Export telemetry, ride histories, driver payouts, and incident logs.</p>

        <div class="card-3d" style="padding:20px;">
          <h4 style="font-weight:700; margin-bottom:8px;">Download Full Rides Dataset (CSV)</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
            Generates a complete RFC-compliant CSV containing all 100 sample rides, financial splits, commissions, and customer details.
          </p>
          <button id="btn-export-csv" class="btn btn-primary btn-block">
            ${renderIcon('download', 16)} Export 100 Rides to CSV
          </button>
        </div>

        <div class="card-3d" style="padding:20px;">
          <h4 style="font-weight:700; margin-bottom:8px;">Print Operational Audit Sheet</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
            Format the current dashboard state into a clean print-ready report.
          </p>
          <button id="btn-print-admin-doc" class="btn btn-secondary btn-block">
            ${renderIcon('fileText', 16)} Print Operational Report
          </button>
        </div>
      </div>
    `;

    pane.querySelector('#btn-export-csv').addEventListener('click', () => {
      const rides = store.get('rides', []);
      let csv = 'RideID,Customer,Driver,Category,DistanceKM,GrossFare,PlatformCommission,DriverEarnings,Status\n';
      rides.forEach(r => {
        csv += `"${r.id}","${r.customerName}","${r.driverName}","${r.category}",${r.distanceKm},${r.fare.finalAmount},${r.fare.platformCommission},${r.fare.driverEarnings},"${r.status}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TEXSUS_Rides_Export_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });

    pane.querySelector('#btn-print-admin-doc').addEventListener('click', () => {
      window.print();
    });
  },

  // ================= 9. SUPPORT TICKETS (Section 20) =================
  renderSupport(pane) {
    const tickets = store.get('supportTickets', []);

    pane.innerHTML = `
      <div>
        <h2 class="page-title">${renderIcon('headphones', 24)} Customer Support Helpdesk</h2>
        <p class="page-subtitle">Manage incoming complaints, investigate route issues, and reply to passengers.</p>

        <div style="display:flex; flex-direction:column; gap:14px;">
          ${tickets.map(t => `
            <div class="card-3d" style="padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="badge ${t.priority === 'Critical' ? 'badge-danger' : (t.priority === 'High' ? 'badge-warning' : 'badge-purple')}">${t.priority}</span>
                  <span class="badge badge-purple">${t.category}</span>
                  <span style="font-family:monospace; font-weight:700;">${t.id}</span>
                </div>
                <span class="badge ${t.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${t.status}</span>
              </div>
              <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${t.subject}</h4>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Submitted by ${t.customerName}</div>
              
              <!-- Messages -->
              <div style="background:var(--bg-surface-elevated); padding:10px 14px; border-radius:var(--radius-sm); font-size:0.85rem; margin-bottom:12px;">
                ${t.messages.map(m => `
                  <div style="margin-bottom:6px;">
                    <b>${m.sender === 'customer' ? t.customerName : 'Admin'}:</b> ${m.text}
                  </div>
                `).join('')}
              </div>

              <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-sm btn-reply-ticket" data-tid="${t.id}">Reply to Ticket</button>
                <button class="btn btn-success btn-sm btn-resolve-ticket" data-tid="${t.id}">Mark Resolved</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    pane.querySelectorAll('.btn-reply-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        const tid = btn.getAttribute('data-tid');
        const reply = prompt(`Enter reply message for ticket ${tid}:`);
        if (reply) {
          const t = tickets.find(x => x.id === tid);
          if (t) {
            t.messages.push({ sender: 'admin', text: reply, time: 'Just now' });
            store.set('supportTickets', tickets);
            store.logAudit(`Admin replied to support ticket ${tid}`);
            this.renderSupport(pane);
          }
        }
      });
    });

    pane.querySelectorAll('.btn-resolve-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        const tid = btn.getAttribute('data-tid');
        const t = tickets.find(x => x.id === tid);
        if (t) {
          t.status = 'Resolved';
          store.set('supportTickets', tickets);
          store.logAudit(`Admin resolved support ticket ${tid}`);
          alert(`Ticket ${tid} marked as resolved!`);
          this.renderSupport(pane);
        }
      });
    });
  },

  // ================= 10. SETTINGS & AUDIT LOGS (Section 22 & 32) =================
  renderSettings(pane) {
    const logs = store.get('auditLogs', []);

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <h2 class="page-title">${renderIcon('fileText', 24)} System Audit Trail & Logs</h2>
        <p class="page-subtitle">Immutable chronological log of all administrative interventions with IP timestamps.</p>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>User</th>
                <th>Action Performed</th>
                <th>Timestamp</th>
                <th>Demo IP</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(l => `
                <tr>
                  <td style="font-family:monospace; font-weight:700;">${l.id}</td>
                  <td>${l.user}</td>
                  <td style="font-weight:600; color:var(--text-primary);">${l.action}</td>
                  <td style="font-size:0.8rem; color:var(--text-muted);">${new Date(l.timestamp).toLocaleString()}</td>
                  <td style="font-family:monospace; font-size:0.75rem;">${l.ip}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
