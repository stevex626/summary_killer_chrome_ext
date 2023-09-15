document.addEventListener('DOMContentLoaded', function () {
    checkUserStatus();

    document.getElementById('signInBtn').addEventListener('click', function() {
        signInWithGoogle();
    });
});

function checkUserStatus() {
    chrome.storage.local.get(['signedIn'], function(result) {
        if (result.signedIn) {
            // User is signed in
            showMainUI();
        } else {
            // User is not signed in
            showSignInUI();
        }
    });
}

function showSignInUI() {
    document.getElementById('signInContainer').style.display = 'block';
    document.getElementById('mainUIContainer').style.display = 'none';
}

function showMainUI() {
    document.getElementById('signInContainer').style.display = 'none';
    document.getElementById('mainUIContainer').style.display = 'block';
    displaySummaries();  // Load summaries when main UI is shown
}

function signInWithGoogle() {
    let authUrl = 'https://accounts.google.com/o/oauth2/auth' +
        '?client_id=' + encodeURIComponent('28083851031-grhm4sqbubval5m3pst6jq00ldnd43qi.apps.googleusercontent.com') +
        '&response_type=id_token' +
        '&redirect_uri=' + encodeURIComponent(`https://ohniidicphccnjfijjpjmeomgjhnkbni.chromiumapp.org`) +
        '&scope=openid email';

    chrome.identity.launchWebAuthFlow({
        'url': authUrl,
        'interactive': true
    }, function (responseUrl) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            return;
        }

        let id_token = responseUrl.substring(responseUrl.indexOf("id_token=") + 9);
        id_token = id_token.substring(0, id_token.indexOf('&'));
        console.log(id_token);
        // Send this token to your server for verification and get user details.
        
        fetch('http://localhost:5000/verifyToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: id_token }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message && data.message === 'Successfully authenticated') {
                chrome.storage.local.set({signedIn: true}, function() {
                    showMainUI();
                });
            } else {
                console.error(data.error);
                showSignInUI();
            }
        })
        .catch(error => {
            console.error("Token verification failed:", error);
        });
    });
}

document.getElementById('summarizeBtn').addEventListener('click', () => {
    const title = document.getElementById('titleInput').value.trim();

    if (!title) {
        document.getElementById('error').innerText = "Please enter a title before summarizing";
        return;
    }

    // Replace the button's text with the loader when generating
    const summarizeBtn = document.getElementById('summarizeBtn');
    summarizeBtn.innerHTML = '<div class="loader"></div>';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {type: "startSummarization", title: title, isDeleted: false});
    });
});

const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return `${url.substring(0, maxLength - 3)}...`;
}

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

        // Convert entries to an array and sort by timestamp
        const sortedEntries = Object.entries(items).sort((a, b) => {
            return (b[1].timestamp || 0) - (a[1].timestamp || 0);
        });

        for (const [url, data] of sortedEntries) {
            if (((!searchTitle) || (data.title && data.title.toLowerCase().includes(searchTitle.toLowerCase()))) && !data.isDeleted && !(url==="signedIn")) {
                const summaryEntry = document.createElement('div');
                summaryEntry.classList.add('summary-entry');

                const titleElem = document.createElement('h3');
                titleElem.innerText = data.title;

                const urlElem = document.createElement('a');
                urlElem.href = url;
                urlElem.target = "_blank";
                const truncatedUrl = truncateUrl(url);
                urlElem.innerText = truncatedUrl;

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
