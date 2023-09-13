// document.getElementById('summarizeBtn').addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         const activeTab = tabs[0];
//         chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization"});
//     });
// });

document.getElementById('summarizeBtn').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization"});
    });
});

