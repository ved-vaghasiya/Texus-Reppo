// js/charts/svg-charts.js - Zero-Dependency Animated SVG Charts (Bar, Donut, Line)

export const SVGCharts = {
  // 1. Revenue Growth Bar Chart
  renderBarChart(data, containerId, height = 200) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const barWidth = 32;
    const gap = 16;
    const svgWidth = data.length * (barWidth + gap) + 40;

    container.innerHTML = `
      <div style="overflow-x:auto; width:100%;">
        <svg viewBox="0 0 ${svgWidth} ${height}" width="100%" height="${height}" style="display:block;">
          <defs>
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="100%" stop-color="#9d00ff"/>
            </linearGradient>
          </defs>
          <!-- Grid Lines -->
          <line x1="30" y1="20" x2="${svgWidth}" y2="20" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <line x1="30" y1="${height / 2}" x2="${svgWidth}" y2="${height / 2}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <line x1="30" y1="${height - 30}" x2="${svgWidth}" y2="${height - 30}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

          ${data.map((d, i) => {
            const x = 40 + i * (barWidth + gap);
            const barH = Math.round((d.value / maxVal) * (height - 60));
            const y = height - 30 - barH;
            return `
              <g class="chart-bar-group">
                <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="url(#barGrad)">
                  <title>${d.label}: ₹${d.value.toLocaleString()}</title>
                </rect>
                <text x="${x + barWidth / 2}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${d.label}</text>
                <text x="${x + barWidth / 2}" y="${y - 6}" fill="#fff" font-size="10" font-weight="700" text-anchor="middle">₹${d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}</text>
              </g>
            `;
          }).join('')}
        </svg>
      </div>
    `;
  },

  // 2. Category Performance Donut Chart
  renderDonutChart(data, containerId, size = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    let accumulated = 0;

    const colors = ['#9d00ff', '#00f2fe', '#00e676', '#ffb300', '#ff4081'];
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:20px; justify-content:center; flex-wrap:wrap;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <g transform="rotate(-90 ${size / 2} ${size / 2})">
            ${data.map((d, idx) => {
              const fraction = d.value / total;
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -accumulated * circumference;
              accumulated += fraction;
              return `
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
                  fill="transparent" 
                  stroke="${colors[idx % colors.length]}" 
                  stroke-width="20" 
                  stroke-dasharray="${strokeDasharray}" 
                  stroke-dashoffset="${strokeDashoffset}"
                  style="transition:stroke-dasharray 0.8s ease;">
                  <title>${d.label}: ${Math.round(fraction * 100)}%</title>
                </circle>
              `;
            }).join('')}
          </g>
          <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">
            ${total} Rides
          </text>
        </svg>

        <!-- Legend -->
        <div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem;">
          ${data.map((d, idx) => `
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${colors[idx % colors.length]};"></span>
              <span style="color:var(--text-secondary);">${d.label}:</span>
              <span style="font-weight:700; color:var(--text-primary);">${Math.round((d.value / total) * 100)}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};
