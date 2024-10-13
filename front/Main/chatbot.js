// chatbot.js

// Load the Botpress Webchat script
const script = document.createElement('script');
script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
document.head.appendChild(script);

// Initialize Botpress Webchat after the script loads
script.onload = function () {
    window.botpressWebChat.init({
        "composerPlaceholder": "Type here to convey your messages",
        "botConversationDescription": "Chatbot ",
        "botId": "ceb56e89-8d9b-464d-b69a-c7bbdcb59c0e",
        "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
        "messagingUrl": "https://messaging.botpress.cloud",
        "clientId": "ceb56e89-8d9b-464d-b69a-c7bbdcb59c0e",
        "webhookId": "6b4595d1-35ae-46e7-a80b-9b84ea5c77de",
        "lazySocket": true,
        "themeName": "prism",
        "botName": "HexSkill+",
        "frontendVersion": "v1",
        "useSessionStorage": true,
        "theme": "prism",
        "themeColor": "#562e70", // Changed to #562e70
    });

    // Automatically open the chat window after the page loads (optional)
    window.botpressWebChat.onLoad(() => {
        window.botpressWebChat.sendEvent({ type: 'show' });
    });

    // Clear chat messages when navigating back
    window.addEventListener('beforeunload', () => {
        window.botpressWebChat.sendEvent({ type: 'reset' });
    });
};
