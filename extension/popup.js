document.addEventListener('DOMContentLoaded', async () => {
  const problemDetails = await getProblemDetails();
  const problemDiv = document.getElementById('problem-details');
  if (problemDetails) {
    problemDiv.innerHTML = `<h3>${problemDetails.title}</h3><p>${problemDetails.description}</p>`;
  } else {
    problemDiv.textContent = "Not on a LeetCode problem page.";
  }
});

const inputField = document.getElementById('input');
const askButton = document.getElementById('askButton');
const loader = document.getElementById('loader');
const responseDiv = document.getElementById('response');

askButton.addEventListener('click', async () => {
  const input = inputField.value;
  if (!input) return;

  loader.style.display = 'block';
  responseDiv.textContent = '';

  try {
    const problemDetails = await getProblemDetails();
    console.log("Received problemDetails:", problemDetails);
    if (problemDetails) {
      const aiResponse = await queryAI(input, problemDetails);
      responseDiv.textContent = aiResponse;
    } else {
      responseDiv.textContent = "Please open a LeetCode problem page to use this feature.";
    }
  } catch (error) {
    responseDiv.textContent = `Error: ${error.message}`;
  } finally {
    loader.style.display = 'none';
  }
});

async function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

async function getProblemDetails() {
  const tab = await getActiveTab();
  console.log("Active tab URL:", tab.url);
  if (tab && tab.url.startsWith('https://leetcode.com/problems/')) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { action: 'getProblemDetails' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
          resolve(null);
        } else {
          console.log("Received problemDetails:", response);
          resolve(response);
        }
      });
    });
  }
  return null;
}

// REplace with real API call
async function queryAI(input, problemDetails) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `You asked: "${input}" about the problem "${problemDetails.title}". "${problemDetails.description}" DEBUG`;
}