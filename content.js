chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startSummarization") {
        let currentURL = window.location.href;  // Get current URL
        chrome.runtime.sendMessage({type: "urlData", data: currentURL});
    } else if (message.type === "summaryData") {
        const summary = message.data;
        console.log(summary);
        // Display the summary in a div instead of an alert.
        let summaryDiv = document.createElement("div");
        summaryDiv.classList.add('summary-div'); // Add the class for styling
        summaryDiv.innerHTML = `<h2>Summary:</h2><p>${summary}</p>`;
        
        let closeButton = document.createElement("button");
        closeButton.classList.add('close-button'); // Add the class for styling
        closeButton.innerText = "Close";
        closeButton.onclick = () => { summaryDiv.remove(); };
        
        summaryDiv.appendChild(closeButton);
        document.body.appendChild(summaryDiv);
    }
});






