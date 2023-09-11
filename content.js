const text = document.body.innerText;
chrome.runtime.sendMessage({type: "textData", data: text});
