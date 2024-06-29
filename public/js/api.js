document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !phone) {
            alert('Name and phone are required');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ name, email, phone })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userId', data.user.id);
                startGameSession(data.user.id);
            } else {
                alert('Registration failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

});

async function startGameSession(userId) {
    try {
        const response = await fetch('/game/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('gameSessionId', data.game_session_id);
            document.getElementById('registration-form').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            startGame();
        } else {
            alert('Failed to start game session: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function submitGameScore(score) {
    const userId = localStorage.getItem('userId');
    const gameSessionId = localStorage.getItem('gameSessionId');
    if (!userId || !gameSessionId) return;

    try {
        const response = await fetch('/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ user_id: userId, score, game_session_id: gameSessionId })
        });
        const data = await response.json();
        if (response.ok) {
            displayNotification(score, data.gameHistory.reward);
        } else {
            alert('Failed to submit score: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayNotification(score, reward) {
    const notification = document.getElementById('notification');
    let message = `Your score: ${score}.`;
    if (reward) {
        message += ` You won a ${reward}!`;
    } else if (score > 5) {
        message += ` No reward this time, try again!`;
    } else {
        message += ` Keep trying to score more points!`;
    }
    notification.innerText = message;
    notification.style.display = 'block';
    document.getElementById('playAgainBtn').style.display = 'block';
    document.getElementById('exportDataBtn').style.display = 'block';
}

function resetGame() {
    document.getElementById('notification').style.display = 'none';
    document.getElementById('playAgainBtn').style.display = 'none';
    document.getElementById('exportDataBtn').style.display = 'none';
    startGameSession(localStorage.getItem('userId'));
}

async function exportData() {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetch('/game/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ user_id: userId })
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `user_${userId}_game_data.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            const data = await response.json();
            alert('Failed to export data: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


document.getElementById('playAgainBtn').addEventListener('click', resetGame);
document.getElementById('exportDataBtn').addEventListener('click', exportData);

window.startGame = function() { /* startGame implementation here */ };