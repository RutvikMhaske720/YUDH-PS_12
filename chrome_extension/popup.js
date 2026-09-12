document.addEventListener("DOMContentLoaded", async () => {
  const tabTitleEl = document.getElementById("tabTitle");
  const tabDomainEl = document.getElementById("tabDomain");
  const simScoreEl = document.getElementById("simScore");
  const dwellTimeEl = document.getElementById("dwellTime");
  const syncedGoalEl = document.getElementById("syncedGoal");
  const syncNowBtn = document.getElementById("syncNowBtn");

  // 1. Query active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      tabTitleEl.textContent = tab.title || "Active Tab";
      if (tab.url) {
        try {
          const urlObj = new URL(tab.url);
          tabDomainEl.textContent = urlObj.hostname;

          // Quick simulated score
          const u = tab.url.toLowerCase();
          if (u.includes("arxiv") || u.includes("ncert") || u.includes("sciencedirect") || u.includes("math")) {
            simScoreEl.textContent = "94%";
            simScoreEl.style.color = "#3fb950";
          } else if (u.includes("instagram") || u.includes("reddit") || u.includes("netflix") || u.includes("twitter")) {
            simScoreEl.textContent = "14%";
            simScoreEl.style.color = "#f85149";
          } else {
            simScoreEl.textContent = "68%";
            simScoreEl.style.color = "#d29922";
          }
        } catch (e) {
          tabDomainEl.textContent = tab.url;
        }
      }
    }
  } catch (e) {
    tabTitleEl.textContent = "Unable to inspect tab";
  }

  // 2. Load goal from storage or Phoenix backend
  chrome.storage.local.get(["phoenix_goal"], (res) => {
    if (res.phoenix_goal) {
      syncedGoalEl.textContent = res.phoenix_goal.slice(0, 90) + "...";
    } else {
      fetchPhoenixProfile();
    }
  });

  async function fetchPhoenixProfile() {
    syncedGoalEl.textContent = "Connecting to Phoenix AI...";
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        const goal = data.tailored_system_prompt || `${data.user_name} • ${data.gradeOrDegree || 'JEE/STEM Track'}`;
        syncedGoalEl.textContent = goal.slice(0, 90) + "...";
        chrome.storage.local.set({ phoenix_goal: goal });
      } else {
        syncedGoalEl.textContent = "Master JEE / STEM Physical Sciences & Calculus";
      }
    } catch (e) {
      syncedGoalEl.textContent = "Master JEE / STEM Physical Sciences & Calculus";
    }
  }

  syncNowBtn.addEventListener("click", fetchPhoenixProfile);
});
