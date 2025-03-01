var data = {
    chatinit: {
        title: ["Hello <span class='emoji'> &#128075;</span>", "I am Mrs. Chatbot", "How can I help you?"],
        options: ["Movies <span class='emoji'> &#128250;</span>", "News", "Shopping <span class='emoji'> &#128090;</span>", "Music <span class='emoji'> &#127925;</span>"]
    },
    
    news: async function() {
        let response = await fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=AIzaSyBZqnb6SkHl2m0jcbEtDitpRy-uB0NDhJc');
        let newsData = await response.json();
        let headlines = newsData.articles.slice(0, 5).map(article => article.title);
        let links = newsData.articles.slice(0, 5).map(article => article.url);
        
        return {
            title: ["Today's Top 5 Headlines"],
            options: headlines,
            url: {
                more: "https://way2news.com/",
                link:["https://telugu.way2news.com"]
            }
        };
    },
    
    movies: {
        title: ["Check out the latest movies"],
        options: ["Latest Movies", "Trending Now", "Upcoming Releases"],
        url: {
            more: "https://www.movierules.ms/",
            link: ["https://5movierulz.co.nl/latest", "https://5movierulz.co.nl/trending", "https://5movierulz.co.nl/upcoming"]
        }
    },
    
    shopping: {
        title: ["Welcome to the Shopping Zone!", "Select a category to browse"],
        options: ["Electronics", "Beauty", "Mobiles", "Men's Fashion", "Women's Fashion"],
        url: {
            more: "https://amazon.com/",
            link: [
                "https://amazon.com/electronics",
                "https://amazon.com/beauty",
                "https://amazon.com/mobile",
                "https://www.amazon.com/s?k=mens+fashion",
                "https://www.amazon.com/s?k=Womens+Fashion"
            ]
        }
    },
    
    music: {
        title: ["Enjoy Music on Spotify"],
        options: ["Top Charts", "New Releases", "Trending Playlists"],
        url: {
            more: "https://open.spotify.com/",
            link: [
                "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", 
                "https://open.spotify.com/playlist/37i9dQZF1DWXJfnUiYjUKT", 
                "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd"
            ]
        }
    }
};

document.getElementById("init").addEventListener("click", showChatBot);
var cbot = document.getElementById("chat-box");

function showChatBot() {
    if (this.innerText === 'START CHAT') {
        document.getElementById('test').style.display = 'block';
        document.getElementById('init').innerText = 'CLOSE CHAT';
        initChat();
    } else {
        location.reload();
    }
}

function initChat() {
    cbot.innerHTML = '';
    let len1 = data.chatinit.title.length;
    for (let i = 0; i < len1; i++) {
        setTimeout(() => handleChat(i), i * 500);
    }
    setTimeout(() => showOptions(data.chatinit.options), (len1 + 1) * 500);
}

function handleChat(index) {
    let elm = document.createElement("p");
    elm.innerHTML = data.chatinit.title[index];
    elm.setAttribute("class", "msg");
    cbot.appendChild(elm);
    handleScroll();
}

function showOptions(options) {
    options.forEach(option => {
        let opt = document.createElement("span");
        opt.innerHTML = `<div>${option}</div>`;
        opt.setAttribute("class", "opt");
        opt.addEventListener("click", handleOpt);
        cbot.appendChild(opt);
    });
    handleScroll();
}

async function handleOpt() {
    let str = this.innerText.split(" ")[0].toLowerCase();
    document.querySelectorAll(".opt").forEach(el => el.remove());
    let elm = document.createElement("p");
    elm.setAttribute("class", "test");
    elm.innerHTML = `<span class="rep">${this.innerText}</span>`;
    cbot.appendChild(elm);
    
    let tempObj = typeof data[str] === "function" ? await data[str]() : data[str];
    handleResults(tempObj.title, tempObj.options, tempObj.url);
}

function handleResults(title, options, url) {
    title.forEach((t, i) => setTimeout(() => handleDelay(t), i * 500));
    setTimeout(() => url && url.link ? handleOptions(options, url) : showOptions(options), title.length * 500);
}

function handleDelay(title) {
    let elm = document.createElement("p");
    elm.innerHTML = title;
    elm.setAttribute("class", "msg");
    cbot.appendChild(elm);
}

function handleOptions(options, url) {
    options.forEach((option, i) => {
        let opt = document.createElement("span");
        opt.innerHTML = `<a class="m-link" href="${url.link[i]}" target="_blank">${option}</a>`;
        opt.setAttribute("class", "opt");
        cbot.appendChild(opt);
    });
    
    let moreOpt = document.createElement("span");
    moreOpt.innerHTML = `<a class="m-link" href="${url.more}" target="_blank">See more</a>`;
    moreOpt.setAttribute("class", "opt link");
    cbot.appendChild(moreOpt);
    handleScroll();
}

function handleScroll() {
    cbot.scrollTop = cbot.scrollHeight;
}