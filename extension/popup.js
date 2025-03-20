document.addEventListener('DOMContentLoaded', async () => {
  const problemDetails = await getProblemDetails();
  const problemDiv = document.getElementById('problem-details');
  if (problemDetails) {
    problemDiv.innerHTML = `
      <h3>${problemDetails.title}</h3>
      <p>${problemDetails.description}</p>
      <h4>Starter Code:</h4>
      <pre>${problemDetails.starterCode}</pre>
    `;
  } else {
    problemDiv.textContent = "Not on a LeetCode problem page.";
  }
});

const askButton = document.getElementById('askButton');
const responseDiv = document.getElementById('response');

askButton.addEventListener('click', async () => {
  const originalText = askButton.textContent;

  // Disable button and show loading state
  askButton.disabled = true;
  askButton.textContent = 'Loading...';
  responseDiv.textContent = '';

  try {
    // Simulated server request (replace with actual fetch call when ready)
    const code = await mockServerRequest();

    // Get active tab and paste code
    const tab = await getActiveTab();
    const pasteSuccess = await pasteCodeToTab(tab.id, code);

    if (pasteSuccess) {
      // Visual feedback for success
      askButton.classList.add('success');
      askButton.textContent = 'Answer Pasted!';

      // Reset button after 1 second
      setTimeout(() => {
        askButton.classList.remove('success');
        askButton.textContent = originalText;
        askButton.disabled = false;
      }, 1000);
    } else {
      throw new Error('Failed to paste code into editor');
    }
  } catch (error) {
    console.error(error);
    responseDiv.textContent = error.message;
    askButton.textContent = originalText;
    askButton.disabled = false;
  }
});

// Simulated server request (replace with fetch() when backend is ready)
async function mockServerRequest() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`// Sample solution from server\nfunction solution() {\n  // Implementation\n}`);
    }, 1000);
  });
}

async function pasteCodeToTab(tabId, code) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { action: 'pasteCode', code, tabId },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Connection error:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(response?.success || false);
        }
      }
    );
  });
}

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
