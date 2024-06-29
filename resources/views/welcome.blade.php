<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird Game</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
<div class="container">
    <div id="registration-form" class="form-container">
        <h2>Register</h2>
        <form id="registerForm">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email">

            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" required>

            <button type="submit">Start Game</button>
        </form>
    </div>

    <div id="game-container" class="game-container" style="display: none;">
        <canvas id="gameCanvas"></canvas>
    </div>

    <div id="notification" class="notification" style="display: none;"></div>
    <button id="playAgainBtn" style="display:none;">Play Again</button>
    <button id="exportDataBtn" style="display:none;">Export Data</button>
</div>

<script src="{{ asset('js/api.js') }}"></script>
<script src="{{ asset('js/game.js') }}"></script>
</body>
</html>