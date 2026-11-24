// js/payments/payment-modal.js - Complete Multi-Payment Simulator (UPI, Card, Dynamic QR, Cash)

import { renderIcon } from '../utils/icons.js';
import { audioService } from '../services/audio-service.js';
import { store } from '../storage/store.js';

export const PaymentModal = {
  open(ride, onPaymentComplete) {
    let activeMethod = ride.paymentMethod || 'UPI';
    const amount = (ride.fare && ride.fare.finalAmount) || 75;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'payment-checkout-overlay';

    function renderModalContent() {
      modal.innerHTML = `
        <div class="modal-content card-neon" style="max-width:480px; padding:28px 22px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title" style="font-size:1.25rem;">Checkout & Payment</h3>
              <div style="font-size:0.75rem; color:var(--text-muted);">Ride ID: ${ride.id}</div>
            </div>
            <button class="modal-close" id="btn-close-pay">${renderIcon('x', 18)}</button>
          </div>

          <!-- Total Amount Box -->
          <div style="background:var(--bg-surface-elevated); padding:16px; border-radius:var(--radius-md); text-align:center; margin-bottom:18px; border:1px solid var(--border-glow);">
            <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">Total Payable</div>
            <div style="font-size:2.2rem; font-weight:900; color:var(--color-primary-light);">₹${amount}</div>
            <div style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Zero Surge Pricing Guarantee</div>
          </div>

          <!-- Method Selector Tabs -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:20px;">
            <button class="btn btn-sm ${activeMethod === 'UPI' ? 'btn-primary' : 'btn-secondary'} btn-tab-pay" data-m="UPI" style="font-size:0.75rem;">
              UPI
            </button>
            <button class="btn btn-sm ${activeMethod === 'QR Code' ? 'btn-primary' : 'btn-secondary'} btn-tab-pay" data-m="QR Code" style="font-size:0.75rem;">
              QR Code
            </button>
            <button class="btn btn-sm ${activeMethod === 'Card' ? 'btn-primary' : 'btn-secondary'} btn-tab-pay" data-m="Card" style="font-size:0.75rem;">
              Card
            </button>
            <button class="btn btn-sm ${activeMethod === 'Cash' ? 'btn-primary' : 'btn-secondary'} btn-tab-pay" data-m="Cash" style="font-size:0.75rem;">
              Cash
            </button>
          </div>

          <!-- Method Body -->
          <div id="payment-method-body" style="margin-bottom:20px;">
            ${getMethodHTML(activeMethod, amount, ride)}
          </div>

          <!-- Action Button -->
          <button id="btn-process-sim-payment" class="btn btn-success btn-block btn-lg" style="box-shadow:0 0 20px rgba(0,230,118,0.35);">
            ${renderIcon('checkCircle', 18)} Confirm Simulated Payment (₹${amount})
          </button>
        </div>
      `;

      // Attach tab events
      modal.querySelectorAll('.btn-tab-pay').forEach(btn => {
        btn.addEventListener('click', () => {
          activeMethod = btn.getAttribute('data-m');
          renderModalContent();
        });
      });

      // Close
      modal.querySelector('#btn-close-pay').addEventListener('click', () => {
        modal.remove();
      });

      // Confirm payment action
      modal.querySelector('#btn-process-sim-payment').addEventListener('click', () => {
        audioService.playPaymentSuccess();
        alert(`Payment of ₹${amount} simulated successfully via ${activeMethod}!`);
        store.logAudit(`Payment completed for ${ride.id}: ₹${amount} via ${activeMethod}`);
        modal.remove();
        if (onPaymentComplete) onPaymentComplete(activeMethod);
      });
    }

    function getMethodHTML(method, amount, ride) {
      if (method === 'UPI') {
        return `
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="font-size:0.8rem; color:var(--text-secondary);">Select preferred UPI application:</div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
              <button class="card-3d" style="padding:10px 4px; text-align:center; cursor:pointer; background:var(--bg-surface-elevated); font-size:0.75rem; font-weight:700;">GPay</button>
              <button class="card-3d" style="padding:10px 4px; text-align:center; cursor:pointer; background:var(--bg-surface-elevated); font-size:0.75rem; font-weight:700;">PhonePe</button>
              <button class="card-3d" style="padding:10px 4px; text-align:center; cursor:pointer; background:var(--bg-surface-elevated); font-size:0.75rem; font-weight:700;">Paytm</button>
              <button class="card-3d" style="padding:10px 4px; text-align:center; cursor:pointer; background:var(--bg-surface-elevated); font-size:0.75rem; font-weight:700;">BHIM</button>
            </div>
            <div class="form-group" style="margin-top:6px;">
              <label class="form-label">Or enter Virtual Payment Address (VPA)</label>
              <input type="text" class="form-input" value="aarav.patel@okhdfcbank" placeholder="name@upi">
            </div>
          </div>
        `;
      } else if (method === 'QR Code') {
        return `
          <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="padding:14px; background:#fff; border-radius:var(--radius-md); box-shadow:0 0 20px rgba(157,0,255,0.3); display:inline-block;">
              <!-- Dynamic SVG QR Code Simulation -->
              <svg viewBox="0 0 140 140" width="130" height="130">
                <rect width="140" height="140" fill="#fff"/>
                <!-- Top-Left Corner Box -->
                <rect x="10" y="10" width="36" height="36" fill="#000" rx="4"/>
                <rect x="18" y="18" width="20" height="20" fill="#fff"/>
                <rect x="23" y="23" width="10" height="10" fill="#000"/>
                <!-- Top-Right Corner Box -->
                <rect x="94" y="10" width="36" height="36" fill="#000" rx="4"/>
                <rect x="102" y="18" width="20" height="20" fill="#fff"/>
                <rect x="107" y="23" width="10" height="10" fill="#000"/>
                <!-- Bottom-Left Corner Box -->
                <rect x="10" y="94" width="36" height="36" fill="#000" rx="4"/>
                <rect x="18" y="102" width="20" height="20" fill="#fff"/>
                <rect x="23" y="107" width="10" height="10" fill="#000"/>
                <!-- QR Dots Matrix -->
                <rect x="55" y="20" width="10" height="10" fill="#9d00ff"/>
                <rect x="70" y="35" width="10" height="10" fill="#000"/>
                <rect x="55" y="55" width="30" height="30" fill="#000"/>
                <rect x="62" y="62" width="16" height="16" fill="#9d00ff"/>
                <rect x="95" y="60" width="10" height="10" fill="#000"/>
                <rect x="110" y="80" width="10" height="10" fill="#000"/>
                <rect x="55" y="95" width="10" height="20" fill="#000"/>
                <rect x="75" y="110" width="20" height="10" fill="#000"/>
                <rect x="105" y="105" width="15" height="15" fill="#9d00ff"/>
              </svg>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">
              Scan with any UPI application (GPay, PhonePe, Paytm)
            </div>
            <span class="badge badge-purple">Ride: ${ride.id} • Dynamic Token</span>
          </div>
        `;
      } else if (method === 'Card') {
        return `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label">Cardholder Name</label>
              <input type="text" class="form-input" value="Aarav Patel">
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label">Dummy Card Number</label>
              <input type="text" class="form-input" value="4532 •••• •••• 9182">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="form-group">
                <label class="form-label">Expiry</label>
                <input type="text" class="form-input" value="08/28">
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input type="password" class="form-input" value="452">
              </div>
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted);">
              Demo card only. No actual card details transmitted or saved.
            </div>
          </div>
        `;
      } else {
        return `
          <div style="text-align:center; padding:16px;">
            <div class="empty-icon-wrap" style="width:64px; height:64px; margin:0 auto 12px; background:rgba(0,230,118,0.15); color:var(--color-success);">
              ${renderIcon('dollarSign', 32)}
            </div>
            <h4 style="font-weight:700; margin-bottom:4px;">Cash on Ride Arrival</h4>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
              Hand over exact cash of ₹${amount} to Captain upon trip completion.
            </p>
            <span class="badge badge-success">Captain will confirm receipt in cockpit</span>
          </div>
        `;
      }
    }

    renderModalContent();
    document.body.appendChild(modal);
  }
};
