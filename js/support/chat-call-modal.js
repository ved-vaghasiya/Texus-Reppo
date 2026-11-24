// js/support/chat-call-modal.js - In-App Customer-Driver Chat & Simulated VoIP Call UI

import { renderIcon } from '../utils/icons.js';
import { audioService } from '../services/audio-service.js';

export const ChatCallModal = {
  // In-App Chat Modal
  openChat(driverName = 'Vikram Thakor', onSend) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'chat-modal-overlay';

    const quickMessages = [
      "I'm at the pickup point",
      "Please wait 2 minutes",
      "Near the main entrance gate",
      "Wearing a black jacket"
    ];

    modal.innerHTML = `
      <div class="modal-content card-neon" style="max-width:440px; padding:20px; display:flex; flex-direction:column; height:520px;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--color-primary); display:flex; align-items:center; justify-content:center; color:#fff;">
              👨🏽
            </div>
            <div>
              <div style="font-weight:700; font-size:0.95rem;">Captain ${driverName}</div>
              <div style="font-size:0.7rem; color:var(--color-success); font-weight:600;">● Online • Live Chat</div>
            </div>
          </div>
          <button class="modal-close" id="btn-close-chat">${renderIcon('x', 18)}</button>
        </div>

        <!-- Chat Messages Body -->
        <div id="chat-messages-container" style="flex:1; overflow-y:auto; padding:14px 4px; display:flex; flex-direction:column; gap:10px;">
          <div style="align-self:flex-start; max-width:80%; background:var(--bg-surface-elevated); padding:10px 14px; border-radius:var(--radius-md) var(--radius-md) var(--radius-md) 4px; font-size:0.85rem;">
            Namaste! I am on my way. Please wait at the pickup spot.
            <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">Captain • Just now</div>
          </div>
        </div>

        <!-- Predefined Quick Messages (Section 19) -->
        <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px;">
          ${quickMessages.map(qm => `
            <button class="btn btn-secondary btn-sm btn-quick-msg" style="white-space:nowrap; font-size:0.7rem; padding:6px 10px;">
              ${qm}
            </button>
          `).join('')}
        </div>

        <!-- Chat Input Bar -->
        <div style="display:flex; gap:8px; padding-top:8px; border-top:1px solid var(--border-subtle);">
          <input type="text" id="chat-text-input" class="form-input" placeholder="Type a message..." style="font-size:0.9rem;">
          <button id="btn-send-chat" class="btn btn-primary btn-icon-only">
            ${renderIcon('navigation', 16)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const msgContainer = modal.querySelector('#chat-messages-container');
    const input = modal.querySelector('#chat-text-input');

    function appendMessage(text, isCustomer = true) {
      const msg = document.createElement('div');
      msg.style.alignSelf = isCustomer ? 'flex-end' : 'flex-start';
      msg.style.maxWidth = '80%';
      msg.style.background = isCustomer ? 'var(--color-primary)' : 'var(--bg-surface-elevated)';
      msg.style.color = '#fff';
      msg.style.padding = '10px 14px';
      msg.style.borderRadius = isCustomer ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px';
      msg.style.fontSize = '0.85rem';
      msg.innerHTML = `${text}<div style="font-size:0.65rem; color:rgba(255,255,255,0.7); margin-top:2px; text-align:right;">${isCustomer ? 'You' : 'Captain'} • Just now</div>`;
      msgContainer.appendChild(msg);
      msgContainer.scrollTop = msgContainer.scrollHeight;
      audioService.playNotification();

      if (isCustomer) {
        // Simulated Captain reply after 1.5 seconds
        setTimeout(() => {
          appendMessage("Got it! Reaching your location shortly.", false);
        }, 1500);
      }
    }

    modal.querySelector('#btn-send-chat').addEventListener('click', () => {
      if (input.value.trim()) {
        appendMessage(input.value.trim(), true);
        input.value = '';
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        appendMessage(input.value.trim(), true);
        input.value = '';
      }
    });

    modal.querySelectorAll('.btn-quick-msg').forEach(btn => {
      btn.addEventListener('click', () => {
        appendMessage(btn.textContent.trim(), true);
      });
    });

    modal.querySelector('#btn-close-chat').addEventListener('click', () => modal.remove());
  },

  // Simulated VoIP Call Modal (Section 19)
  openCall(driverName = 'Vikram Thakor') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'call-modal-overlay';

    let duration = 0;
    let timer = null;

    modal.innerHTML = `
      <div class="modal-content card-neon" style="max-width:360px; padding:36px 20px; text-align:center;">
        <div class="empty-icon-wrap animate-float" style="width:80px; height:80px; margin:0 auto 16px; background:rgba(0,242,254,0.15); color:var(--color-accent); border:2px solid var(--color-accent);">
          ${renderIcon('phone', 36)}
        </div>

        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">Captain ${driverName}</h3>
        <div id="call-status-label" style="font-size:0.85rem; color:var(--color-accent); margin-bottom:28px;">
          Connecting encrypted in-app voice call...
        </div>

        <!-- Call Action Buttons -->
        <div style="display:flex; justify-content:center; gap:20px; margin-top:20px;">
          <button class="btn btn-secondary btn-icon-only" style="width:48px; height:48px; border-radius:50%;" id="btn-call-mute" title="Mute Microphone">
            ${renderIcon('volumeX', 20)}
          </button>
          <button class="btn btn-danger btn-icon-only" style="width:56px; height:56px; border-radius:50%; box-shadow:0 0 20px rgba(255,23,68,0.5);" id="btn-end-call" title="End Call">
            ${renderIcon('phone', 24)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const statusLabel = modal.querySelector('#call-status-label');

    // Simulate connection after 1.5 seconds
    setTimeout(() => {
      if (statusLabel) {
        statusLabel.textContent = 'Connected (00:01)';
        statusLabel.style.color = 'var(--color-success)';
        timer = setInterval(() => {
          duration++;
          const mins = String(Math.floor(duration / 60)).padStart(2, '0');
          const secs = String(duration % 60).padStart(2, '0');
          statusLabel.textContent = `Connected (${mins}:${secs})`;
        }, 1000);
      }
    }, 1500);

    modal.querySelector('#btn-end-call').addEventListener('click', () => {
      clearInterval(timer);
      modal.remove();
    });

    modal.querySelector('#btn-call-mute').addEventListener('click', (e) => {
      alert('Microphone toggled (Simulated).');
    });
  }
};
