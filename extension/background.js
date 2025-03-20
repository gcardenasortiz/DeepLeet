chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'pasteCode') {
        // Use request.tabId provided by the popup
        chrome.scripting.executeScript({
            target: { tabId: request.tabId },
            world: 'MAIN', // Inject into the page's context so monaco is available
            func: (code) => {
                function trySetValue(attempt = 0) {
                    try {
                        // Check if monaco is available
                        if (typeof monaco === 'undefined') {
                            throw new Error("monaco is not defined yet");
                        }
                        const editors = monaco.editor.getEditors();
                        if (editors.length > 0) {
                            editors[0].setValue(code);
                            return true;
                        }
                        if (attempt < 5) {
                            setTimeout(() => trySetValue(attempt + 1), 300);
                        }
                        return false;
                    } catch (e) {
                        console.error('Monaco error:', e);
                        return false;
                    }
                }
                return trySetValue();
            },
            args: [request.code]
        }).then(results => {
            sendResponse({ success: results[0].result });
        }).catch(error => {
            console.error('Injection error:', error);
            sendResponse({ success: false });
        });
        return true; // Keep the message channel open
    }
});
