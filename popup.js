document.getElementById('summarizeBtn').addEventListener('click', () => {
    const title = document.getElementById('titleInput').value.trim();

    if (!title) {
        document.getElementById('error').innerText = "Please enter a title before summarizing";
        return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization", title: title, isDeleted: false});
    });
});

const createConfirmationModal = (onCancel, onConfirm) => {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const messageElem = document.createElement('p');
    messageElem.innerText = 'Are you sure you want to delete this summary?';
    
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.addEventListener('click', () => {
        onCancel();
        modalContainer.remove();
    });

    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Confirm';
    confirmButton.addEventListener('click', () => {
        onConfirm();
        modalContainer.remove();
    });

    modalContent.appendChild(messageElem);
    modalContent.appendChild(cancelButton);
    modalContent.appendChild(confirmButton);    
    modalContainer.appendChild(modalContent);

    return modalContainer;
};


function displaySummaries(searchTitle = '') {
    chrome.storage.local.get(null, function(items) {
        const container = document.getElementById('summariesContainer');
        container.innerHTML = ''; // Clear any previous entries

        for (const [url, data] of Object.entries(items)) {
            if (((!searchTitle) || (data.title && data.title.toLowerCase().includes(searchTitle.toLowerCase()))) && !data.isDeleted) {
                const summaryEntry = document.createElement('div');
                summaryEntry.classList.add('summary-entry');

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

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.onclick = function() {
                    const modal = createConfirmationModal(
                        () => {
                            // On cancel
                        },

                        () => {
                            // On confirm
                            summaryEntry.remove();
                            data.isDeleted = true;
                            // Save the updated data to Chrome storage
                            chrome.storage.local.set({[url]: data});
                        },
                    );
                    document.body.appendChild(modal);
                };            
                summaryContainer.appendChild(summaryElem);
                summaryContainer.appendChild(expandButton);
                summaryEntry.appendChild(titleElem);
                summaryEntry.appendChild(urlElem);
                summaryEntry.appendChild(summaryContainer);
                container.appendChild(summaryEntry);
                summaryContainer.appendChild(deleteButton);
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
