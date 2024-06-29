<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UserDataExport implements FromCollection, WithHeadings
{
    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function collection()
    {
        $user = User::with('gameHistories')->find($this->userId);
        if (!$user) {
            return collect([]);
        }

        return collect([
            [
                'Name' => $user->name,
                'Phone' => $user->phone,
                'Email' => $user->email,
                'Games' => $user->gameHistories->map(function ($game) {
                    return [
                        'Score' => $game->score,
                        'Reward' => $game->reward,
                    ];
                })->toArray(),
            ],
        ]);
    }

    public function headings(): array
    {
        return ['Name', 'Phone', 'Email', 'Games'];
    }
}