import { player1, player2, pile, remainingCards } from "./state.js";
import { generateDeck, shuffleDeck, dealCards } from "./deck.js";
import {
    determineStartingPlayer,
    playTenWild,
    playSixWild,
    playFourOfAKind,
    isFourOfAKind,
} from "./rules.js";

import { updateGameState } from "./ui.js";
import { getCardValue } from "./utils.js";
import { setCurrentPlayer, getCurrentPlayer } from "./state.js";

export function startGame() {
    remainingCards.length = 0;
    remainingCards.push(...generateDeck());
    shuffleDeck(remainingCards);

    player1.hand = [];
    player1.faceUp = [];
    player1.faceDown = [];

    player2.hand = [];
    player2.faceUp = [];
    player2.faceDown = [];

    pile.length = 0;

    dealCards();
    setCurrentPlayer(determineStartingPlayer());

    updateGameState();
}

export function playCard(playerNumber, cardIndex) {
    if (getCurrentPlayer() !== playerNumber) {
        alert("It's not your turn!");
        return;
    }

    let player = playerNumber === 1 ? player1 : player2;

    if (
        player.hand.length === 0 &&
        player.faceUp.length === 0 &&
        player.faceDown.length === 0
    ) {
        alert(`Player ${playerNumber} has no cards left!`);
        return;
    }

    let selectedCard = null;
    let source = null;

    if (player.hand[cardIndex]) {
        selectedCard = player.hand[cardIndex];
        source = "hand";
    } else if (player.faceUp[cardIndex]) {
        selectedCard = player.faceUp[cardIndex];
        source = "faceUp";
    } else if (player.faceDown[cardIndex]) {
        selectedCard = player.faceDown[cardIndex];
        source = "faceDown";
    }

    if (!selectedCard) {
        alert("Invalid card selection!");
        return;
    }

    const removeCard = (card) => {
        let index;

        if ((index = player.hand.indexOf(card)) > -1) {
            player.hand.splice(index, 1);
            return;
        }

        if ((index = player.faceUp.indexOf(card)) > -1) {
            player.faceUp.splice(index, 1);
            return;
        }

        if ((index = player.faceDown.indexOf(card)) > -1) {
            player.faceDown.splice(index, 1);
            return;
        }
    };

    // ✅ FIX 3 — REMOVE FIRST if faceDown (blind play rule)
    if (source === "faceDown") {
        removeCard(selectedCard);
    }

    let topCard = pile.length > 0 ? pile[pile.length - 1] : null;
    let topCardValue = topCard ? getCardValue(topCard.value) : 0;
    let selectedCardValue = getCardValue(selectedCard.value);
    const isSixOnTop = topCard?.value === "6";

    // ✅ 10 (wild)
    if (selectedCard.value === "10") {
        if (source !== "hand") removeCard(selectedCard);

        const result = playTenWild(playerNumber, selectedCard);

        if (result?.keepTurn === false) switchTurn();

        updateGameState();
        return;
    }

    // ✅ 6 (wild)
    if (selectedCard.value === "6") {
        if (source !== "hand") removeCard(selectedCard);

        const result = playSixWild(playerNumber, selectedCard);

        if (result?.keepTurn === false) switchTurn();

        updateGameState();
        return;
    }

    // ✅ Four of a kind (only from hand for now)
    if (source === "hand" && isFourOfAKind(player, selectedCard)) {
        let cards = player.hand.filter((c) => c.value === selectedCard.value);

        if (cards.length === 4) {
            const result = playFourOfAKind(playerNumber, cards);

            if (result?.keepTurn === false) switchTurn();

            updateGameState();
            return;
        }
    }

    // ✅ Multiple cards (respect source)
    let sourceArray =
        source === "hand"
            ? player.hand
            : source === "faceUp"
              ? player.faceUp
              : [];

    let identicalCards = sourceArray.filter(
        (card) => card.value === selectedCard.value,
    );

    if (identicalCards.length > 1 && source !== "faceDown") {
        let playAll = confirm(
            `You have multiple "${selectedCard.value}" cards. Play all at once?`,
        );

        if (playAll) {
            handleMultipleCards(
                playerNumber,
                identicalCards.map((card) => card.value),
            );
            return;
        }
    }

    const canPlay =
        pile.length === 0 || isSixOnTop || selectedCardValue >= topCardValue;

    if (canPlay) {
        if (source !== "faceDown") {
            removeCard(selectedCard);
        }

        pile.push(selectedCard);

        if (remainingCards.length > 0 && player.hand.length < 3) {
            drawCard(playerNumber);
        }

        if (player.hand.length === 0 && player.faceUp.length > 0) {
            player.hand = player.faceUp;
            player.faceUp = [];
            alert(`Player ${playerNumber} is now playing face-up cards!`);
        }

        updateGameState();
        switchTurn();
    } else {
        if (source === "faceDown") {
            alert("Invalid blind play! You pick up the pile!");

            player.hand.push(selectedCard, ...pile);
            pile.length = 0;

            updateGameState();
            switchTurn();
        } else {
            alert("You cannot play that card! You must pick up the pile!");
        }
    }
}

export function drawCard(playerNumber, numCards = 1) {
    let player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) {
        console.error(`Player ${playerNumber} does not have a valid hand!`);
        return;
    }

    if (player.hand.length + numCards > 3) {
        numCards = 3 - player.hand.length;
    }

    if (remainingCards.length > 0) {
        for (let i = 0; i < numCards; i++) {
            let newCard = remainingCards.pop();
            player.hand.push(newCard);
        }
    }
}

export function switchTurn() {
    const next = getCurrentPlayer() === 1 ? 2 : 1;
    setCurrentPlayer(next);
}

export function handleMultipleCards(playerNumber, identicalCardValues) {
    let player = playerNumber === 1 ? player1 : player2;

    let identicalCards = player.hand.filter(
        (card) => card && identicalCardValues.includes(card.value),
    );

    const topCard = pile[pile.length - 1];
    const isSixOnTop = topCard?.value === "6";

    const topValue = topCard ? getCardValue(topCard.value) : 0;
    const playValue = getCardValue(identicalCards[0].value);

    let valid =
        pile.length === 0 ||
        isSixOnTop ||
        (identicalCards.every(
            (card) => card.value === identicalCards[0].value,
        ) &&
            playValue >= topValue);

    if (valid) {
        identicalCards.forEach((card) => {
            let index = player.hand.indexOf(card);
            if (index > -1) player.hand.splice(index, 1);
        });

        pile.push(...identicalCards);

        drawCard(playerNumber, identicalCards.length);

        if (player.hand.length === 0 && player.faceUp.length > 0) {
            player.hand = player.faceUp;
            player.faceUp = [];
        }

        updateGameState();
        switchTurn();
    } else {
        alert(
            `You cannot play ${identicalCards[0].value}s on top of ${topCard.value}!`,
        );
    }
}

export function pickUpPile(playerNumber = getCurrentPlayer()) {
    let player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) {
        alert("Invalid player!");
        return;
    }

    if (!pile.length) {
        alert("There is no pile to pick up.");
        return;
    }

    player.hand.push(...pile);
    pile.length = 0;

    updateGameState();
    switchTurn();
}

export function resetGame() {
    startGame();
}
