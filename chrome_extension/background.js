/**
 * Phoenix AI Focus Guard - Background Service Worker
 * Tracks active tabs, monitors dwell time, computes semantic goal similarity,
 * logs activity to Phoenix backend (data/logs.db), and triggers distraction alerts.
 */

const PHOENIX_BACKEND_URL = "http://127.0.0.1:8000";
const DISTRACTION_THRESHOLD_SECONDS = 10; // Set to 10 seconds for rapid hackathon demo!
const SIMILARITY_MIN_THRESHOLD = 0.35;

let activeTabId = null;
let tabStartTime = Date.now();
let activeTabUrl = "";
let activeTabTitle = "";
let cachedGoal = "Master JEE / University Physics, Mathematics, and Computer Science derivations";
let alertTriggeredTabs = new Set();

// Initialize goal from Phoenix backend
async function syncGoalWithBackend() {
  try {
    const res = await fetch(`${PHOENIX_BACKEND_URL}/api/user/profile`);
    if (res.ok) {
      const data = await res.json();
      if (data.tailored_system_prompt || data.user_name) {
        cachedGoal = data.tailored_system_prompt || `${data.user_name} academic goals`;
        await chrome.storage.local.set({ phoenix_goal: cachedGoal });
      }
    }
  } catch (err) {
    // Offline or server not yet running; use cached
    chrome.storage.local.get(["phoenix_goal"], (res) => {
      if (res.phoenix_goal) cachedGoal = res.phoenix_goal;
    });
  }
}

syncGoalWithBackend();

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await handleTabDwellEnd();
  activeTabId = activeInfo.tabId;
  tabStartTime = Date.now();

  try {
    const tab = await chrome.tabs.get(activeTabId);
    activeTabUrl = tab.url || "";
    activeTabTitle = tab.title || "";
  } catch (e) {}
});

// Listen for tab updates (URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    handleTabDwellEnd();
    tabStartTime = Date.now();
    activeTabUrl = changeInfo.url;
    activeTabTitle = tab.title || "";
    alertTriggeredTabs.delete(tabId);
  }
});

// Heartbeat check every 2 seconds for active tab dwell time
setInterval(async () => {
  if (!activeTabId || !activeTabUrl || activeTabUrl.startsWith("chrome://") || activeTabUrl.startsWith("edge://")) {
    return;
  }

  // If already on Phoenix AI platform, do not trigger distraction alert
  if (activeTabUrl.includes("127.0.0.1:8000") || activeTabUrl.includes("localhost:3000") || activeTabUrl.includes("vercel.app")) {
    return;
  }

  const dwellSeconds = (Date.now() - tabStartTime) / 1000.0;
  
  if (dwellSeconds >= DISTRACTION_THRESHOLD_SECONDS && !alertTriggeredTabs.has(activeTabId)) {
    // Compute semantic match score
    const score = computeGoalSimilarity(activeTabUrl, activeTabTitle, cachedGoal);

    if (score < SIMILARITY_MIN_THRESHOLD) {
      alertTriggeredTabs.add(activeTabId);

      // Send trigger to content script to display the sleek floating modal
      try {
        await chrome.tabs.sendMessage(activeTabId, {
          type: "PHOENIX_DISTRACTION_ALERT",
          data: {
            url: activeTabUrl,
            title: activeTabTitle,
            dwellSeconds: Math.round(dwellSeconds),
            similarityScore: Math.round(score * 100),
            goal: cachedGoal.slice(0, 100),
            phoenixUrl: "http://127.0.0.1:8000"
          }
        });
      } catch (err) {
        // Content script might not be injected on restricted pages
      }

      // Log distraction to Phoenix logs.db backend
      await postActivityLog({
        url: activeTabUrl,
        page_title: activeTabTitle,
        time_spent_seconds: dwellSeconds,
        category: categorizeUrl(activeTabUrl),
        similarity_score: score,
        distraction_flag: 1,
        suggested_action: "Focus Alert: 10s spent on non-aligned content. Redirect to Phoenix AI."
      });
    }
  }
}, 2000);

async function handleTabDwellEnd() {
  if (!activeTabUrl || activeTabUrl.startsWith("chrome://")) return;
  const dwellSeconds = (Date.now() - tabStartTime) / 1000.0;
  if (dwellSeconds < 2) return; // Skip instantaneous tab switches

  const score = computeGoalSimilarity(activeTabUrl, activeTabTitle, cachedGoal);
  const isDistraction = score < SIMILARITY_MIN_THRESHOLD && dwellSeconds >= DISTRACTION_THRESHOLD_SECONDS;

  await postActivityLog({
    url: activeTabUrl,
    page_title: activeTabTitle,
    time_spent_seconds: dwellSeconds,
    category: categorizeUrl(activeTabUrl),
    similarity_score: score,
    distraction_flag: isDistraction ? 1 : 0,
    suggested_action: isDistraction ? "Redirected to Phoenix AI Tutor" : "Productive academic session logged."
  });
}

function computeGoalSimilarity(url, title, goal) {
  const academicKeywords = ["physics", "math", "calculus", "derivation", "formula", "chemistry", "quantum", "arxiv", "ncert", "code", "algorithm", "lecture", "cs", "textbook", "paper", "research", "exam", "jee", "college", "theorem"];
  const distractionKeywords = ["instagram", "facebook", "twitter", "reddit", "netflix", "tiktok", "reels", "shorts", "gaming", "twitch", "shopping", "amazon", "feed", "meme"];

  const combined = (url + " " + title).toLowerCase();

  // Known distraction sites
  for (const word of distractionKeywords) {
    if (combined.includes(word)) {
      return 0.12; // Very low match
    }
  }

  // Academic match
  let matches = 0;
  for (const word of academicKeywords) {
    if (combined.includes(word)) matches++;
  }

  if (matches >= 3) return 0.92;
  if (matches === 2) return 0.78;
  if (matches === 1) return 0.58;

  return 0.28; // Default low match for unaligned pages
}

function categorizeUrl(url) {
  const u = url.toLowerCase();
  if (u.includes("arxiv.org") || u.includes("sciencedirect") || u.includes("nature.com") || u.includes("doi.org")) return "Research Paper";
  if (u.includes("ncert") || u.includes("books.google") || u.includes("openstax")) return "Academic Textbook";
  if (u.includes("youtube.com") || u.includes("khanacademy") || u.includes("coursera")) return "Video Masterclass";
  if (u.includes("instagram") || u.includes("facebook") || u.includes("twitter") || u.includes("x.com")) return "Social Media Distraction";
  if (u.includes("reddit") || u.includes("netflix") || u.includes("twitch") || u.includes("game")) return "Entertainment / Casual";
  return "General Web";
}

async function postActivityLog(logData) {
  try {
    await fetch(`${PHOENIX_BACKEND_URL}/api/logs/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData)
    });
  } catch (e) {
    // Graceful offline fallback
  }
}
