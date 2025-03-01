function openChatbot(type) {
    let chatbotURL;
    switch (type) {
        case 'voice':
            chatbotURL = 'voice_chatbot.html';
            break;
        case 'shopping':
            chatbotURL = 'shopping_chatbot.html';
            break;
        case 'translate':
            chatbotURL = 'translate_chatbot.html';
            break;
        case 'music':
            chatbotURL = 'music_chatbot.html';
            break;
        case 'image':
            chatbotURL = 'image_chatbot.html';
            break;
        case 'maths':
            chatbotURL = 'maths_chatbot.html';
            break;
        case 'calender':
            chatbotURL = 'calender_chatbot.html';
            break;
        default:
            console.error('Invalid chatbot type');
            return;
    }

    window.open(chatbotURL, '_blank');
}