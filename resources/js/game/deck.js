import { player1, player2, remainingCards } from "./state.js";

export function generateDeck() {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];

    let deck = [];

    for (let suit of suits) {
        for (let value of values) {
            const code =
                value === "10" ? `0${suit[0]}` : `${value[0]}${suit[0]}`;
            const image = `https://deckofcardsapi.com/static/img/${code}.png`;

            deck.push({ value, suit, code, image });
        }
    }

    return deck;
}

export function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

export function dealCards() {
    for (let i = 0; i < 3; i++) {
        player1.faceDown.push(remainingCards.pop());
        player2.faceDown.push(remainingCards.pop());

        player1.faceUp.push(remainingCards.pop());
        player2.faceUp.push(remainingCards.pop());

        player1.hand.push(remainingCards.pop());
        player2.hand.push(remainingCards.pop());
    }
}
