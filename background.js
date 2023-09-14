const failSummaryErrorMessage = 'Failed to generate a summary!';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "urlData") {
    const url = message.data;
    const title = message.title;
    const isDeleted = message.isDeleted;

    chrome.storage.local.get([url], function(result) {
      if (result[url] && result[url].summary !== failSummaryErrorMessage) {
        // If the summary exists in storage, send it directly
        if (result[url].isDeleted) {
          const timestamp = Date.now();
          chrome.storage.local.set({[url]: {title: title, summary: result[url].summary, isDeleted: isDeleted, timestamp:timestamp}});
        }
        chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: result[url].summary, isDeleted: false,  timestamp: result[url].timestamp});
      } else {
        // If not, get the summary from the server and store it
        fetch("http://localhost:5000/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const summary = data.summary || failSummaryErrorMessage; // To check for summary

            // Change the button back to text from loading if there is error generating the summary
            if (summary === failSummaryErrorMessage) {
              const summarizeBtn = document.getElementById('summarizeBtn');
              if (summarizeBtn) {
                  summarizeBtn.textContent = 'Summarize';
              }
            }

            const timestamp = Date.now();  // Get current timestamp
            chrome.storage.local.set({[url]: {title: title, summary: summary, timestamp: timestamp, isDeleted: isDeleted}});
            chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary, isDeleted: isDeleted});
        });

      }
    });
  }
});