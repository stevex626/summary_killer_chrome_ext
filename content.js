// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "startSummarization") {
//         let currentURL = window.location.href;  // Get current URL
//         chrome.runtime.sendMessage({type: "urlData", data: currentURL});
//     } else if (message.type === "summaryData") {
//         const summary = message.data;
//         alert("Summary: " + summary);
//     }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startSummarization") {
        let currentURL = window.location.href;  // Get current URL
        chrome.runtime.sendMessage({type: "urlData", data: currentURL});
    } else if (message.type === "summaryData") {
        const summary = message.data;

        // Display the summary in a div instead of an alert.
        let summaryDiv = document.createElement("div");
        summaryDiv.innerHTML = `<h2>Summary:</h2><p>${summary}</p>`;
        summaryDiv.style.position = "fixed";
        summaryDiv.style.top = "10%";
        summaryDiv.style.left = "10%";
        summaryDiv.style.width = "80%";
        summaryDiv.style.height = "auto";
        summaryDiv.style.background = "white";
        summaryDiv.style.border = "2px solid #007BFF";
        summaryDiv.style.padding = "20px";
        summaryDiv.style.zIndex = "999999";
        summaryDiv.style.overflowY = "scroll";
        summaryDiv.style.maxHeight = "70vh";
        summaryDiv.style.fontFamily = "Arial, sans-serif";
        
        let closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.marginTop = "20px";
        closeButton.onclick = () => { summaryDiv.remove(); };
        
        summaryDiv.appendChild(closeButton);
        document.body.appendChild(summaryDiv);
    }
});



