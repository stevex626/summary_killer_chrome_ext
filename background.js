chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "textData") {
      const text = message.data;

      fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: `Summarize: ${text}`,
          max_tokens: 200
        })
      })
      .then(response => response.json())
      .then(data => {
        const summary = data.choices[0].text.trim();
        chrome.tabs.sendMessage(sender.tab.id, {type: "summaryData", data: summary});
      });
    }
  });
  