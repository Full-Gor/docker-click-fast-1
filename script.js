// Configuration de l'API MockAPI
const API_BASE_URL = 'https://672e1217229a881691eed80f.mockapi.io/scores';

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

// ATTENDRE QUE LE DOM SOIT CHARGÉ
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 DOM chargé, initialisation de ClickFast...");
    
    // Vérifier que tous les éléments existent
    const startBtn = document.getElementById("startBtn");
    const clickBtn = document.getElementById("clickBtn");
    const resetBtn = document.getElementById("resetBtn");
    const usernameInput = document.getElementById("username");
    const scoreDisplay = document.getElementById("score");
    const countdownDisplay = document.getElementById("countdown");
    
    if (!startBtn || !clickBtn || !resetBtn || !usernameInput || !scoreDisplay || !countdownDisplay) {
        console.error("❌ Éléments HTML manquants !");
        return;
    }
    
    console.log("✅ Tous les éléments HTML trouvés");
    
    // Event Listeners
    startBtn.addEventListener("click", () => {
        console.log("🚀 Bouton Start cliqué");
        username = usernameInput.value.trim();
        if (!username) {
            alert("Veuillez entrer un pseudo avant de jouer !");
            return;
        }
        console.log("👤 Pseudo:", username);
        startGame();
    });

    clickBtn.addEventListener("click", () => {
        score++;
        scoreDisplay.innerText = score;
        console.log("👆 Clic ! Score:", score);
    });

    resetBtn.addEventListener("click", resetGame);
    
    // Charger les scores initiaux
    displayScores();
    
    console.log("🎯 ClickFast initialisé avec succès !");
});

function startGame() {
    console.log("🎮 Démarrage du jeu...");
    score = 0;
    countdown = 10;
    
    const scoreDisplay = document.getElementById("score");
    const countdownDisplay = document.getElementById("countdown");
    
    if (scoreDisplay) scoreDisplay.innerText = score;
    if (countdownDisplay) countdownDisplay.innerText = countdown;
    
    // Arrêter l'ancien intervalle s'il existe
    if (interval) {
        clearInterval(interval);
    }
    
    interval = setInterval(() => {
        countdown--;
        console.log("⏰ Countdown:", countdown);
        if (countdownDisplay) countdownDisplay.innerText = countdown;
        if (countdown <= 0) {
            console.log("⏱️ Fin du jeu !");
            endGame();
        }
    }, 1000);
    
    console.log("✅ Jeu démarré, compteur lancé");
}

function resetGame() {
    console.log("🔄 Reset du jeu");
    score = 0;
    countdown = 10;
    
    const scoreDisplay = document.getElementById("score");
    const countdownDisplay = document.getElementById("countdown");
    
    if (scoreDisplay) scoreDisplay.innerText = score;
    if (countdownDisplay) countdownDisplay.innerText = countdown;
    
    if (interval) {
        clearInterval(interval);
    }
    
    startGame();
}

function getTrophy(score) {
    if (score >= 100) return "Or";
    if (score >= 75) return "Argent";
    if (score >= 50) return "Bronze";
    if (score >= 40) return "Rubis";
    if (score >= 30) return "Saphir";
    if (score >= 20) return "Émeraude";
    return "Participation";
}

// Fonction pour envoyer le score vers MockAPI
const postScore = async (userData) => {
    try {
        console.log("📤 Envoi du score vers l'API...", userData);
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("✅ Score enregistré avec succès:", result);
        return result;
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement:", error);
        throw error;
    }
};

// Fonction pour récupérer tous les scores depuis MockAPI
const getAllScores = async () => {
    try {
        console.log("📥 Récupération des scores...");
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("✅ Scores récupérés:", data.length, "scores");
        return data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération:", error);
        return [];
    }
};

// Fonction pour supprimer les anciens scores d'un utilisateur
const deleteUserScores = async (username) => {
    try {
        const users = await getAllScores();
        const usersToDelete = users.filter(user => user.username === username);
        
        for (const user of usersToDelete) {
            const deleteResponse = await fetch(`${API_BASE_URL}/${user.id}`, {
                method: "DELETE",
            });
            if (deleteResponse.ok) {
                console.log(`🗑️ Ancien score de ${username} supprimé (ID: ${user.id})`);
            }
        }
    } catch (error) {
        console.error("❌ Erreur lors de la suppression:", error);
    }
};

// Fonction principale pour sauvegarder le score
async function saveScore(username, score) {
    const trophy = getTrophy(score);
    
    console.log("💾 Sauvegarde du score:", { username, score, trophy });
    
    // Générer un avatar aléatoire basé sur le username
    const avatarOptions = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username,
        "https://api.dicebear.com/7.x/bottts/svg?seed=" + username,
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + username
    ];
    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
    
    const scoreData = {
        createdAt: new Date().toISOString(),
        username: username,
        avatar: randomAvatar,
        score: score,
        trophy: trophy,
        website_url: "onyj.github.io/ClickFast",
    };

    try {
        // Supprimer les anciens scores de cet utilisateur (optionnel)
        // await deleteUserScores(username);
        
        // Enregistrer le nouveau score
        await postScore(scoreData);
        
        alert(`🎉 Félicitations ${username} !\n🎯 Score: ${score} clics\n🏆 Trophée: ${trophy}\n📊 Score enregistré en ligne !`);
        
        // Rafraîchir le tableau des scores
        await displayScores();
        
    } catch (error) {
        alert(`❌ Erreur lors de la sauvegarde du score.\n💾 Score: ${score} clics - Trophée: ${trophy}`);
    }
}

// Fonction pour afficher le tableau des scores
async function displayScores() {
    try {
        const scores = await getAllScores();
        
        // Trier par score décroissant puis par date
        const sortedScores = scores
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .slice(0, 15); // Top 15

        const scoreboard = document.getElementById("scoreboard");
        
        if (!scoreboard) {
            console.error("❌ Élément scoreboard introuvable");
            return;
        }
        
        if (sortedScores.length === 0) {
            scoreboard.innerHTML = '<p class="no-scores">🎮 Aucun score enregistré. Soyez le premier à jouer !</p>';
            return;
        }

        scoreboard.innerHTML = sortedScores
            .map((data, index) => {
                const position = index + 1;
                let medal = "";
                let positionClass = "";
                
                if (position === 1) {
                    medal = "🥇";
                    positionClass = "first-place";
                } else if (position === 2) {
                    medal = "🥈";
                    positionClass = "second-place";
                } else if (position === 3) {
                    medal = "🥉";
                    positionClass = "third-place";
                } else {
                    medal = `#${position}`;
                    positionClass = "other-place";
                }
                
                const date = new Date(data.createdAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const trophyEmoji = {
                    "Or": "🏆",
                    "Argent": "🥈",
                    "Bronze": "🥉",
                    "Rubis": "💎",
                    "Saphir": "💙",
                    "Émeraude": "💚",
                    "Participation": "🎖️"
                };
                
                return `
                    <div class="score-entry ${positionClass}">
                        <div class="score-position">${medal}</div>
                        <img src="${data.avatar}" alt="Avatar" class="score-avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}'">
                        <div class="score-info">
                            <div class="score-username">${data.username}</div>
                            <div class="score-details">
                                <span class="score-points">${data.score} clics</span>
                                <span class="score-trophy">${trophyEmoji[data.trophy] || '🎖️'} ${data.trophy}</span>
                                <span class="score-date">${date}</span>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join("");
            
    } catch (error) {
        console.error("❌ Erreur lors de l'affichage des scores:", error);
        const scoreboard = document.getElementById("scoreboard");
        if (scoreboard) {
            scoreboard.innerHTML = '<p class="error">❌ Erreur lors du chargement des scores</p>';
        }
    }
}

function endGame() {
    console.log("🏁 Fin de partie !");
    if (interval) {
        clearInterval(interval);
    }
    saveScore(username, score);
}

// Fonction pour partager le score
function shareScore(username, score, trophy) {
    const shareText = `🎮 J'ai fait ${score} clics en 10 secondes sur ClickFast ! Trophée: ${trophy} 🏆`;
    
    if (navigator.share) {
        navigator.share({
            title: 'ClickFast - Mon Score',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText + ` - Jouez sur: ${window.location.href}`)
            .then(() => alert("Score copié dans le presse-papier ! 📋"))
            .catch(() => alert("Partage: " + shareText));
    }
}

// Fonction utilitaire pour nettoyer l'API (à utiliser avec précaution)
async function clearAllScoresAPI() {
    if (!confirm("⚠️ ATTENTION ⚠️\nVoulez-vous vraiment supprimer TOUS les scores de l'API ?\n\nCette action est irréversible !")) {
        return;
    }
    
    try {
        const scores = await getAllScores();
        let deletedCount = 0;
        
        for (const score of scores) {
            const deleteResponse = await fetch(`${API_BASE_URL}/${score.id}`, {
                method: "DELETE",
            });
            if (deleteResponse.ok) {
                deletedCount++;
            }
        }
        
        alert(`✅ ${deletedCount} scores supprimés de l'API`);
        await displayScores();
    } catch (error) {
        console.error("❌ Erreur lors de la suppression:", error);
        alert("❌ Erreur lors de la suppression");
    }
}

// Rafraîchir les scores toutes les 30 secondes
setInterval(() => {
    displayScores();
}, 30000);

// Ajouter les styles CSS
const style = document.createElement('style');
style.textContent = `
    .score-entry {
        display: flex;
        align-items: center;
        padding: 12px;
        margin: 8px 0;
        border-radius: 10px;
        background: #f8f9fa;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .score-entry:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .first-place {
        background: linear-gradient(135deg, #ffd700, #ffed4a);
        border-color: #ffd700;
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    .second-place {
        background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
        border-color: #c0c0c0;
    }
    
    .third-place {
        background: linear-gradient(135deg, #cd7f32, #daa520);
        border-color: #cd7f32;
    }
    
    .other-place {
        background: #f0f0f0;
    }
    
    @keyframes glow {
        from { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        to { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
    }
    
    .score-position {
        font-size: 1.5em;
        font-weight: bold;
        margin-right: 15px;
        min-width: 40px;
        text-align: center;
    }
    
    .score-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
        border: 2px solid #ddd;
    }
    
    .score-info {
        flex: 1;
    }
    
    .score-username {
        font-weight: bold;
        font-size: 1.1em;
        color: #333;
    }
    
    .score-details {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        margin-top: 4px;
    }
    
    .score-points {
        color: #2196F3;
        font-weight: bold;
    }
    
    .score-trophy {
        background: #333;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85em;
    }
    
    .score-date {
        color: #666;
        font-size: 0.85em;
    }
    
    .no-scores, .error {
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
    }
    
    .error {
        color: #d32f2f;
    }
    
    @media (max-width: 600px) {
        .score-details {
            flex-direction: column;
            gap: 5px;
        }
        
        .score-entry {
            padding: 10px;
        }
        
        .score-avatar {
            width: 35px;
            height: 35px;
        }
    }
`;
document.head.appendChild(style);

// Console pour les développeurs
console.log("🎮 ClickFast chargé avec succès !");
console.log("📡 Connecté à MockAPI:", API_BASE_URL);
console.log("🛠️ Fonctions disponibles:");
console.log("- clearAllScoresAPI() : Supprimer tous les scores");
console.log("- getAllScores() : Voir tous les scores");
console.log("- displayScores() : Rafraîchir l'affichage");