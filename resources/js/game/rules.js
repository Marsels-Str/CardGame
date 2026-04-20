import { player1, player2, pile, getCurrentPlayer } from './state.js';
import { getCardValue } from './utils.js';
import { remainingCards } from './state.js';
import { drawCard } from './actions.js';
import { updateGameState } from './ui.js';

export function determineStartingPlayer() {
    let p1Lowest = player1.hand.filter(card => card.value !== '6').map(card => getCardValue(card.value));
    let p2Lowest = player2.hand.filter(card => card.value !== '6').map(card => getCardValue(card.value));

    p1Lowest = p1Lowest.length > 0 ? Math.min(...p1Lowest) : Infinity;
    p2Lowest = p2Lowest.length > 0 ? Math.min(...p2Lowest) : Infinity;

    return p1Lowest <= p2Lowest ? 1 : 2;
}

export function hasValidCardToPlay(playerNumber = getCurrentPlayer()) {
    const player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) return false;

    if (pile.length === 0) return true;

    const top = pile[pile.length - 1];
    if (!top) return true;

    if (top.value === '6') return true;

    const topValue = getCardValue(top.value);

    return player.hand.some(card =>
        getCardValue(card.value) >= topValue
    );
}

export function getIdenticalCards(player) {
    let map = new Map();

    player.hand.forEach(card => {
        if (!map.has(card.value)) map.set(card.value, []);
        map.get(card.value).push(card);
    });

    return [...map.values()].filter(group => group.length > 1).flat();
}

export function playTenWild(playerNumber, selectedCard) {
    const player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) return;

    player.hand = player.hand.filter(c => c !== selectedCard);

    pile.length = 0;

    alert(`Player ${playerNumber} played 10! Pile cleared.`);

    if (remainingCards.length > 0) {
        drawCard(playerNumber);
    }

    updateGameState();

    return { keepTurn: true };
}

export function playSixWild(playerNumber, selectedCard) {
    const player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) return;

    player.hand = player.hand.filter(c => c !== selectedCard);
    pile.push(selectedCard);

    if (remainingCards.length > 0 && player.hand.length < 3) {
        drawCard(playerNumber);
    }

    updateGameState();

    return { keepTurn: false };
}

export function playFourOfAKind(playerNumber, cards) {
    const player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) return;

    let value = cards[0].value;

    player.hand = player.hand.filter(c => c.value !== value);

    pile.length = 0;

    alert(`Player ${playerNumber} played FOUR OF A KIND! Pile cleared.`);

    if (remainingCards.length > 0 && player.hand.length < 3) {
        drawCard(playerNumber);
    }

    updateGameState();

    return { keepTurn: true };
}

export function isTen(card) {
    return card?.value === '10';
}

export function isSix(card) {
    return card?.value === '6';
}

export function isFourOfAKind(player, card) {
    if (!player?.hand) return false;

    let count = 0;

    for (let c of player.hand) {
        if (c.value === card.value) count++;
        if (count > 4) return false;
    }

    return count === 4;
}
