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

        // Check if game is over (no moves available)
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) {
            this.state.gameOver = true;
            // Current player cannot move, so they lose
            this.state.winner = this.state.currentPlayer === 'human' ? 'computer' : 'human';
        } else {
            // Switch player
            this.state.currentPlayer = this.state.currentPlayer === 'human' ? 'computer' : 'human';
        }

        return true;
    }

    /**
     * Computer plays optimal strategy:
     * - Force opponent to be first mover at each new row
     * - When opponent moves right by k, respond with (3-k) if possible
     * - This ensures opponent is always forced to start rows at column 1
     */
    getOptimalComputerMove(): MoveType | null {
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) return null;

        const { row, col } = this.state.position;
        const lastMove = this.state.moveHistory[this.state.moveHistory.length - 1];

        // Strategy: Maintain control by ensuring total rightward moves = 3 before moving up
        // Key insight: columns 1->4 or 4->7 require 3 moves right total
        // After opponent moves, we complete to make total = 3, then move up

        // Calculate position in current row cycle (positions 1-3 or 4-6, with 7 being end)
        const colMod = col <= 3 ? col : col <= 6 ? col - 3 : col - 6;

        // If we're at column 1, 4, or 7 (start of a segment or end)
        if (col === 1 || col === 4 || col === 7) {
            // At column 7, must move up
            if (col === 7) {
                if (availableMoves.includes('up')) {
                    return 'up';
                }
            }

            // At column 1 or 4 (start of segment), move to maintain control
            // If computer is first player, move right by 1 to start the pattern
            if (this.state.firstPlayer === 'computer') {
                if (availableMoves.includes('right1')) return 'right1';
            } else {
                // If human is first player, we should mirror their last move
                if (lastMove && lastMove.player === 'human') {
                    if (lastMove.move === 'right1' && availableMoves.includes('right2')) {
                        return 'right2';
                    }
                    if (lastMove.move === 'right2' && availableMoves.includes('right1')) {
                        return 'right1';
                    }
                }
                // Default: move right 1
                if (availableMoves.includes('right1')) return 'right1';
            }
        }

        // Mirror opponent's last move to complete to 3
        if (lastMove && lastMove.player === 'human') {
            // If human moved right by 1, we move right by 2
            if (lastMove.move === 'right1' && availableMoves.includes('right2')) {
                return 'right2';
            }
            // If human moved right by 2, we move right by 1
            if (lastMove.move === 'right2' && availableMoves.includes('right1')) {
                return 'right1';
            }
            // If human moved up, we should also move up if we're at column 4 or 7
            if (lastMove.move === 'up') {
                // We're now at column 1, start the pattern
                if (availableMoves.includes('right1')) return 'right1';
            }
        }

        // Default: complete the segment
        const remaining = 3 - (this.rowMoveCount % 3);
        if (remaining === 1 && availableMoves.includes('right1')) {
            return 'right1';
        }
        if (remaining === 2 && availableMoves.includes('right2')) {
            return 'right2';
        }

        // Fallback: prefer right2, then right1, then up
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
