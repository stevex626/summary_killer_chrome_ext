chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startSummarization") {
        let currentURL = window.location.href;  // Get current URL
        chrome.runtime.sendMessage({type: "urlData", data: currentURL});
    } else if (message.type === "summaryData") {
        const summary = message.data;
        alert("Summary: " + summary);
    }
});


