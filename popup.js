document.getElementById('summarizeBtn').addEventListener('click', () => {
    // Assuming you want to send a message to the content script to initiate summarization
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization"});
    });
});
