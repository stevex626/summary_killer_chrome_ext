chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startSummarization") {
        let currentURL = window.location.href; 
        chrome.runtime.sendMessage({type: "urlData", data: currentURL, title: message.title, isDeleted: message.isDeleted});
    } else if (message.type === "summaryData") {
        const summary = message.data;

        let summaryDiv = document.createElement("div");
        summaryDiv.classList.add('summary-div'); 
        summaryDiv.innerHTML = `<h2>Summary:</h2><p>${summary}</p>`;
        
        let closeButton = document.createElement("button");
        closeButton.classList.add('close-button');
        closeButton.innerText = "Close";
        closeButton.onclick = () => { summaryDiv.remove(); };
        
        const summarizeBtn = document.getElementById('summarizeBtn');
        if (summarizeBtn) {
            summarizeBtn.textContent = 'Summarize';
        }
        
        summaryDiv.appendChild(closeButton);
        document.body.appendChild(summaryDiv);
        
    }  else if (message.type === "contentTooLongError") {
        alert("Content is too long to summarize!");
        const summarizeBtn = document.getElementById('summarizeBtn');
        if (summarizeBtn) {
            summarizeBtn.textContent = 'Summarize';
        }
    }
});






