import {
    player1,
    player2,
    pile,
    currentPlayer,
    remainingCards,
    getCurrentPlayer,
} from "./state.js";
import { pickUpPile } from "./actions.js";
import { cardHTML } from "./utils.js";

export function displayPlayer(playerNum, player) {
    const canPlayFaceDown =
        player.hand.length === 0 && player.faceUp.length === 0;

    document.getElementById(`player${playerNum}-hand`).innerHTML = `
        <h3>Player ${playerNum}</h3>

        <!-- HAND -->
        <div class="hand flex flex-col space-y-2">
            ${player.hand
                .filter(Boolean)
                .map((card, index) => {
                    return `
                    <div class="card-container">
                        <img src="${card.image}" 
                             alt="${card.code}" 
                             class="card hover:scale-110 transition-transform cursor-pointer" 
                             onclick="playCard(${playerNum}, ${index})">
                    </div>
                `;
                })
                .join("")}
        </div>

        <!-- FACE UP -->
        <h4>Face-up Cards</h4>
        <div class="face-up flex flex-col space-y-2">
            ${player.faceUp.map(cardHTML).join("")}
        </div>

        <!-- FACE DOWN -->
        <h4>Face-down Cards</h4>
        <div class="face-down flex flex-col space-y-2">
            ${player.faceDown
                .map(
                    (_, index) => `
                        <img src="https://deckofcardsapi.com/static/img/back.png"
                             class="w-12 h-auto ${
                                 canPlayFaceDown
                                     ? "cursor-pointer"
                                     : "opacity-50"
                             }"
                             ${
                                 canPlayFaceDown
                                     ? `onclick="playCard(${playerNum}, ${index})"`
                                     : ""
                             }>
                    `,
                )
                .join("")}
        </div>
    `;
}

export function updatePlayers() {
    displayPlayer(1, player1);
    displayPlayer(2, player2);
}

export function updatePileUI() {
    displayPile();
}

export function updateHUD() {
    updateTurnDisplay();

    document.getElementById("pile-count").innerText =
        `Pile: ${pile.length} cards`;

    document.getElementById("deck-count").innerText =
        `Deck: ${remainingCards.length} cards`;
}

export function displayPile() {
    const pileContainer = document.getElementById("pile");
    pileContainer.innerHTML = "";

    if (pile.length > 0) {
        const card = pile[pile.length - 1];

        pileContainer.innerHTML = `
            <img src="${card.image}" 
                 alt="${card.code}" 
                 class="w-24 h-auto">
        `;

        pileContainer.classList.add("cursor-pointer");
    } else {
        pileContainer.classList.remove("cursor-pointer");
    }
}

export function updateTurnDisplay() {
    const turnDisplay = document.getElementById("turn-display");
    if (turnDisplay) {
        turnDisplay.innerText = `Player ${currentPlayer}'s Turn`;
    }
}

export function updateGameState() {
    updatePlayers();
    updatePileUI();
    updateHUD();
}

let pileListenerAdded = false;

export function enablePilePickup() {
    if (pileListenerAdded) return;
    pileListenerAdded = true;

    const pileContainer = document.getElementById("pile");
    pileContainer.addEventListener("click", function () {
        if (pile.length === 0) {
            alert("Pile is empty!");
            return;
        }

        let player = getCurrentPlayer();
        pickUpPile(player);
    });
}
