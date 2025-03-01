const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');

// Function to add a message to the chat box
function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send user input to the chatbot
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user');
    userInput.value = '';

    try {
        const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer L07AcQTcvKmME0qTTMW4dVoQyjDiQ6KPELVPxgON', // Replace with your Cohere API key
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 100,
            }),
        });

        if (!cohereResponse.ok) throw new Error('Failed to fetch response from Cohere API');
        
        const cohereData = await cohereResponse.json();
        const chatbotResponse = cohereData.generations[0].text.trim();
        addMessage(chatbotResponse, 'bot');
        speak(chatbotResponse);

        handleCommands(message);
    } catch (error) {
        console.error(error);
        addMessage('Sorry, something went wrong.', 'bot');
        speak('Sorry, something went wrong.');
    }
}

// Handle specific commands
function handleCommands(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('movie')) {
        const query = message.replace('movie', '').trim();
        searchMovies(query);
    } else if (lowerCaseMessage.includes('image')) {
        const query = message.replace('image', '').trim();
        searchImages(query);
    } else if (lowerCaseMessage.includes('news')) {
        const query = message.replace('news', '').trim();
        fetchNews(query);
    }
}

// Voice-to-Text using Web Speech API
function startVoiceInput() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        addMessage('Your browser does not support voice input.', 'bot');
        speak('Your browser does not support voice input.');
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };

    recognition.onerror = () => {
        addMessage('Sorry, I could not understand that.', 'bot');
        speak('Sorry, I could not understand that.');
    };
}

// Text-to-Voice using Web Speech API
function speak(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

// Movies Feature: Search for a movie using TMDB API
async function searchMovies(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=b384ef9b26fae87a9ba5bc895272d20b=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch movies');

        const data = await response.json();
        const movie = data.results[0];
        if (movie) {
            addMessage(`🎬 ${movie.title} (${movie.release_date}) - ${movie.overview}`, 'bot');
            speak(`Here's a movie: ${movie.title}. ${movie.overview}`);
        } else {
            addMessage('No results found.', 'bot');
            speak('No results found.');
        }
    } catch (error) {
        console.error(error);
        addMessage('Failed to fetch movies.', 'bot');
        speak('Failed to fetch movies.');
    }
}

// Images Feature: Search for an image using Unsplash API
async function searchImages(query) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=xUs6pEXmzlQdhTWVzN1zwwtMNNc1Ia9_y-JdyCaB7Ks`);
        if (!response.ok) throw new Error('Failed to fetch images');

        const data = await response.json();
        const image = data.results[0];
        if (image) {
            const imgElement = document.createElement('img');
            imgElement.src = image.urls.small;
            imgElement.alt = query;
            chatBox.appendChild(imgElement);
        } else {
            addMessage('No results found.', 'bot');
            speak('No results found.');
        }
    } catch (error) {
        console.error(error);
        addMessage('Failed to fetch images.', 'bot');
        speak('Failed to fetch images.');
    }
}

// News Feature: Fetch news articles using NewsAPI
async function fetchNews(query) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=e575cf434c7448168587bf9042193c6c`);
        if (!response.ok) throw new Error('Failed to fetch news');

        const data = await response.json();
        const articles = data.articles.slice(0, 3);
        articles.forEach((article) => {
            addMessage(`📰 ${article.title}: ${article.url}`, 'bot');
            speak(`Here's a news article: ${article.title}`);
        });
    } catch (error) {
        console.error(error);
        addMessage('Failed to fetch news.', 'bot');
        speak('Failed to fetch news.');
    }
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
voiceBtn.addEventListener('click', startVoiceInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
