<?php

namespace App\Http\Controllers;

use App\Exports\UserDataExport;
use App\Models\GameHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class GameController extends Controller
{
    public function startGame(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Initialize game session
        $gameSessionId = Str::uuid()->toString();
        Session::put('game_session_id', $gameSessionId);
        Session::put('user_id', $validatedData['user_id']);

        return response()->json(['game_session_id' => $gameSessionId], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'score' => 'required|integer|min:0',
            'game_session_id' => 'required|uuid',
        ]);

        $storedSessionId = Session::get('game_session_id');
        $storedUserId = Session::get('user_id');

        if ($validatedData['game_session_id'] != $storedSessionId || $validatedData['user_id'] != $storedUserId) {
            return response()->json(['message' => 'Invalid session'], 403);
        }

        // Validate score legitimacy
        if ($validatedData['score'] > 100) {
            return response()->json(['message' => 'Invalid score'], 400);
        }

        $reward = null;
        if ($validatedData['score'] > 5) {
            $reward = $this->determineReward($validatedData['score']);
        }

        GameHistory::create([
            'user_id' => $validatedData['user_id'],
            'score' => $validatedData['score'],
            'reward' => $reward,
        ]);

        return response()->json(['gameHistory' => ['reward' => $reward]], 201);
    }

    private function determineReward($score)
    {
        if ($score <= 10) {
            return 'iPhone';
        } elseif ($score <= 40) {
            return 'Voucher';
        } else {
            return null;
        }
    }

    public function export(Request $request)
    {
        $userId = $request->input('user_id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $filename = 'user_' . $userId . '_game_data.xlsx';

        return Excel::download(new UserDataExport($userId), $filename);
    }

}
