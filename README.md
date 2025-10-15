# 7×7 Token Board Game

Browser-based game where you play against an AI opponent using optimal game theory strategy.

## Game Rules

- The board is a **7×7 grid**
- A token starts at the **bottom-left cell** (row 1, column 1)
- Two players (You and Computer) take turns
- On your turn, you can make one move:
  - **Move Right:** Move 1 or 2 steps to the right (staying in same row)
  - **Move Up:** Move 1 row up and reset to column 1
- The player who **cannot move** (token is at row 7, column 7) **loses**

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## How to Play

1. Choose who goes first (You or Computer)
2. Click the move buttons to make your move
3. Watch the computer respond with its optimal strategy
4. Try to force the computer into a losing position!

## Computer Strategy

The computer plays optimally using the following strategy:

- Forces the opponent to be the first mover at each new row
- Mirrors rightward moves to maintain control (when opponent moves right by k, responds with 3-k)
- Ensures the opponent is always forced to start rows at column 1
- This strategy guarantees a win for the second player if played perfectly

## Technologies Used

- **TypeScript** - Type-safe game logic
- **Tailwind CSS** - Beautiful pine green and white styling
- **Vite** - Fast development and build tool

## Project Structure

```
├── index.html          # Main HTML file
├── src/
│   ├── main.ts        # Entry point
│   ├── game.ts        # Game logic and rules
│   └── ui.ts          # UI rendering and interaction
├── package.json
├── tsconfig.json
└── README.md
```

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.
