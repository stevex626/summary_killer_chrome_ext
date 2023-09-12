chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "urlData") {
      const url = message.data;

      fetch("http://localhost:5000/summarize", {  // Modify endpoint to 'fetch-and-summarize'
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url })   // Pass URL instead of text
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const summary = data.summary || "Failed to generate a summary.";
        chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary});
      });
    }
});

