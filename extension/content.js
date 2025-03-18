console.log("Content script loaded");

// STILL BROKEN I'M CALLING IT A NIGHT
function getProblemDetails() {
    let titleElem = document.querySelector('meta[property="og:title"]').textContent;
    let descriptionElem = document.querySelector('meta[property="og:description"]').textContent;
    console.log("titleElem:", titleElem);
    console.log("descriptionElem:", descriptionElem);
    if (!titleElem || !descriptionElem) return null;
    return {
        title: titleElem,
        description: descriptionElem
    };
}