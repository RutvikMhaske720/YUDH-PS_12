# Phoenix AI Focus Guard • Chrome Extension

An intelligent academic focus and distraction-prevention extension that tracks active tabs, computes semantic alignment against your active Phoenix AI learning goals, logs telemetry to `logs.db`, and intervenes when you spend more than 10 seconds on non-aligned websites.

---

### Key Features
1. **Dwell Time & Telemetry Logging**:
   - Logs active browsing sessions to the Phoenix backend (`POST /api/logs/track`).
   - Populates `data/logs.db` with domain dwell durations, distraction flags, and timestamps.
2. **Semantic Goal Similarity**:
   - Fetches the student's active tailored prompt and goals directly from Phoenix AI.
   - Evaluates whether the visited website matches your STEM study targets.
3. **Instant Demo Focus Interceptor (10s Threshold)**:
   - If you remain on a distracting site (e.g. social media, casual entertainment) for **10 seconds**, a floating glassmorphism modal pops up displaying:
     - Dwell duration
     - Goal Semantic Match (e.g. `14% - Low Alignment`)
     - One-click button: **"🚀 Jump to Phoenix Study Workspace"**

---

### Quick Installation (Load Unpacked)

1. Open **Google Chrome** or **Microsoft Edge**.
2. Navigate to: `chrome://extensions/`
3. Toggle on **Developer mode** (top-right corner).
4. Click **Load unpacked** (top-left corner).
5. Select this directory:
   ```
   c:\Users\RUTVIK M\Music\scratch check\chrome_extension
   ```
6. The Phoenix AI flame icon will appear in your browser extensions bar!
7. Open any tab (e.g. Instagram, Reddit, YouTube, or arXiv) to observe live telemetry tracking and distraction interception.
