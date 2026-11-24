// js/maps/city-map.js - Futuristic 3D SVG City Map with Animated Telemetry & Simulated GPS

import { renderIcon } from '../utils/icons.js';
import { store } from '../storage/store.js';

export const CityMap = {
  render(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      showRoute = false,
      driverPosition = { x: 120, y: 160 },
      pickupPosition = { x: 80, y: 140 },
      destinationPosition = { x: 380, y: 220 },
      trafficLevel = 'Moderate',
      etaMins = 4,
      interactive = true
    } = options;

    const drivers = store.get('drivers', []).filter(d => d.isOnline);

    container.innerHTML = `
      <div class="map-viewport" style="position:relative; width:100%; height:100%; min-height:360px; overflow:hidden; background:var(--map-bg); border-radius:var(--radius-lg); border:1px solid var(--border-glow);">
        <!-- Map Overlay Badges -->
        <div style="position:absolute; top:12px; left:12px; z-index:20; display:flex; gap:8px; flex-wrap:wrap;">
          <span class="badge badge-purple" style="backdrop-filter:blur(10px); background:rgba(26,23,44,0.85); box-shadow:var(--shadow-sm);">
            ${renderIcon('mapPin', 14)} 3D GPS Simulation
          </span>
          <span class="badge badge-success" style="backdrop-filter:blur(10px); background:rgba(26,23,44,0.85);">
            Traffic: ${trafficLevel}
          </span>
          ${showRoute ? `
            <span class="badge badge-info" style="backdrop-filter:blur(10px); background:rgba(26,23,44,0.85);">
              ETA: ~${etaMins} mins
            </span>
          ` : ''}
        </div>

        <div style="position:absolute; top:12px; right:12px; z-index:20;">
          <button id="btn-gps-recenter" class="btn btn-secondary btn-sm" title="Simulate GPS Reconnect" style="backdrop-filter:blur(10px); padding:6px 10px;">
            ${renderIcon('navigation', 14)} Recenter
          </button>
        </div>

        <!-- 3D Perspective Map Canvas -->
        <div class="map-3d-plane" style="width:100%; height:100%; transform-style:preserve-3d; transition:transform 0.5s ease;">
          <svg viewBox="0 0 600 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block;">
            <defs>
              <!-- Grid Pattern -->
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--map-grid)" stroke-width="1"/>
              </pattern>
              
              <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9d00ff" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.8"/>
              </linearGradient>

              <filter id="neonFilter">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Ground Base -->
            <rect width="600" height="400" fill="var(--map-bg)"/>
            <rect width="600" height="400" fill="url(#grid)"/>

            <!-- Futuristic City Blocks / Buildings -->
            <g class="map-buildings" opacity="0.85">
              <!-- Block 1 -->
              <polygon points="40,30 110,30 120,60 50,60" fill="var(--map-building)" stroke="var(--border-subtle)"/>
              <polygon points="50,60 120,60 120,95 50,95" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)"/>
              <!-- Block 2 (Infocity Tower) -->
              <polygon points="170,25 240,25 250,55 180,55" fill="var(--map-building)" stroke="var(--border-subtle)"/>
              <polygon points="180,55 250,55 250,110 180,110" fill="var(--bg-surface-elevated)" stroke="var(--color-primary-light)" stroke-width="0.8"/>
              <line x1="215" y1="25" x2="215" y2="10" stroke="var(--color-accent)" stroke-width="2"/>
              <circle cx="215" cy="10" r="3" fill="var(--color-accent)"/>
              <!-- Block 3 -->
              <polygon points="310,40 390,40 400,75 320,75" fill="var(--map-building)" stroke="var(--border-subtle)"/>
              <polygon points="320,75 400,75 400,120 320,120" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)"/>
              <!-- Block 4 (South Hub) -->
              <polygon points="80,260 160,260 170,300 90,300" fill="var(--map-building)" stroke="var(--border-subtle)"/>
              <polygon points="90,300 170,300 170,355 90,355" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)"/>
              <!-- Block 5 -->
              <polygon points="230,270 320,270 330,310 240,310" fill="var(--map-building)" stroke="var(--border-subtle)"/>
              <polygon points="240,310 330,310 330,360 240,360" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)"/>
              <!-- Block 6 (East Tech Park) -->
              <polygon points="450,160 540,160 550,200 460,200" fill="var(--map-building)" stroke="var(--border-subtle)"/>
              <polygon points="460,200 550,200 550,270 460,270" fill="var(--bg-surface-elevated)" stroke="var(--color-primary)" stroke-width="0.8"/>
            </g>

            <!-- Major City Roads & Avenues -->
            <g class="map-roads">
              <!-- Grand Trunk Highway (Horizontal) -->
              <line x1="0" y1="180" x2="600" y2="180" stroke="var(--map-road-border)" stroke-width="28"/>
              <line x1="0" y1="180" x2="600" y2="180" stroke="var(--map-road)" stroke-width="24"/>
              <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="14 10"/>

              <!-- SG Ring Road (Diagonal) -->
              <line x1="60" y1="0" x2="480" y2="400" stroke="var(--map-road-border)" stroke-width="24"/>
              <line x1="60" y1="0" x2="480" y2="400" stroke="var(--map-road)" stroke-width="20"/>
              <line x1="60" y1="0" x2="480" y2="400" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-dasharray="12 8"/>

              <!-- Central Cross Avenue -->
              <line x1="300" y1="0" x2="300" y2="400" stroke="var(--map-road-border)" stroke-width="20"/>
              <line x1="300" y1="0" x2="300" y2="400" stroke="var(--map-road)" stroke-width="16"/>

              <!-- South Connector -->
              <line x1="0" y1="320" x2="600" y2="320" stroke="var(--map-road)" stroke-width="14"/>
            </g>

            <!-- Geofence 5KM Coverage Boundary -->
            <circle cx="280" cy="200" r="180" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="6 4" fill="rgba(157,0,255,0.03)"/>

            <!-- Active Booking Route (If applicable) -->
            ${showRoute ? `
              <!-- Route Outline -->
              <path id="route-path" d="M ${pickupPosition.x} ${pickupPosition.y} L 180 180 L 300 180 L ${destinationPosition.x} ${destinationPosition.y}" 
                fill="none" stroke="url(#roadGlow)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#neonFilter)"/>
              
              <!-- Pickup Pin -->
              <g transform="translate(${pickupPosition.x}, ${pickupPosition.y})">
                <circle cx="0" cy="0" r="12" fill="var(--color-success)" opacity="0.3"/>
                <circle cx="0" cy="0" r="6" fill="var(--color-success)"/>
                <text x="10" y="-8" fill="#fff" font-size="10" font-weight="700">Pickup</text>
              </g>

              <!-- Destination Pin -->
              <g transform="translate(${destinationPosition.x}, ${destinationPosition.y})">
                <circle cx="0" cy="0" r="14" fill="var(--color-primary)" opacity="0.4"/>
                <circle cx="0" cy="0" r="7" fill="var(--color-primary-light)"/>
                <text x="12" y="-8" fill="#fff" font-size="10" font-weight="700">Drop</text>
              </g>

              <!-- Animated Moving Bike Marker -->
              <g id="animated-bike-marker" transform="translate(${driverPosition.x}, ${driverPosition.y})">
                <circle cx="0" cy="0" r="18" fill="var(--color-accent)" opacity="0.3" class="radar-ping"/>
                <circle cx="0" cy="0" r="9" fill="var(--color-accent)"/>
                <circle cx="0" cy="0" r="4" fill="#fff"/>
              </g>
            ` : `
              <!-- Nearby Available Driver Markers -->
              ${drivers.slice(0, 6).map((d, idx) => {
                const px = 100 + (idx * 75) % 400;
                const py = 120 + ((idx * 55) % 180);
                return `
                  <g class="driver-pin" transform="translate(${px}, ${py})" style="cursor:pointer;">
                    <circle cx="0" cy="0" r="12" fill="rgba(157,0,255,0.2)"/>
                    <circle cx="0" cy="0" r="6" fill="var(--color-primary)"/>
                    <title>${d.name} (${d.vehicle.model}) - ★${d.rating}</title>
                  </g>
                `;
              }).join('')}
            `}
          </svg>
        </div>

        <!-- Simulated Compass / Location Hub indicator -->
        <div style="position:absolute; bottom:12px; left:12px; z-index:20; background:rgba(18,16,30,0.85); backdrop-filter:blur(8px); padding:6px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.75rem; color:var(--text-secondary); display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--color-success); box-shadow:0 0 6px var(--color-success);"></span>
          Kalol • Ahmedabad • Gandhinagar Hub
        </div>
      </div>
    `;

    // Recenter listener
    const btnRecenter = container.querySelector('#btn-gps-recenter');
    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        const plane = container.querySelector('.map-3d-plane');
        if (plane) {
          plane.style.transform = 'scale(1.08)';
          setTimeout(() => { plane.style.transform = 'scale(1)'; }, 300);
        }
      });
    }
  }
};
