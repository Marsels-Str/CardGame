<?php

use App\Http\Controllers\CardGameController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route to create a new deck
Route::get('/new-deck', [CardGameController::class, 'newDeck']);

// Route to draw cards
Route::get('/draw-cards/{deck_id}/{count}', [CardGameController::class, 'drawCards']);

// Route to shuffle a deck
Route::get('/shuffle-deck/{deck_id}', [CardGameController::class, 'shuffleDeck']);

require __DIR__.'/auth.php';
