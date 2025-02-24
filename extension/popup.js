// Will change or add any functionality that is needed
document.addEventListener('DOMContentLoaded', () => {
    const askButton = document.getElementById('askDeepLeet');
    const inputField = document.getElementById('input');
    const responseDiv = document.getElementById('response');
  
    askButton.addEventListener('click', async () => {
      const input = inputField.value;
      if (!input) return;
  
      try {
        const aiResponse = await queryAI(input);
        responseDiv.textContent = aiResponse;
      } catch (error) {
        responseDiv.textContent = `Error: ${error.message}`;
      }
    });
  });
  
  async function queryAI(input) {
    /* Just waiting on the endpoint or however else
    / we will interact with our model*/
    const API_URL = 'YOUR_AI_ENDPOINT_HERE';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any authentication headers your AI requires
        // 'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({ input: input })
    });
  
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data.result; 
  }