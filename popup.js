document.getElementById('summarizeBtn').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization"});
    });
});

function displaySummaries() {
    chrome.storage.local.get(null, function(items) {
        const container = document.getElementById('summariesContainer');
        container.innerHTML = ''; // Clear any previous entries

        for (const [url, summary] of Object.entries(items)) {
            const summaryDiv = document.createElement('div');
            summaryDiv.classList.add('summary-entry'); // Consider adding some CSS for this class

            const urlElem = document.createElement('a');
            urlElem.href = url;
            urlElem.target = "_blank"; // To open in a new tab
            urlElem.innerText = url;

            const summaryElem = document.createElement('p');
            summaryElem.innerText = summary;

            summaryDiv.appendChild(urlElem);
            summaryDiv.appendChild(summaryElem);
            container.appendChild(summaryDiv);
        }
    });
}

// Display summaries on popup load
displaySummaries();
