let score = 0;
        let countdown = 10;
        let interval;
        let rotation = 0;
        let decorStarted = false;
        const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan", "lime", "teal", "brown", "magenta", "violet", "gold", "gray"];

        function startTimer() {
            interval = setInterval(() => {
                countdown--;
                document.getElementById("countdown").innerText = countdown;
                if (countdown <= 0) {
                    clearInterval(interval);
                    alert("Temps écoulé !");
                }
            }, 1000);
        }

        function createDecorSquares() {
            for (let i = 0; i < 15; i++) {
                let square = document.createElement("div");
                square.className = "decor-square";
                square.style.top = `${Math.random() * window.innerHeight}px`;
                square.style.left = `${Math.random() * window.innerWidth}px`;
                square.style.backgroundColor = colors[i]; // Couleurs différentes
                document.body.appendChild(square);
            }
        }

        document.getElementById("clickBtn").addEventListener("click", () => {
            score++;
            rotation += 360;
            document.getElementById("score").innerText = score;
            document.getElementById("clickBtn").style.transform = `rotate(${rotation}deg)`;

            if (!decorStarted) {
                createDecorSquares();
                decorStarted = true;
            }
        });

        document.getElementById("resetBtn").addEventListener("click", () => {
            score = 0;
            countdown = 10;
            rotation = 0;
            document.getElementById("score").innerText = score;
            document.getElementById("countdown").innerText = countdown;
            document.getElementById("clickBtn").style.transform = `rotate(${rotation}deg)`;
            clearInterval(interval);
            startTimer();
        });

        startTimer();