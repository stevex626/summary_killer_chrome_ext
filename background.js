const failSummaryErrorMessage = 'Failed to generate a summary!';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "urlData") {
    const url = message.data;
    const title = message.title;

    chrome.storage.local.get([url], function(result) {
      if (result[url] && result[url].summary !== failSummaryErrorMessage) {
        // If the summary exists in storage, send it directly
        chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: result[url].summary});
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
          const summary = data.summary || failSummaryErrorMessage;
          chrome.storage.local.set({[url]: {title: title, summary: summary}});
          chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary});
        });
      }
    });
  }
});
