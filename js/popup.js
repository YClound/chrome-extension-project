// @ts-nocheck
const btn = document.getElementById('changeColor');

const changeColor = (color) => {
  document.body.style.backgroundColor = color;
}

if (btn) {
  btn.addEventListener("click", () => {
    chrome.storage.sync.get("color", ({ color }) => {
      console.log(color)
      
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: changeColor(color),
        });
      });

    });
    
  })
}

