<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Card Game') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div id="game-info">
                        <p id="pile-count">Pile: 0 cards</p>
                        <p id="deck-count">Deck: 0 cards</p>
                    </div>

                    <!-- Deck of Cards Section -->
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold">Deck of Cards</h3>
                        <div id="deck-info" class="mt-4">
                            <button onclick="startGame()" class="px-4 py-2 bg-blue-500 text-white rounded">
                                Start Game
                            </button>
                            <div id="deck-data" class="mt-4"></div>
                        </div>

                        <!-- Player 1's Hand -->
                        <div class="mt-6">
                            <h4 class="text-xl">Player 1's Hand</h4>
                            <div id="player1-hand" class="flex space-x-2 mt-4"></div>
                        </div>

                        <!-- Pile Section -->
                        <div class="mt-6">
                            <h4 class="text-xl">Pile</h4>
                            <div id="pile" class="mt-4"></div>
                        </div>

                        <!-- Player 2's Hand -->
                        <div class="mt-6">
                            <h4 class="text-xl">Player 2's Hand</h4>
                            <div id="player2-hand" class="flex space-x-2 mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @vite('resources/js/game/game.js')
</x-app-layout>
