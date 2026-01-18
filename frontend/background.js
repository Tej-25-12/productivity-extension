let siteTimes = {};

// Track time spent on websites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);
    const domain = url.hostname;
    const now = Date.now();

    if (!siteTimes[domain]) {
      siteTimes[domain] = { start: now, total: 0 };
    } else {
      siteTimes[domain].total += now - siteTimes[domain].start;
      siteTimes[domain].start = now;
    }

    chrome.storage.local.set({ siteTimes });
  }
});

// Sync data to backend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "syncData") {
    chrome.storage.local.get("siteTimes", (data) => {
      const times = data.siteTimes || {};
      for (let domain in times) {
        fetch("http://localhost:5000/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domain,
            totalTime: Math.floor(times[domain].total / 1000),
          }),
        });
      }
    });
    sendResponse({ status: "Data synced!" });
  }
});
