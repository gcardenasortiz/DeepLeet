console.log("Content script loaded");

function getProblemDetails() {
  let titleElem = document.querySelector('meta[property="og:title"]');
  let descriptionElem = document.querySelector('meta[property="og:description"]');
  console.log("titleElem:", titleElem);
  console.log("descriptionElem:", descriptionElem);
  if (!titleElem || !descriptionElem) return null;
  return {
    title: titleElem.getAttribute('content'),
    description: descriptionElem.getAttribute('content')
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProblemDetails') {
    const details = getProblemDetails();
    sendResponse(details);
  }
});