// js/owner/owner-view.js - Complete Executive Owner Suite & Fiscal Analytics

import { store } from '../storage/store.js';
import { SVGCharts } from '../charts/svg-charts.js';
import { renderIcon } from '../utils/icons.js';

export const OwnerView = {
  currentTab: 'overview', // overview, admins, revenue, analytics, settings, logs

  render(container) {
    const owner = store.get('owner', { name: 'Vikramaditya Singhania', email: 'owner@texsus.com', role: 'Founder & CEO' });

    container.innerHTML = `
      <div class="dashboard-layout">
        <!-- Fixed Desktop Sidebar (Section 23) -->
        <aside class="sidebar">
          <div style="display:flex; align-items:center; gap:10px; padding:0 8px 16px; border-bottom:1px solid var(--border-subtle);">
            <div class="brand-logo-badge" style="width:36px; height:36px; background:linear-gradient(135deg,#00e676,#00a152);">
              ${renderIcon('award', 20)}
            </div>
            <div>
              <div style="font-size:1.05rem; font-weight:800; color:var(--text-primary); line-height:1;">TEXSUS OWNER</div>
              <div style="font-size:0.65rem; color:var(--color-success); font-weight:700;">Executive Suite</div>
            </div>
          </div>

          <div class="sidebar-heading">EXECUTIVE</div>
          <a class="sidebar-nav-item ${this.currentTab === 'overview' ? 'active' : ''}" data-otab="overview">
            ${renderIcon('activity', 18)} Executive Overview
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'admins' ? 'active' : ''}" data-otab="admins">
            ${renderIcon('user', 18)} Admin Accounts
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'revenue' ? 'active' : ''}" data-otab="revenue">
            ${renderIcon('dollarSign', 18)} Revenue & Payouts
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'analytics' ? 'active' : ''}" data-otab="analytics">
            ${renderIcon('pieChart', 18)} Deep Analytics
          </a>

          <div class="sidebar-heading">GOVERNANCE</div>
          <a class="sidebar-nav-item ${this.currentTab === 'settings' ? 'active' : ''}" data-otab="settings">
            ${renderIcon('sliders', 18)} Platform Settings
          </a>
          <a class="sidebar-nav-item ${this.currentTab === 'logs' ? 'active' : ''}" data-otab="logs">
            ${renderIcon('fileText', 18)} Audit Logs
          </a>

          <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button id="btn-switch-role-owner" class="btn btn-outline btn-block btn-sm" style="font-size:0.75rem;">
              ${renderIcon('refreshCw', 14)} Switch Role
            </button>
          </div>
        </aside>

        <!-- Main Workspace Area -->
        <main class="dashboard-content" id="owner-main-pane">
          <!-- Loaded dynamically based on currentTab -->
        </main>
      </div>
    `;

    // Attach navigation
    container.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-otab');
        this.switchTab(tab, container);
      });
    });

    // Switch role
    container.querySelector('#btn-switch-role-owner').addEventListener('click', () => {
      window.location.hash = '#role-select';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    this.renderActiveTab(container);
  },

  switchTab(tab, container) {
    this.currentTab = tab;
    container.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-otab') === tab);
    });
    this.renderActiveTab(container);
  },

  renderActiveTab(container) {
    const pane = container.querySelector('#owner-main-pane');
    if (!pane) return;

    if (this.currentTab === 'overview') this.renderOverview(pane);
    else if (this.currentTab === 'admins') this.renderAdmins(pane);
    else if (this.currentTab === 'revenue') this.renderRevenue(pane);
    else if (this.currentTab === 'analytics') this.renderAnalytics(pane);
    else if (this.currentTab === 'settings') this.renderSettings(pane);
    else if (this.currentTab === 'logs') this.renderLogs(pane);
  },

  // ================= 1. OVERVIEW =================
  renderOverview(pane) {
    const rides = store.get('rides', []);
    const completedRides = rides.filter(r => r.status === 'Completed');
    const cancelledRides = rides.filter(r => r.status === 'Cancelled');

    const totalGMV = rides.reduce((sum, r) => sum + (r.fare.finalAmount || 0), 0);
    const platformCommission = completedRides.length * 20;
    const driverNetEarnings = totalGMV - platformCommission;

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 class="page-title">${renderIcon('award', 26)} Executive Owner Dashboard</h2>
            <p class="page-subtitle" style="margin-bottom:0;">TEXSUS Mobility Pvt. Ltd. — Consolidated Fiscal Telemetry.</p>
          </div>
          <button id="btn-export-exec-report" class="btn btn-secondary btn-sm">
            ${renderIcon('download', 14)} Export Executive Summary
          </button>
        </div>

        <!-- Fiscal Top Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
          <div class="card-3d card-neon" style="padding:22px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Gross Booking Volume</div>
            <div style="font-size:2.2rem; font-weight:900; color:var(--text-primary); margin:6px 0;">₹${totalGMV.toLocaleString()}</div>
            <div style="font-size:0.75rem; color:var(--color-success); font-weight:700;">↑ 22.8% MoM Growth</div>
          </div>
          <div class="card-3d card-neon" style="padding:22px; border-color:var(--color-primary);">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Platform Net Commissions</div>
            <div style="font-size:2.2rem; font-weight:900; color:var(--color-primary-light); margin:6px 0;">₹${platformCommission.toLocaleString()}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">₹20 fixed per completed ride</div>
          </div>
          <div class="card-3d" style="padding:22px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Driver Fleet Net Payouts</div>
            <div style="font-size:2.2rem; font-weight:900; color:var(--color-accent); margin:6px 0;">₹${driverNetEarnings.toLocaleString()}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${completedRides.length} rides disbursed</div>
          </div>
          <div class="card-3d" style="padding:22px;">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Trips Completed vs Cancelled</div>
            <div style="font-size:2.2rem; font-weight:900; color:var(--color-success); margin:6px 0;">${completedRides.length} <span style="font-size:1.1rem; color:var(--color-danger); font-weight:700;">/ ${cancelledRides.length}</span></div>
            <div style="font-size:0.75rem; color:var(--text-muted);">94.2% completion rate</div>
          </div>
        </div>

        <!-- Custom SVG Chart: Monthly Growth -->
        <div class="card-3d" style="padding:20px;">
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
            <span>6-Month Platform Gross Volume Trend (SVG Chart)</span>
            <span class="badge badge-purple">Monthly GMV</span>
          </h3>
          <div id="owner-bar-chart-container"></div>
        </div>
      </div>
    `;

    // Render monthly SVG bar chart
    const monthlyData = [
      { label: 'Jun', value: 34200 },
      { label: 'Jul', value: 48900 },
      { label: 'Aug', value: 62400 },
      { label: 'Sep', value: 78100 },
      { label: 'Oct', value: 94500 },
      { label: 'Nov', value: totalGMV }
    ];
    SVGCharts.renderBarChart(monthlyData, 'owner-bar-chart-container', 200);

    pane.querySelector('#btn-export-exec-report').addEventListener('click', () => {
      alert('Executive financial summary exported to PDF/Print preview!');
      window.print();
    });
  },

  // ================= 2. ADMIN MANAGEMENT (Section 23) =================
  renderAdmins(pane) {
    const admins = store.get('admins', []);

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 class="page-title">${renderIcon('user', 24)} System Administrator Accounts</h2>
            <p class="page-subtitle" style="margin-bottom:0;">Assign administrative privileges, audit staff logins, and invite managers.</p>
          </div>
          <button id="btn-add-admin-user" class="btn btn-primary btn-sm">
            ${renderIcon('plus', 14)} Add Administrator
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role & Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${admins.map(a => `
                <tr>
                  <td style="font-family:monospace; font-weight:700; color:var(--color-primary-light);">${a.id}</td>
                  <td style="font-weight:700;">${a.name}</td>
                  <td>${a.email}</td>
                  <td><span class="badge badge-purple">${a.role} • ${a.department}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm btn-del-admin" data-id="${a.id}" style="color:var(--color-danger); border-color:rgba(255,23,68,0.3);">
                      Deactivate
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    pane.querySelector('#btn-add-admin-user').addEventListener('click', () => {
      const name = prompt('Enter Administrator Name:');
      const email = prompt('Enter Work Email:');
      const dept = prompt('Enter Department (Operations, Finance, Support):', 'Operations');
      if (name && email) {
        admins.push({
          id: `ADM-00${admins.length + 1}`,
          name,
          email,
          role: 'Operations Admin',
          department: dept || 'Operations'
        });
        store.set('admins', admins);
        store.logAudit(`Owner added new administrator: ${name} (${email})`);
        this.renderAdmins(pane);
      }
    });

    pane.querySelectorAll('.btn-del-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Deactivate administrator account ${id}?`)) {
          const updated = admins.filter(a => a.id !== id);
          store.set('admins', updated);
          store.logAudit(`Owner deactivated administrator: ${id}`);
          this.renderAdmins(pane);
        }
      });
    });
  },

  // ================= 3. REVENUE BREAKDOWN =================
  renderRevenue(pane) {
    const rides = store.get('rides', []);
    const completed = rides.filter(r => r.status === 'Completed');
    const totalGMV = rides.reduce((s, r) => s + (r.fare.finalAmount || 0), 0);
    const comm = completed.length * 20;

    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <h2 class="page-title">${renderIcon('dollarSign', 24)} Revenue Streams & Payout Audits</h2>
        <p class="page-subtitle">Dissecting daily, weekly and monthly gross booking splits.</p>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
          <div class="card-3d" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">Today's Revenue</div>
            <div style="font-size:1.8rem; font-weight:800; color:var(--color-primary-light); margin:4px 0;">₹4,820</div>
            <div style="font-size:0.75rem; color:var(--color-success);">From 48 booked rides</div>
          </div>
          <div class="card-3d" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">This Week's Revenue</div>
            <div style="font-size:1.8rem; font-weight:800; color:var(--color-primary-light); margin:4px 0;">₹28,640</div>
            <div style="font-size:0.75rem; color:var(--color-success);">Platform commission: ₹5,800</div>
          </div>
          <div class="card-3d" style="padding:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">This Month's Revenue</div>
            <div style="font-size:1.8rem; font-weight:800; color:var(--color-primary-light); margin:4px 0;">₹${totalGMV.toLocaleString()}</div>
            <div style="font-size:0.75rem; color:var(--color-success);">Platform commission: ₹${comm.toLocaleString()}</div>
          </div>
        </div>
      </div>
    `;
  },

  // ================= 4. ANALYTICS (Custom SVG Charts) =================
  renderAnalytics(pane) {
    pane.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <h2 class="page-title">${renderIcon('pieChart', 24)} Deep Category & Hub Analytics</h2>
        <p class="page-subtitle">Visualizing ride distributions by vehicle class and city clusters.</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <!-- Category Share Donut -->
          <div class="card-3d" style="padding:20px;">
            <h4 style="font-weight:700; margin-bottom:16px;">Category Ride Distribution</h4>
            <div id="category-donut-container"></div>
          </div>

          <!-- Regional Hub Breakdown -->
          <div class="card-3d" style="padding:20px;">
            <h4 style="font-weight:700; margin-bottom:16px;">Operational Hub Performance</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                  <b>Ahmedabad Central</b>
                  <span style="color:var(--color-primary-light); font-weight:700;">52% Volume</span>
                </div>
                <div style="height:8px; border-radius:4px; background:var(--bg-surface-elevated); overflow:hidden;">
                  <div style="width:52%; height:100%; background:var(--color-primary);"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                  <b>Gandhinagar Infocity</b>
                  <span style="color:var(--color-accent); font-weight:700;">32% Volume</span>
                </div>
                <div style="height:8px; border-radius:4px; background:var(--bg-surface-elevated); overflow:hidden;">
                  <div style="width:32%; height:100%; background:var(--color-accent);"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                  <b>Kalol Hub</b>
                  <span style="color:var(--color-success); font-weight:700;">16% Volume</span>
                </div>
                <div style="height:8px; border-radius:4px; background:var(--bg-surface-elevated); overflow:hidden;">
                  <div style="width:16%; height:100%; background:var(--color-success);"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const catData = [
      { label: 'Standard', value: 38 },
      { label: 'Premium', value: 22 },
      { label: 'Electric', value: 20 },
      { label: 'Scooter', value: 12 },
      { label: 'Heavy', value: 8 }
    ];
    SVGCharts.renderDonutChart(catData, 'category-donut-container', 180);
  },

  // ================= 5. SETTINGS =================
  renderSettings(pane) {
    pane.innerHTML = `
      <div style="max-width:700px;">
        <h2 class="page-title">${renderIcon('sliders', 24)} Executive Master Configurations</h2>
        <p class="page-subtitle">Enterprise rules, fiscal reserve policies, and data management.</p>

        <div class="card-3d" style="padding:20px;">
          <h4 style="font-weight:700; margin-bottom:12px;">Data Management & Seeding</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
            Reset all 20 customers, 10 drivers, 100 sample rides, and coupons to default factory seed state.
          </p>
          <button id="btn-owner-reset-store" class="btn btn-secondary btn-block" style="color:var(--color-warning);">
            ${renderIcon('refreshCw', 16)} Reset & Reseed Demo Database
          </button>
        </div>
      </div>
    `;

    pane.querySelector('#btn-owner-reset-store').addEventListener('click', () => {
      if (confirm('Are you sure you want to reseed all 100 rides, drivers, and customers?')) {
        store.reset();
        alert('All records reseeded to original factory state!');
        window.location.reload();
      }
    });
  },

  // ================= 6. AUDIT LOGS =================
  renderLogs(pane) {
    const logs = store.get('auditLogs', []);
    pane.innerHTML = `
      <div>
        <h2 class="page-title">${renderIcon('fileText', 24)} Master Audit Trail</h2>
        <p class="page-subtitle">Executive oversight of all actions across Customer, Captain, Admin and Owner.</p>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Actor</th>
                <th>Activity Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(l => `
                <tr>
                  <td style="font-family:monospace; font-weight:700;">${l.id}</td>
                  <td>${l.user}</td>
                  <td style="color:var(--text-primary); font-weight:600;">${l.action}</td>
                  <td style="font-size:0.8rem; color:var(--text-muted);">${new Date(l.timestamp).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
