import { TokenGame, GameState, MoveType, Player } from './game';

export class GameUI {
    private game: TokenGame | null = null;
    private container: HTMLElement;
    private onComputerMove?: () => void;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    init(): void {
        this.renderStartScreen();
    }

    private renderStartScreen(): void {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto p-8">
                <div class="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pine-500">
                    <h1 class="text-4xl font-bold text-pine-800 mb-6 text-center">
                        7×7 Token Board Game
                    </h1>

                    <div class="bg-pine-50 rounded-lg p-6 mb-6 border-2 border-pine-200">
                        <h2 class="text-2xl font-semibold text-pine-700 mb-4">Game Rules</h2>
                        <ul class="space-y-2 text-pine-900">
                            <li class="flex items-start">
                                <span class="text-pine-500 mr-2">•</span>
                                <span>The board is a <strong>7×7 grid</strong>.</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-pine-500 mr-2">•</span>
                                <span>A token starts at the <strong>bottom-left cell</strong> (row 1, column 1).</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-pine-500 mr-2">•</span>
                                <span>Two players (You and Computer) take turns.</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-pine-500 mr-2">•</span>
                                <span>On your turn, you can make one move:</span>
                            </li>
                            <li class="ml-6 flex items-start">
                                <span class="text-pine-500 mr-2">◦</span>
                                <span><strong>Move Right:</strong> Move 1 or 2 steps to the right (staying in same row).</span>
                            </li>
                            <li class="ml-6 flex items-start">
                                <span class="text-pine-500 mr-2">◦</span>
                                <span><strong>Move Up:</strong> Move 1 row up and reset to column 1.</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-pine-500 mr-2">•</span>
                                <span>The player who <strong>cannot move</strong> (token is at top row, rightmost column) <strong>loses</strong>.</span>
                            </li>
                        </ul>
                    </div>

                    <div class="text-center">
                        <h3 class="text-xl font-semibold text-pine-700 mb-4">Who plays first?</h3>
                        <div class="flex gap-4 justify-center">
                            <button id="human-first"
                                class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105">
                                You Go First
                            </button>
                            <button id="computer-first"
                                class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105">
                                Computer Goes First
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('human-first')?.addEventListener('click', () => {
            this.startGame('human');
        });

        document.getElementById('computer-first')?.addEventListener('click', () => {
            this.startGame('computer');
        });
    }

    private startGame(firstPlayer: Player): void {
        this.game = new TokenGame(firstPlayer);
        this.render();

        // If computer goes first, make its move after a short delay
        if (firstPlayer === 'computer') {
            setTimeout(() => this.makeComputerMove(), 800);
        }
    }

    private render(): void {
        if (!this.game) return;

        const state = this.game.getState();
        const availableMoves = this.game.getAvailableMoves();

        this.container.innerHTML = `
            <div class="max-w-5xl mx-auto p-8">
                <div class="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pine-500">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-3xl font-bold text-pine-800">7×7 Token Game</h1>
                        <button id="restart-btn"
                            class="bg-pine-100 hover:bg-pine-200 text-pine-800 font-semibold py-2 px-4 rounded-lg border-2 border-pine-500 transition-all">
                            Restart Game
                        </button>
                    </div>

                    ${this.renderStatusBar(state)}
                    ${this.renderBoard(state)}
                    ${!state.gameOver ? this.renderControls(state, availableMoves) : this.renderGameOver(state)}
                </div>
            </div>
        `;

        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.renderStartScreen();
        });

        // Add event listeners for move buttons
        if (!state.gameOver && state.currentPlayer === 'human') {
            availableMoves.forEach(move => {
                document.getElementById(`move-${move}`)?.addEventListener('click', () => {
                    this.makeHumanMove(move);
                });
            });
        }
    }

    private renderStatusBar(state: GameState): string {
        const currentPlayerText = state.currentPlayer === 'human' ? 'Your Turn' : 'Computer\'s Turn';
        const currentPlayerColor = state.currentPlayer === 'human' ? 'bg-pine-600' : 'bg-pine-400';

        return `
            <div class="mb-6 p-4 rounded-lg ${currentPlayerColor} text-white">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xl font-bold">${currentPlayerText}</p>
                        <p class="text-sm opacity-90">Position: Row ${state.position.row}, Column ${state.position.col}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm opacity-90">First Player: ${state.firstPlayer === 'human' ? 'You' : 'Computer'}</p>
                        <p class="text-sm opacity-90">Moves Made: ${state.moveHistory.length}</p>
                    </div>
                </div>
            </div>
        `;
    }

    private renderBoard(state: GameState): string {
        let boardHTML = '<div class="mb-6 overflow-x-auto">';
        boardHTML += '<div class="inline-block min-w-full">';

        // Render from row 7 to row 1 (top to bottom)
        for (let row = 7; row >= 1; row--) {
            boardHTML += '<div class="flex items-center mb-2">';
            boardHTML += `<span class="text-pine-700 font-bold w-16 text-center">Row ${row}</span>`;

            for (let col = 1; col <= 7; col++) {
                const isTokenHere = state.position.row === row && state.position.col === col;
                const cellClass = isTokenHere
                    ? 'bg-pine-600 border-pine-800'
                    : 'bg-white border-pine-300';

                boardHTML += `
                    <div class="w-16 h-16 border-2 ${cellClass} flex items-center justify-center m-1 rounded-lg shadow-sm transition-all">
                        ${isTokenHere ? '<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-pine-700">●</div>' : ''}
                    </div>
                `;
            }

            boardHTML += '</div>';
        }

        // Column labels
        boardHTML += '<div class="flex items-center mt-2">';
        boardHTML += '<span class="w-16"></span>';
        for (let col = 1; col <= 7; col++) {
            boardHTML += `<div class="w-16 text-center m-1 text-pine-700 font-bold">${col}</div>`;
        }
        boardHTML += '</div>';

        boardHTML += '</div></div>';
        return boardHTML;
    }

    private renderControls(state: GameState, availableMoves: MoveType[]): string {
        if (state.currentPlayer === 'computer') {
            return `
                <div class="text-center p-4 bg-pine-100 rounded-lg">
                    <p class="text-lg text-pine-800">Computer is thinking...</p>
                </div>
            `;
        }

        return `
            <div class="bg-pine-50 rounded-lg p-6 border-2 border-pine-200">
                <h3 class="text-xl font-semibold text-pine-800 mb-4">Your Move</h3>
                <div class="flex gap-4 justify-center flex-wrap">
                    ${availableMoves.includes('right1') ? `
                        <button id="move-right1"
                            class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">
                            Move Right 1 →
                        </button>
                    ` : ''}
                    ${availableMoves.includes('right2') ? `
                        <button id="move-right2"
                            class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">
                            Move Right 2 →→
                        </button>
                    ` : ''}
                    ${availableMoves.includes('up') ? `
                        <button id="move-up"
                            class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">
                            Move Up ↑
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    private renderGameOver(state: GameState): string {
        const winnerText = state.winner === 'human' ? 'You Win!' : 'Computer Wins!';
        const winnerColor = state.winner === 'human' ? 'text-pine-700' : 'text-pine-500';
        const explanation = state.winner === 'human'
            ? 'The computer had no valid moves left!'
            : 'You had no valid moves left!';

        return `
            <div class="bg-pine-100 rounded-lg p-8 border-4 border-pine-500 text-center">
                <h2 class="text-4xl font-bold ${winnerColor} mb-4">${winnerText}</h2>
                <p class="text-xl text-pine-800 mb-6">${explanation}</p>
                <button id="play-again"
                    class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105">
                    Play Again
                </button>
            </div>
        `;
    }

    private makeHumanMove(move: MoveType): void {
        if (!this.game) return;

        const success = this.game.makeMove(move);
        if (success) {
            this.render();

            // If game is not over and it's computer's turn, make computer move
            const state = this.game.getState();
            if (!state.gameOver && state.currentPlayer === 'computer') {
                setTimeout(() => this.makeComputerMove(), 800);
            }
        }
    }

    private makeComputerMove(): void {
        if (!this.game) return;

        const move = this.game.getOptimalComputerMove();
        if (move) {
            this.game.makeMove(move);
            this.render();
        }
    }
}
