let currentPlayer = 1; // Player 1 starts

// Start the game
function startGame() {
    remainingCards = generateDeck();
    shuffleDeck(remainingCards);

    player1 = { hand: [], faceUp: [], faceDown: [] };
    player2 = { hand: [], faceUp: [], faceDown: [] };
    pile = []; 

    dealCards();
    currentPlayer = determineStartingPlayer(); 

    displayGame();
    updateTurnDisplay();
    enablePilePickup(); //Ensure pile pickup works
}

// Determines which player has the lowest card
function determineStartingPlayer() {
    // Find the lowest card, ignoring "6" cards
    let p1Lowest = player1.hand.filter(card => card.value !== '6').map(card => getCardValue(card.value));
    let p2Lowest = player2.hand.filter(card => card.value !== '6').map(card => getCardValue(card.value));

    p1Lowest = p1Lowest.length > 0 ? Math.min(...p1Lowest) : Infinity;
    p2Lowest = p2Lowest.length > 0 ? Math.min(...p2Lowest) : Infinity;

    return p1Lowest <= p2Lowest ? 1 : 2;
}

// Convert face values (J, Q, K, A) into numerical values for comparison
function getCardValue(value) {
    if (!value) return Infinity; // Prevents errors if value is undefined
    if (value === 'J') return 11;
    if (value === 'Q') return 12;
    if (value === 'K') return 13;
    if (value === 'A') return 14;
    return parseInt(value) || Infinity; // Convert number strings into actual numbers, default to Infinity if error
}

// Display a player's cards
function displayPlayer(playerNum, player) {
    document.getElementById(`player${playerNum}-hand`).innerHTML = `
        <h3>Player ${playerNum}</h3>
        <div class="hand flex flex-col space-y-2">
            ${player.hand.map((card, index) => {
                return `
                    <div class="card-container">
                        <img src="${card.image}" 
                             alt="${card.code}" 
                             class="card hover:scale-110 transition-transform cursor-pointer" 
                             onclick="playCard(${playerNum}, ${index})">
                    </div>
                `;
            }).join('')}
        </div>
        <h4>Face-up Cards</h4>
        <div class="face-up flex flex-col space-y-2">
            ${player.faceUp.map(cardHTML).join('')}
        </div>
        <h4>Face-down Cards</h4>
        ${player.faceDown.map(() => '<img src="https://deckofcardsapi.com/static/img/back.png" class="w-12 h-auto">').join('')}
    `;
}

// Generate a standard 52-card deck
function generateDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];

    for (let suit of suits) {
        for (let value of values) {
            const code = value === "10" ? `0${suit[0]}` : `${value[0]}${suit[0]}`;
            const image = `https://deckofcardsapi.com/static/img/${code}.png`;

            deck.push({ value, suit, code, image });
        }
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal cards to both players (3 face-down, 3 face-up, 3 hand)
function dealCards() {
    for (let i = 0; i < 3; i++) {
        player1.faceDown.push(remainingCards.pop());
        player2.faceDown.push(remainingCards.pop());

        player1.faceUp.push(remainingCards.pop());
        player2.faceUp.push(remainingCards.pop());

        player1.hand.push(remainingCards.pop());
        player2.hand.push(remainingCards.pop());
    }
}

// Display the game state
function displayGame() {
    displayPlayer(1, player1);
    displayPlayer(2, player2);
    displayPile();
}

// Generate HTML for a card
function cardHTML(card) {
    return `<img src="${card.image}" alt="${card.code}" class="w-12 h-auto">`;
}

function hasValidCardToPlay(player = getCurrentPlayer()) {
    if (pile.length === 0) return true; // Any card can be played if the pile is empty

    // Allow playing any card on top of a 6
    if (pile[pile.length - 1].value === '6') {
        return true; // Any card can be played when the pile has a "6"
    }

    return player.hand.some(card => getCardValue(card.value) >= getCardValue(pile[pile.length - 1].value));
}

// Display the pile (top card)
function displayPile() {
    const pileContainer = document.getElementById('pile');
    pileContainer.innerHTML = '';

    if (pile.length > 0) {
        const card = pile[pile.length - 1];
        pileContainer.innerHTML = `<img src="${card.image}" alt="${card.code}" class="w-24 h-auto">`;

        // Enable pile pick up only if the current player has no valid cards
        if (!hasValidCardToPlay(getCurrentPlayer())) {
            pileContainer.classList.add("cursor-pointer"); // Make pile clickable
        } else {
            pileContainer.classList.remove("cursor-pointer"); // Remove clickability
        }
    }
}

// Play a card from a player's hand
function playCard(playerNumber, cardIndex) {
    if (currentPlayer !== playerNumber) {
        alert("It's not your turn!");
        return;
    }

    let player = playerNumber === 1 ? player1 : player2;
    if (!player || !player.hand || player.hand.length === 0) {
        alert(`Player ${playerNumber} has no cards left to play!`);
        return;
    }

    let selectedCard = player.hand[cardIndex];
    if (!selectedCard) {
        alert("Invalid card selection!");
        return;
    }

    let topCard = pile.length > 0 ? pile[pile.length - 1] : null;
    let topCardValue = topCard ? getCardValue(topCard.value) : 0;
    let selectedCardValue = getCardValue(selectedCard.value);

    let identicalCards = player.hand.filter(card => card.value === selectedCard.value);

    // ✅ Special Card 6 - Always allowed
    if (selectedCard.value === '6') {
        player.hand.splice(cardIndex, 1);
        pile.push(selectedCard);
        if (remainingCards.length > 0) drawCard(playerNumber);

        updateGameState();
        switchTurn();
        return;
    }

    // ✅ Special Card 10 - Clears the pile and lets the player continue
    if (selectedCard.value === '10') {
        // Only clear the pile if there is already a pile
        if (pile.length > 0) {
            player.hand.splice(cardIndex, 1);
            pile = []; // Clears the pile
            alert(`Player ${playerNumber} played a 10! The pile is cleared.`);
        } else {
            // If the pile is empty, just place the 10 like a normal card
            player.hand.splice(cardIndex, 1);
            pile.push(selectedCard);
        }

        if (remainingCards.length > 0) drawCard(playerNumber);

        updateGameState();
        // Player gets another turn instead of switching
        return;
    }

    // ✅ Allow playing multiple identical cards before checking for higher ones
    if (identicalCards.length > 1) {
        let playAll = confirm(`You have multiple "${selectedCard.value}" cards. Play all at once?`);
        if (playAll) {
            handleMultipleCards(playerNumber, identicalCards.map(card => card.value));
            return;
        }
    }

    // ✅ Allow playing lower cards if the top card is a "6"
    if (topCard && topCard.value === '6') {
        player.hand.splice(cardIndex, 1);
        pile.push(selectedCard);
        if (remainingCards.length > 0 && player.hand.length < 3) drawCard(playerNumber);

        updateGameState();
        switchTurn();
        return;
    }

    // ✅ Check for a higher card **ONLY IF** the player is trying to play a lower card
    let hasHigherCard = player.hand.some(card => getCardValue(card.value) > topCardValue);
    if (hasHigherCard && selectedCardValue < topCardValue) {
        alert("You have a higher value card to play!");
        return;
    }

    // ✅ Normal card placement logic
    if (pile.length === 0 || selectedCardValue >= topCardValue) {
        player.hand.splice(cardIndex, 1);
        pile.push(selectedCard);
        if (remainingCards.length > 0 && player.hand.length < 3) drawCard(playerNumber);

        if (player.hand.length === 0 && player.faceUp.length > 0) {
            player.hand = player.faceUp;
            player.faceUp = [];
        }

        if (player.hand.length === 0 && player.faceDown.length > 0) {
            alert(`Player ${playerNumber} is now playing blind cards!`);
        }

        updateGameState();
        switchTurn();
    } else {
        alert("You cannot play that card! You must pick up the pile!");
    }
}

// Function to find identical cards in hand
function getIdenticalCards(player) {
    let cardCount = {}; // Count occurrences of card values
    let identicalCards = [];

    // Count occurrences of each card's value
    player.hand.forEach(card => {
        cardCount[card.value] = (cardCount[card.value] || 0) + 1;
    });

    // Collect cards that appear more than once
    for (let value in cardCount) {
        if (cardCount[value] > 1) {
            identicalCards.push(...player.hand.filter(card => card.value === value)); // Add identical cards
        }
    }
    return identicalCards;
}

function handleMultipleCards(playerNumber, identicalCardValues) {
    let player = playerNumber === 1 ? player1 : player2;
    let identicalCards = player.hand.filter(card => card && identicalCardValues.includes(card.value));

    // Check if all selected cards are valid to play (must be greater than the top card in the pile)
    let valid = pile.length === 0 || identicalCards.every(card => 
        getCardValue(card.value) >= getCardValue(pile[pile.length - 1]?.value || 0)
    );

    if (valid) {
        // Remove the cards from the player's hand
        identicalCards.forEach(card => {
            let index = player.hand.indexOf(card);
            if (index > -1) {
                player.hand.splice(index, 1); // Remove the card from hand
            }
        });

        // Add the cards to the pile
        pile.push(...identicalCards);

        // Only draw cards if valid cards were played (one draw per turn)
        drawCard(playerNumber, identicalCards.length); // Draw the correct number of cards

        // Handle transition from face-up to face-down cards
        if (player.hand.length === 0 && player.faceUp.length > 0) {
            player.hand = player.faceUp;
            player.faceUp = [];
        }

        if (player.hand.length === 0 && player.faceDown.length > 0) {
            alert(`Player ${playerNumber} is now playing blind cards!`);
        }

        updateGameState();
        // Switch to the next player after the cards are placed
        switchTurn();
    } else {
        // If the cards are not valid, display a message
        alert("You cannot play those cards! You must play higher cards.");
    }
}

// Switch to the next player's turn
function switchTurn() {
    // Toggle between player 1 and player 2
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    // Optionally, update UI to reflect the current player's turn
    updateTurnDisplay();
}

// Update the UI to show whose turn it is
function updateTurnDisplay() {
    const turnDisplay = document.getElementById("turn-display");
    if (turnDisplay) {
        turnDisplay.innerText = `Player ${currentPlayer}'s Turn`;
    }
}

// Function to check if a player has valid cards to play
function hasValidCardToPlay(player = getCurrentPlayer()) {
    if (pile.length === 0) return true; // Any card can be played if the pile is empty

    return player.hand.some(card => getCardValue(card.value) >= getCardValue(pile[pile.length - 1].value));
}

// Draw a card for the player
function drawCard(playerNumber, numCards = 1) {
    let player = playerNumber === 1 ? player1 : player2;

    if (!player || !player.hand) {
        console.error(`Player ${playerNumber} does not have a valid hand!`);
        return;
    }

    // Only draw a card if the player has fewer than 3 cards in hand
    if (player.hand.length + numCards > 3) {
        numCards = 3 - player.hand.length; // Limit the number of cards to be drawn
    }

    // Draw cards from the deck if the player has fewer than 3 cards
    if (remainingCards.length > 0) {
        for (let i = 0; i < numCards; i++) {
            let newCard = remainingCards.pop(); // Take a card from the deck
            player.hand.push(newCard); // Add the card to the player's hand
            console.log(`Player ${playerNumber} draws a card. New hand size: ${player.hand.length}`);
        }
    }

    updateGameState(); // Refresh the UI
}

function updateGameState() {
    const player1Hand = document.getElementById("player1-hand");
    const player2Hand = document.getElementById("player2-hand");
    const pileCount = document.getElementById("pile-count");
    const deckCount = document.getElementById("deck-count");

    if (!player1Hand || !player2Hand || !pileCount || !deckCount) {
        console.error("One or more elements not found in the DOM!");
        return;
    }

    displayGame();
    pileCount.innerText = `Pile: ${pile.length} cards`;
    deckCount.innerText = `Deck: ${remainingCards.length} cards`;
}

// Enable picking up the pile when a player can't play any card
function enablePilePickup() {
    const pileContainer = document.getElementById('pile');
    pileContainer.addEventListener('click', function () {
        let player = getCurrentPlayer();
        if (!hasValidCardToPlay(player)) {
            pickUpPile(player);
        }
    });
}

// Pick up the pile
function pickUpPile(player = getCurrentPlayer()) {
    if (!player || !player.hand) {
        alert("Invalid player!");
        return;
    }

    if (!pile || pile.length === 0) {
        alert("There is no pile to pick up.");
        return;
    }

    // Add all pile cards to the player's hand
    player.hand.push(...pile);  // ✅ This was throwing the error
    pile = []; // Clear the pile
    updateGameState();
    switchTurn(); // Move to the next player's turn
}

// Function to get the current player object based on `currentPlayer`
function getCurrentPlayer() {
    return currentPlayer === 1 ? player1 : player2;
}

// Reset the game
function resetGame() {
    startGame();
}