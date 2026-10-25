chrome.action.onClicked.addListener((tab) => {
  if (!tab.url?.startsWith("https://bitbucket.org/")) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["script.js"]
  });
});
