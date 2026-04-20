import {
    startGame,
    playCard,
    resetGame
} from './actions.js';

import { enablePilePickup } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    enablePilePickup();
});

window.playCard = playCard;
window.resetGame = resetGame;
window.startGame = startGame;
