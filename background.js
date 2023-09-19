const failSummaryErrorMessage = 'Failed to generate a summary!';
const failFetchErrorMessage = 'Failed to fetch article content';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "urlData") {
    const url = message.data;
    const title = message.title;
    const isDeleted = message.isDeleted;

    chrome.storage.local.get([url], function(result) {
      if (result[url] && result[url].summary !== failSummaryErrorMessage) {

        if (result[url].isDeleted) {
          const timestamp = Date.now();
          chrome.storage.local.set({[url]: {title: title, summary: result[url].summary, isDeleted: isDeleted, timestamp:timestamp}});
        }
        chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: result[url].summary, isDeleted: false,  timestamp: result[url].timestamp});
      } else {

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
          const summary = data.summary;
          if (data.error) {
              if (data.error === "Content is too long to summarize") {
                  chrome.tabs.sendMessage(sender.tab.id, {type: "contentTooLongError", errorMsg: data.error});
              } else {
                  chrome.tabs.sendMessage(sender.tab.id, {type: "summaryError", errorMsg: data.error});
              }
          } else {
              const timestamp = Date.now();
              chrome.storage.local.set({[url]: {title: title, summary: summary, timestamp: timestamp, isDeleted: isDeleted}});
              chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary});
            }
        })
      }
    });
  }
});