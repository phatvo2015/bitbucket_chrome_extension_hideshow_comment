chrome.action.onClicked.addListener((tab) => {
  if (tab.url?.startsWith("chrome://")) return undefined;

  if (tab.url.startsWith("https://bitbucket.org/") > -1) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["script.js"]
    });
  }
});