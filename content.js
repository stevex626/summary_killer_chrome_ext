// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startSummarization") {
        let textData = document.body.innerText;
        chrome.runtime.sendMessage({type: "textData", data: textData});
    }
});

