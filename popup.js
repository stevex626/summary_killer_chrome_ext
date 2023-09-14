document.getElementById('summarizeBtn').addEventListener('click', () => {
    const title = document.getElementById('titleInput').value.trim();

    if (!title) {
        document.getElementById('error').innerText = "Please enter a title before summarizing";
        return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization", title: title});
    });
});

function displaySummaries(searchTitle = '') {
    chrome.storage.local.get(null, function(items) {
        const container = document.getElementById('summariesContainer');
        container.innerHTML = ''; // Clear any previous entries

        for (const [url, data] of Object.entries(items)) {
            if (!searchTitle || (data.title && data.title.toLowerCase().includes(searchTitle.toLowerCase()))) {
                const summaryDiv = document.createElement('div');
                summaryDiv.classList.add('summary-entry');

                const titleElem = document.createElement('h3');
                titleElem.innerText = data.title;

                const urlElem = document.createElement('a');
                urlElem.href = url;
                urlElem.target = "_blank";
                urlElem.innerText = url;

                const summaryContainer = document.createElement('div');
                summaryContainer.style.position = 'relative';

                const summaryElem = document.createElement('p');
                summaryElem.innerText = data.summary;
                summaryElem.style.maxHeight = '50px';
                summaryElem.style.overflow = 'hidden';

                const expandButton = document.createElement('button');
                expandButton.innerText = 'Expand';
                expandButton.style.right = '0';
                expandButton.style.bottom = '0';

                expandButton.onclick = function() {
                    if (summaryElem.style.maxHeight === '50px' || !summaryElem.style.maxHeight) {
                        summaryElem.style.maxHeight = 'none';
                        expandButton.innerText = 'Collapse';
                    } else {
                        summaryElem.style.maxHeight = '50px';
                        expandButton.innerText = 'Expand';
                    }
                };

                summaryContainer.appendChild(summaryElem);
                summaryContainer.appendChild(expandButton);
                summaryDiv.appendChild(titleElem);
                summaryDiv.appendChild(urlElem);
                summaryDiv.appendChild(summaryContainer);
                container.appendChild(summaryDiv);
            }
        }
    });
}

// Handle search input
document.getElementById('searchInput').addEventListener('input', (e) => {
    displaySummaries(e.target.value);
});

// Display summaries on popup load
displaySummaries();
