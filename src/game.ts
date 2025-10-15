export type Player = 'human' | 'computer';
export type MoveType = 'right1' | 'right2' | 'up';

export interface Position {
    row: number;
    col: number;
}

export interface GameState {
    position: Position;
    currentPlayer: Player;
    firstPlayer: Player;
    gameOver: boolean;
    winner: Player | null;
    moveHistory: { player: Player; move: MoveType; from: Position; to: Position }[];
}

export class TokenGame {
    private state: GameState;
    private rowMoveCount: number; // Track moves right in current row

    constructor(firstPlayer: Player) {
        this.state = {
            position: { row: 1, col: 1 },
            currentPlayer: firstPlayer,
            firstPlayer,
            gameOver: false,
            winner: null,
            moveHistory: []
        };
        this.rowMoveCount = 0;
    }

    getState(): GameState {
        return { ...this.state, position: { ...this.state.position } };
    }

    isValidMove(moveType: MoveType): boolean {
        const { row, col } = this.state.position;

        switch (moveType) {
            case 'right1':
                return col + 1 <= 7;
            case 'right2':
                return col + 2 <= 7;
            case 'up':
                return row + 1 <= 7;
            default:
                return false;
        }
    }

    getAvailableMoves(): MoveType[] {
        const moves: MoveType[] = [];
        if (this.isValidMove('right1')) moves.push('right1');
        if (this.isValidMove('right2')) moves.push('right2');
        if (this.isValidMove('up')) moves.push('up');
        return moves;
    }

    makeMove(moveType: MoveType): boolean {
        if (this.state.gameOver || !this.isValidMove(moveType)) {
            return false;
        }

        const from = { ...this.state.position };
        const newPosition = { ...this.state.position };

        switch (moveType) {
            case 'right1':
                newPosition.col += 1;
                this.rowMoveCount += 1;
                break;
            case 'right2':
                newPosition.col += 2;
                this.rowMoveCount += 2;
                break;
            case 'up':
                newPosition.row += 1;
                newPosition.col = 1;
                this.rowMoveCount = 0; // Reset counter when moving up
                break;
        }

        this.state.position = newPosition;
        this.state.moveHistory.push({
            player: this.state.currentPlayer,
            move: moveType,
            from,
            to: newPosition
        });

        // Switch player first
        this.state.currentPlayer = this.state.currentPlayer === 'human' ? 'computer' : 'human';

        // Check if the NEW current player has any moves available
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) {
            this.state.gameOver = true;
            // Current player (who just switched) cannot move, so they lose
            // Winner is the player who just made the move (previous player)
            this.state.winner = this.state.currentPlayer === 'human' ? 'computer' : 'human';
        }

        return true;
    }

    /**
     * Check if a position is a losing position (P-position)
     * P-positions: (1,1), (3,1), (5,1), (7,1), (7,4), (7,7)
     * Pattern: First column of odd rows, and columns {1,4,7} of row 7
     */
    private isLosingPosition(row: number, col: number): boolean {
        // First column of odd rows: (1,1), (3,1), (5,1), (7,1)
        if (col === 1 && row % 2 === 1) return true;
        // Row 7 special columns: (7,4), (7,7)
        if (row === 7 && (col === 4 || col === 7)) return true;
        return false;
    }

    /**
     * Computer plays optimal strategy:
     * Goal: Put opponent in losing positions (P-positions)
     * Strategy:
     * 1. From even rows (2,4,6) at column 7: Move up to put opponent at odd row column 1
     * 2. Within rows: Use 3-k mirroring to force opponent to columns {1, 4, 7}
     * 3. In row 7: Force opponent to columns {1, 4, 7}
     */
    getOptimalComputerMove(): MoveType | null {
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) return null;

        const { row, col } = this.state.position;
        const lastMove = this.state.moveHistory[this.state.moveHistory.length - 1];

        // CRITICAL: If on even rows (2, 4, 6) at column 7, immediately move up
        // This puts opponent at losing positions: (3,1), (5,1), (7,1)
        if (row % 2 === 0 && col === 7 && availableMoves.includes('up')) {
            return 'up';
        }

        // SPECIAL CASE: Row 7 endgame
        if (row === 7) {
            // At (7,3): Move right 1 to reach (7,4), forcing opponent into losing position
            if (col === 3 && availableMoves.includes('right1')) {
                return 'right1';
            }
            // At (7,6): Move right 1 to reach (7,7), opponent cannot move
            if (col === 6 && availableMoves.includes('right1')) {
                return 'right1';
            }
            // At (7,5): Move right 2 to reach (7,7), opponent cannot move
            if (col === 5 && availableMoves.includes('right2')) {
                return 'right2';
            }
            // At (7,2): Move right 2 to reach (7,4), forcing opponent into losing position
            if (col === 2 && availableMoves.includes('right2')) {
                return 'right2';
            }
            // At (7,1) or (7,4): We're in a losing position, make best available move
            if (availableMoves.includes('right1')) return 'right1';
            if (availableMoves.includes('right2')) return 'right2';
        }

        // CORE STRATEGY: 3-k mirroring within rows
        // Segments: 1→4 (3 steps), 4→7 (3 steps)

        // If at column 1 or 4 (start of segment)
        if (col === 1 || col === 4) {
            // If we're at an odd row, column 1 (losing position), move away
            if (this.isLosingPosition(row, col)) {
                // Make a move to avoid staying in losing position
                if (availableMoves.includes('right1')) return 'right1';
            }

            // If human just moved up, they're at (row, 1)
            if (lastMove && lastMove.move === 'up') {
                // We want to mirror and force them back to next losing position
                if (availableMoves.includes('right1')) return 'right1';
            }

            // Otherwise start the segment with right 1
            if (availableMoves.includes('right1')) return 'right1';
        }

        // If at column 7, move up to next row
        if (col === 7) {
            if (availableMoves.includes('up')) return 'up';
        }

        // MIRRORING STRATEGY: If human just moved right by k, move 3-k
        if (lastMove && lastMove.player === 'human') {
            if (lastMove.move === 'right1' && availableMoves.includes('right2')) {
                // Human moved 1, we move 2 (total = 3)
                return 'right2';
            }
            if (lastMove.move === 'right2' && availableMoves.includes('right1')) {
                // Human moved 2, we move 1 (total = 3)
                return 'right1';
            }
        }

        // Default behavior: complete to reach next key column {1, 4, 7}
        // Calculate distance to next key column
        if (col < 4) {
            const remaining = 4 - col;
            if (remaining === 2 && availableMoves.includes('right2')) return 'right2';
            if (remaining >= 1 && availableMoves.includes('right1')) return 'right1';
        } else if (col < 7) {
            const remaining = 7 - col;
            if (remaining === 2 && availableMoves.includes('right2')) return 'right2';
            if (remaining >= 1 && availableMoves.includes('right1')) return 'right1';
        }

        // Fallback with randomization when both moves are available
        const rightMoves = availableMoves.filter(m => m === 'right1' || m === 'right2');
        if (rightMoves.length > 1) {
            // Randomly choose between right1 and right2
            return Math.random() < 0.5 ? 'right1' : 'right2';
        }

        if (availableMoves.includes('right2')) return 'right2';
        if (availableMoves.includes('right1')) return 'right1';
        if (availableMoves.includes('up')) return 'up';

        return availableMoves[0];
    }

    reset(firstPlayer: Player): void {
        this.state = {
            position: { row: 1, col: 1 },
            currentPlayer: firstPlayer,
            firstPlayer,
            gameOver: false,
            winner: null,
            moveHistory: []
        };
        this.rowMoveCount = 0;
    }
}
