<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class CardGameController extends Controller
{
    // Create a new deck
    public function newDeck()
    {
        $response = Http::get('https://deckofcardsapi.com/api/deck/new/');
        $deck = $response->json(); // Get the JSON response as an array
        
        return $deck; // Return the deck details
    }

    // Draw cards from the deck
    public function drawCards($deck_id, $count = 5)
    {
        // Shuffle the deck first
        $shuffleUrl = "https://deckofcardsapi.com/api/deck/{$deck_id}/shuffle/";
        Http::get($shuffleUrl);

        // Then draw the cards
        $drawUrl = "https://deckofcardsapi.com/api/deck/{$deck_id}/draw/?count={$count}";
        $response = Http::get($drawUrl);

        return $response->json(); // Return the drawn cards
    }

    // Shuffle the deck
    public function shuffleDeck($deck_id)
    {
        $url = "https://deckofcardsapi.com/api/deck/{$deck_id}/shuffle/";
        $response = Http::get($url);
        $shuffled = $response->json(); // Get the shuffle response

        return $shuffled; // Return the shuffle confirmation
    }
}
