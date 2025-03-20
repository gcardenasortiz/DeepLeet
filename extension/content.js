console.log("Content script loaded");

function getProblemDetails() {
  let titleElem = document.querySelector('meta[property="og:title"]');

  // starter code scraping
  let starterCodeContainer = document.querySelector('.view-lines.monaco-mouse-cursor-text');
  let starterCode = "";
  if (starterCodeContainer) {
    // get all lines of code and join them with newlines
    const viewLines = Array.from(starterCodeContainer.querySelectorAll('.view-line'));
    starterCode = viewLines.map(line => line.innerText).join('\n');
  }

  console.log("titleElem:\n", titleElem);
  console.log("starterCode:\n", starterCode)

  if (!titleElem || !descriptionElem) return null;
  return {
    title: titleElem.getAttribute('content'),
    starterCode: starterCode
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProblemDetails') {
    const details = getProblemDetails();
    sendResponse(details);
  }
});