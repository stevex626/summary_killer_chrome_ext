// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "textData") {
      const text = message.data;

      console.log("Received text:", text);

      // For testing, just return a dummy summary:
      const summary = "This is a dummy summary for testing!";
      chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary});
    }
});
