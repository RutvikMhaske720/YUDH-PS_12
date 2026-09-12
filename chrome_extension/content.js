/**
 * Phoenix AI Focus Guard - Content Script
 * Listens for background alerts and renders a floating glassmorphism modal
 * with live similarity metrics and a 1-click redirect to Phoenix AI.
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PHOENIX_DISTRACTION_ALERT") {
    showPhoenixInterventionModal(message.data);
    sendResponse({ received: true });
  }
});

function showPhoenixInterventionModal(data) {
  // Prevent duplicate modals
  if (document.getElementById("phoenix-focus-modal-root")) {
    return;
  }

  const modalContainer = document.createElement("div");
  modalContainer.id = "phoenix-focus-modal-root";
  modalContainer.innerHTML = `
    <div class="phoenix-backdrop">
      <div class="phoenix-card">
        <div class="phoenix-card-header">
          <div class="phoenix-badge">
            <span class="phoenix-flame-icon">🔥</span>
            <span>Phoenix Focus Guard</span>
          </div>
          <button class="phoenix-close-btn" id="phoenixDismissBtn" title="Dismiss">✕</button>
        </div>

        <div class="phoenix-card-body">
          <h3 class="phoenix-alert-title">Off-Target Activity Detected</h3>
          <p class="phoenix-alert-desc">
            You've spent <strong style="color: #c97a5e;">${data.dwellSeconds} seconds</strong> on this tab, but it does not align with your active learning goals.
          </p>

          <div class="phoenix-metrics-box">
            <div class="phoenix-metric-row">
              <span class="phoenix-metric-lbl">Goal Semantic Match:</span>
              <span class="phoenix-metric-val ${data.similarityScore < 30 ? 'low' : 'mid'}">${data.similarityScore}% (Low Alignment)</span>
            </div>
            <div class="phoenix-metric-row">
              <span class="phoenix-metric-lbl">Active Learning Target:</span>
              <span class="phoenix-metric-val" style="color: #e6edf3; font-style: italic;">"${data.goal}"</span>
            </div>
          </div>

          <div class="phoenix-actions-row">
            <a href="${data.phoenixUrl}" target="_blank" class="phoenix-btn-primary" id="phoenixJumpBtn">
              🚀 Jump to Phoenix Study Workspace
            </a>
            <button class="phoenix-btn-secondary" id="phoenixSnoozeBtn">
              Snooze for 5m
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);

  document.getElementById("phoenixDismissBtn").addEventListener("click", () => {
    modalContainer.remove();
  });

  document.getElementById("phoenixSnoozeBtn").addEventListener("click", () => {
    modalContainer.remove();
  });

  document.getElementById("phoenixJumpBtn").addEventListener("click", () => {
    modalContainer.remove();
  });
}
