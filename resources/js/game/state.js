export let currentPlayer = 1;

export function setCurrentPlayer(value) {
    currentPlayer = value;
}

export let player1 = {
    hand: [],
    faceUp: [],
    faceDown: []
};

export let player2 = {
    hand: [],
    faceUp: [],
    faceDown: []
};
export let pile = [];
export let remainingCards = [];

export function getCurrentPlayer() {
    return currentPlayer;
}

export function getCurrentPlayerObject() {
    return currentPlayer === 1 ? player1 : player2;
}
