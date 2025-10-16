var c=Object.defineProperty;var h=(o,t,r)=>t in o?c(o,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[t]=r;var l=(o,t,r)=>h(o,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))e(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();class d{constructor(t){l(this,"state");l(this,"rowMoveCount");this.state={position:{row:1,col:1},currentPlayer:t,firstPlayer:t,gameOver:!1,winner:null,moveHistory:[]},this.rowMoveCount=0}getState(){return{...this.state,position:{...this.state.position}}}isValidMove(t){const{row:r,col:e}=this.state.position;switch(t){case"right1":return e+1<=7;case"right2":return e+2<=7;case"up":return r+1<=7;default:return!1}}getAvailableMoves(){const t=[];return this.isValidMove("right1")&&t.push("right1"),this.isValidMove("right2")&&t.push("right2"),this.isValidMove("up")&&t.push("up"),t}makeMove(t){if(this.state.gameOver||!this.isValidMove(t))return!1;const r={...this.state.position},e={...this.state.position};switch(t){case"right1":e.col+=1,this.rowMoveCount+=1;break;case"right2":e.col+=2,this.rowMoveCount+=2;break;case"up":e.row+=1,e.col=1,this.rowMoveCount=0;break}return this.state.position=e,this.state.moveHistory.push({player:this.state.currentPlayer,move:t,from:r,to:e}),this.state.currentPlayer=this.state.currentPlayer==="human"?"computer":"human",this.getAvailableMoves().length===0&&(this.state.gameOver=!0,this.state.winner=this.state.currentPlayer==="human"?"computer":"human"),!0}isLosingPosition(t,r){return r===1&&t%2===1||t===7&&(r===4||r===7)}getOptimalComputerMove(){const t=this.getAvailableMoves();if(t.length===0)return null;const{row:r,col:e}=this.state.position,i=this.state.moveHistory[this.state.moveHistory.length-1];if(r%2===0&&t.includes("up"))return"up";if(r===7){if(e===3&&t.includes("right1")||e===6&&t.includes("right1"))return"right1";if(e===5&&t.includes("right2")||e===2&&t.includes("right2"))return"right2";if(t.filter(a=>a==="right1"||a==="right2").length>1)return Math.random()<.5?"right1":"right2";if(t.includes("right1"))return"right1";if(t.includes("right2"))return"right2"}if(e===1||e===4){if(this.isLosingPosition(r,e)){if(t.filter(u=>u==="right1"||u==="right2").length>1)return Math.random()<.5?"right1":"right2";if(t.includes("right1"))return"right1";if(t.includes("right2"))return"right2"}if(t.filter(a=>a==="right1"||a==="right2").length>1)return Math.random()<.5?"right1":"right2";if(t.includes("right1"))return"right1";if(t.includes("right2"))return"right2"}if(e===7&&t.includes("up"))return"up";if(i&&i.player==="human"){const n=e<4?4:7;if(i.move==="right1"&&t.includes("right2")){if(e+2<=n)return"right2";if(e+1===n)return"right1"}if(i.move==="right2"&&t.includes("right1")&&e+1<=n)return"right1"}if(e<4){const n=4-e;if(n===2&&t.includes("right2"))return"right2";if(n===1&&t.includes("right1")||t.includes("right1"))return"right1"}else if(e<7){const n=7-e;if(n===2&&t.includes("right2"))return"right2";if(n===1&&t.includes("right1")||t.includes("right1"))return"right1"}return t.filter(n=>n==="right1"||n==="right2").length>1?Math.random()<.5?"right1":"right2":t.includes("right2")?"right2":t.includes("right1")?"right1":t.includes("up")?"up":t[0]}reset(t){this.state={position:{row:1,col:1},currentPlayer:t,firstPlayer:t,gameOver:!1,winner:null,moveHistory:[]},this.rowMoveCount=0}}class p{constructor(t){l(this,"game",null);l(this,"container");l(this,"onComputerMove");this.container=t}init(){this.renderStartScreen()}renderStartScreen(){var t,r;this.container.innerHTML=`
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
        `,(t=document.getElementById("human-first"))==null||t.addEventListener("click",()=>{this.startGame("human")}),(r=document.getElementById("computer-first"))==null||r.addEventListener("click",()=>{this.startGame("computer")})}startGame(t){this.game=new d(t),this.render(),t==="computer"&&setTimeout(()=>this.makeComputerMove(),800)}render(){var e,i;if(!this.game)return;const t=this.game.getState(),r=this.game.getAvailableMoves();this.container.innerHTML=`
            <div class="max-w-5xl mx-auto p-8">
                <div class="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pine-500">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-3xl font-bold text-pine-800">7×7 Token Game</h1>
                        <button id="restart-btn"
                            class="bg-pine-100 hover:bg-pine-200 text-pine-800 font-semibold py-2 px-4 rounded-lg border-2 border-pine-500 transition-all">
                            Restart Game
                        </button>
                    </div>

                    ${this.renderStatusBar(t)}
                    ${this.renderBoard(t)}
                    ${t.gameOver?this.renderGameOver(t):this.renderControls(t,r)}
                </div>
            </div>
        `,(e=document.getElementById("restart-btn"))==null||e.addEventListener("click",()=>{this.renderStartScreen()}),t.gameOver&&((i=document.getElementById("play-again"))==null||i.addEventListener("click",()=>{this.renderStartScreen()})),!t.gameOver&&t.currentPlayer==="human"&&r.forEach(s=>{var n;(n=document.getElementById(`move-${s}`))==null||n.addEventListener("click",()=>{this.makeHumanMove(s)})})}renderStatusBar(t){const r=t.currentPlayer==="human"?"Your Turn":"Computer's Turn";return`
            <div class="mb-6 p-4 rounded-lg ${t.currentPlayer==="human"?"bg-pine-600":"bg-pine-400"} text-white">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xl font-bold">${r}</p>
                        <p class="text-sm opacity-90">Position: Row ${t.position.row}, Column ${t.position.col}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm opacity-90">First Player: ${t.firstPlayer==="human"?"You":"Computer"}</p>
                        <p class="text-sm opacity-90">Moves Made: ${t.moveHistory.length}</p>
                    </div>
                </div>
            </div>
        `}renderBoard(t){let r='<div class="mb-6 overflow-x-auto">';r+='<div class="inline-block min-w-full">';for(let e=7;e>=1;e--){r+='<div class="flex items-center mb-2">',r+=`<span class="text-pine-700 font-bold w-16 text-center">Row ${e}</span>`;for(let i=1;i<=7;i++){const s=t.position.row===e&&t.position.col===i;r+=`
                    <div class="w-16 h-16 border-2 ${s?"bg-pine-600 border-pine-800":"bg-white border-pine-300"} flex items-center justify-center m-1 rounded-lg shadow-sm transition-all">
                        ${s?'<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-pine-700">●</div>':""}
                    </div>
                `}r+="</div>"}r+='<div class="flex items-center mt-2">',r+='<span class="w-16"></span>';for(let e=1;e<=7;e++)r+=`<div class="w-16 text-center m-1 text-pine-700 font-bold">${e}</div>`;return r+="</div>",r+="</div></div>",r}renderControls(t,r){return t.currentPlayer==="computer"?`
                <div class="text-center p-4 bg-pine-100 rounded-lg">
                    <p class="text-lg text-pine-800">Computer is thinking...</p>
                </div>
            `:`
            <div class="bg-pine-50 rounded-lg p-6 border-2 border-pine-200">
                <h3 class="text-xl font-semibold text-pine-800 mb-4">Your Move</h3>
                <div class="flex gap-4 justify-center flex-wrap">
                    ${r.includes("right1")?`
                        <button id="move-right1"
                            class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">
                            Move Right 1 →
                        </button>
                    `:""}
                    ${r.includes("right2")?`
                        <button id="move-right2"
                            class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">
                            Move Right 2 →→
                        </button>
                    `:""}
                    ${r.includes("up")?`
                        <button id="move-up"
                            class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">
                            Move Up ↑
                        </button>
                    `:""}
                </div>
            </div>
        `}renderGameOver(t){const r=t.winner==="human"?"You Win!":"Computer Wins!",e=t.winner==="human"?"text-pine-700":"text-pine-500",i=t.winner==="human"?"The computer had no valid moves left!":"You had no valid moves left!";return`
            <div class="bg-pine-100 rounded-lg p-8 border-4 border-pine-500 text-center">
                <h2 class="text-4xl font-bold ${e} mb-4">${r}</h2>
                <p class="text-xl text-pine-800 mb-6">${i}</p>
                <button id="play-again"
                    class="bg-pine-600 hover:bg-pine-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105">
                    Play Again
                </button>
            </div>
        `}makeHumanMove(t){if(!this.game)return;if(this.game.makeMove(t)){this.render();const e=this.game.getState();!e.gameOver&&e.currentPlayer==="computer"&&setTimeout(()=>this.makeComputerMove(),800)}}makeComputerMove(){if(!this.game)return;const t=this.game.getOptimalComputerMove();t&&(this.game.makeMove(t),this.render())}}document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("app");if(!o){console.error("App container not found!");return}new p(o).init()});
