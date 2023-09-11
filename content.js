chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "summaryData") {
      const summary = message.data;
      alert("Summary: " + summary);
    }
  });
  