
// Simple Flappy Bird game implementation
let canvas, ctx, bird, birdY, birdVelocity, gameInterval, pillars;

function startGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    bird = new Image();
    bird.src = 'https://upload.wikimedia.org/wikipedia/vi/0/0a/Flappy_Bird_icon.png'; // Add path to bird image
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pillars = [];
    gameInterval = setInterval(updateGame, 20);

    canvas.addEventListener('click', () => {
        birdVelocity = -8;
    });
}

function updateGame() {
    console.log(123455)
    birdVelocity += 0.5;
    birdY += birdVelocity;

    if (birdY > canvas.height || birdY < 0) {
        endGame();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bird, 50, birdY);

    // Update and draw pillars
    if (Math.random() < 0.01) {
        let gapY = Math.random() * (canvas.height - 200) + 100;
        pillars.push({ x: canvas.width, y: gapY });
    }
    console.log("end game")
    for (let i = pillars.length - 1; i >= 0; i--) {
        pillars[i].x -= 5;
        if (pillars[i].x < -50) {
            pillars.splice(i, 1);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(pillars[i].x, 0, 50, pillars[i].y - 100);
            ctx.fillRect(pillars[i].x, pillars[i].y + 100, 50, canvas.height - pillars[i].y - 100);

            if (pillars[i].x < 100 && pillars[i].x > 50 && (birdY < pillars[i].y - 100 || birdY > pillars[i].y + 100)) {
                endGame();
            }
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    let score = Math.floor(pillars.length / 2);
    console.log(1243)
    submitGameScore(score);
}
