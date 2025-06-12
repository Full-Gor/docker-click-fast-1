import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "TON_PROJET.firebaseapp.com",
    projectId: "TON_PROJET",
    storageBucket: "TON_PROJET.appspot.com",
    messagingSenderId: "TON_ID",
    appId: "TON_APP_ID"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let score = 0;
let countdown = 10;
let interval;
let username = "";

const valueMap = {
    "Or": 1000,
    "Argent": 500,
    "Bronze": 200,
    "Rubis": 750,
    "Saphir": 600,
    "Émeraude": 800
};

document.getElementById("startBtn").addEventListener("click", () => {
    username = document.getElementById("username").value;
    if (!username) {
        alert("Veuillez entrer un pseudo avant de jouer !");
        return;
    }
    startGame();
});

document.getElementById("clickBtn").addEventListener("click", () => {
    score++;
    document.getElementById("score").innerText = score;
});

document.getElementById("resetBtn").addEventListener("click", resetGame);

function startGame() {
    score = 0;
    countdown = 10;
    document.getElementById("score").innerText = score;
    document.getElementById("countdown").innerText = countdown;
    interval = setInterval(() => {
        countdown--;
        document.getElementById("countdown").innerText = countdown;
        if (countdown <= 0) endGame();
    }, 1000);
}

function resetGame() {
    score = 0;
    countdown = 10;
    document.getElementById("score").innerText = score;
    document.getElementById("countdown").innerText = countdown;
    clearInterval(interval);
    startGame();
}

async function saveScore(username, score) {
    const trophy = getTrophy(score);
    try {
        await addDoc(collection(db, "scores"), {
            username,
            score,
            trophy,
            createdAt: new Date().toISOString()
        });
        console.log("Score enregistré !");
    } catch (error) {
        console.error("Erreur d'enregistrement :", error);
    }
    getData();
}

async function getData() {
    try {
        const querySnapshot = await getDocs(collection(db, "scores"));
        document.getElementById("scoreboard").innerHTML = querySnapshot.docs
            .map(doc => {
                const data = doc.data();
                return `<p>${data.username} - ${data.score} pts (${data.trophy}) - ${new Date(data.createdAt).toLocaleString()}</p>`;
            })
            .join("");
    } catch (error) {
        console.error("Erreur de récupération :", error);
    }
}

function endGame() {
    clearInterval(interval);
    saveScore(username, score);
}

getData();
