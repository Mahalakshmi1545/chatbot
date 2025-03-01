const key = "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";
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

// 🔹 Predefined images with correct paths
const predefinedImages = {
	"babu": "images/babu.jpg",
    "saraswathi": "images/saraswathi.jpg",
	"maha": "images/maha.jpg",
    "masthan_babu": "images/masthan_babu.jpg",
    "vara": "images/vara.jpg",
    "archana":"images/archana.jpg",
    "lakshmi":"images/lakshmi.jpg",
    "guru_charan":"images/guru_charan.jpg",
    "sajid":"images/sajid.jpg",
    "harshitha":"images/harshitha.jpg",
    "sada":"images/sada.jpg",
    "sara":"images/sara.jpg",
    "ruksana":"images/ruksana.jpg",
    "laiba":"images/laiba.jpg",
    "bhargavi":"images/bhargavi.jpg",
    "madhavi":"images/madhavi.jpg",
    "supriya":"images/supriya.jpg",
    "anjali":"images/anjali.jpg",
    "amrutha":"images/amrutha.jpg"
};

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
            headers: {
                Authorization: `Bearer ${key}`
            },
            method: "POST",
            body: JSON.stringify({ "inputs": inputText.value }),
        }
    );
    const result = await response.blob();
    image.style.display = "block";
    load.style.display = "none";
    return result;
}

async function generate() {
    let userInput = inputText.value.toLowerCase().trim();

    // 🔹 Check if input matches a predefined image
    if (predefinedImages.hasOwnProperty(userInput)) {
        image.src = predefinedImages[userInput];  // Set predefined image
        image.style.display = "block";  // Ensure visibility
        load.style.display = "none";  // Hide loading icon
        svg.style.display = "none";  // Hide default icon
        return;
    }

    // 🔹 Otherwise, generate image using AI
    load.style.display = "block";  // Show loading
    query().then((response) => {
        const objectUrl = URL.createObjectURL(response);
        image.src = objectUrl;
        image.style.display = "block";
        load.style.display = "none";

        // Enable download
        downloadBtn.addEventListener("click", () => {
            download(objectUrl);
        });
    });
}

// 🔹 Event Listeners
GenBtn.addEventListener("click", () => {
    generate();
    svg.style.display = "none";
});

inputText.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        generate();
        svg.style.display = "none";
    }
});

ResetBtn.addEventListener("click", () => {
    inputText.value = "";
    image.style.display = "none";
    svg.style.display = "block";
    load.style.display = "none";
});

function download(objectUrl) {
    fetch(objectUrl)
        .then(res => res.blob())
        .then(file => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click();
        })
        .catch(() => alert("Download failed"));
}
