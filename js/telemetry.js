/**
 * VerHost - Telemetry & Live Network Simulation
 * Animates system counters and latency telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTelemetry();
});

function initTelemetry() {
  const latencyBadge = document.querySelector('#liveLatency');
  const opsCounter = document.querySelector('#opsCounter');

  if (latencyBadge) {
    setInterval(() => {
      // Simulate micro-fluctuations in low edge latency (0.8ms to 1.6ms)
      const lat = (0.8 + Math.random() * 0.8).toFixed(1);
      latencyBadge.textContent = `${lat}ms`;
    }, 2800);
  }

  if (opsCounter) {
    let baseOps = 4.8;
    setInterval(() => {
      const delta = (Math.random() * 0.2 - 0.1).toFixed(2);
      opsCounter.textContent = `${(baseOps + parseFloat(delta)).toFixed(2)}M ops/sec`;
    }, 3500);
  }
}
