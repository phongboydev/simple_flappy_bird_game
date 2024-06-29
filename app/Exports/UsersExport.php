<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\User;

class UsersExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return User::with('gameHistories')->get()->map(function ($user) {
            return [
                'Name' => $user->name,
                'Phone' => $user->phone,
                'Email' => $user->email,
                'Games' => $user->gameHistories->map(function ($game) {
                    return [
                        'Score' => $game->score,
                        'Reward' => $game->reward,
                    ];
                })->toArray(),
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Name',
            'Phone',
            'Email',
            'Games'
        ];
    }
}
