chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "urlData") {
      const url = message.data;

      chrome.storage.local.get([url], function(result) {
        if (result[url]) {
          // If the summary exists in storage, send it directly
          chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: result[url]});
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
            const summary = data.summary || "Failed to generate a summary.";
            chrome.storage.local.set({[url]: summary});  // Store the summary in Chrome storage
            chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary});
          });
        }
      });
    }
});


