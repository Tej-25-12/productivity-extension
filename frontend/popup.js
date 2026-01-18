// Show local report
chrome.storage.local.get("siteTimes", (data) => {
  const report = document.getElementById("report");
  const times = data.siteTimes || {};

  for (let site in times) {
    const seconds = Math.floor(times[site].total / 1000);
    const p = document.createElement("p");
    p.textContent = `${site}: ${seconds} seconds`;
    report.appendChild(p);
  }
});

// Sync button → send data directly to backend
document.getElementById("sync").addEventListener("click", async () => {
  const response = await fetch("http://localhost:5000/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "youtube.com", // replace with actual tracked domain
      totalTime: 120         // replace with actual tracked time
    })
  });

  const result = await response.json();
  alert(result.message); // shows "Data saved!" if successful
});
