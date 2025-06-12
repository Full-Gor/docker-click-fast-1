const apiUrl = "https://672e1217229a881691eed80f.mockapi.io/scores";
let score = 0;
let countdown = 10;
let interval;
let username = "";

// Classement des trophées en fonction de la valeur des pierres précieuses
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

function endGame() {
    clearInterval(interval);
    const trophy = getTrophy(score);
    saveScore(username, score, trophy);
    alert(`Fin du jeu ! Score : ${score} - Trophée obtenu : ${trophy}`);
    getData();
}

function getTrophy(score) {
    if (score >= valueMap["Or"]) return "Or";
    if (score >= valueMap["Rubis"]) return "Rubis";
    if (score >= valueMap["Émeraude"]) return "Émeraude";
    if (score >= valueMap["Saphir"]) return "Saphir";
    if (score >= valueMap["Argent"]) return "Argent";
    return "Bronze";
}

async function saveScore(username, score, trophy) {
    const data = {
        createdAt: new Date().toISOString(),
        username,
        score,
        trophy
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Erreur lors de l'enregistrement du score");

        console.log("Score enregistré :", await response.json());
    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function getData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erreur lors de la récupération des scores");

        const scores = await response.json();
        document.getElementById("scoreboard").innerHTML = scores
            .sort((a, b) => b.score - a.score)
            .map(s => `<p>${s.username} - ${s.score} pts (${s.trophy}) - ${new Date(s.createdAt).toLocaleString()}</p>`)
            .join("");

    } catch (error) {
        console.error("Erreur :", error);
    }
}

getData();
