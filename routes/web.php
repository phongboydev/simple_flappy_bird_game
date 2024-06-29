<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::middleware('throttle:60,1')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/game', [GameController::class, 'store']);
    Route::post('/game/start', [GameController::class, 'startGame']);
    Route::post('/game/export', [GameController::class, 'export']);
});

