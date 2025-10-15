import { GameUI } from './ui';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    if (!appContainer) {
        console.error('App container not found!');
        return;
    }

    const gameUI = new GameUI(appContainer);
    gameUI.init();
});
