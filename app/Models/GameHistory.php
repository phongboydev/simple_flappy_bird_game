<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameHistory extends Model
{
    use HasFactory;

    protected $table = 'game_histories';

    protected $fillable = ['user_id', 'score', 'reward'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
