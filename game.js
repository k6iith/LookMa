/**
 * LookMa Checkers Engine & UI Manager
 */

class SoundManager {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
    }

    playTone(freq, type, duration, gainValue = 0.1) {
        try {
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context blocked or not supported
        }
    }

    playMove() {
        this.playTone(320, 'sine', 0.1, 0.08);
    }

    playCapture() {
        this.playTone(180, 'square', 0.18, 0.12);
        setTimeout(() => this.playTone(240, 'triangle', 0.15, 0.1), 80);
    }

    playKing() {
        this.playTone(440, 'sine', 0.15, 0.12);
        setTimeout(() => this.playTone(554.37, 'sine', 0.15, 0.12), 120);
        setTimeout(() => this.playTone(659.25, 'sine', 0.25, 0.12), 240);
    }

    playWin() {
        this.playTone(523.25, 'triangle', 0.2, 0.15);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.2, 0.15), 180);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.4, 0.15), 360);
    }
}

class CheckersGame {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.turn = 'red'; // 'red' or 'black'
        this.selectedSquare = null; // {r, c}
        this.validMoves = []; // array of move objects
        this.history = []; // state snapshots for undo
        this.moveLog = []; // string representations
        this.multiJumpPiece = null; // {r, c} if mid-jump sequence
        
        // Settings
        this.mode = 'ai'; // 'ai' or 'pvp'
        this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
        this.playerColor = 'red'; // player color in AI mode
        this.forcedJumps = true;
        
        // Stats
        this.timerSeconds = 0;
        this.timerInterval = null;
        this.isGameOver = false;

        this.sounds = new SoundManager();

        this.initDOM();
        this.bindEvents();
        this.startNewGame();
    }

    initDOM() {
        this.boardEl = document.getElementById('board');
        this.statusTextEl = document.getElementById('status-text');
        this.turnDotEl = document.getElementById('turn-dot');
        this.timerEl = document.getElementById('timer-display');
        this.redCountEl = document.getElementById('red-count');
        this.blackCountEl = document.getElementById('black-count');
        this.redCapturedEl = document.getElementById('red-captured');
        this.blackCapturedEl = document.getElementById('black-captured');
        this.historyListEl = document.getElementById('history-list');
        
        this.modeSelect = document.getElementById('mode-select');
        this.diffSelect = document.getElementById('difficulty-select');
        this.colorSelect = document.getElementById('player-color-select');
        this.forcedToggle = document.getElementById('forced-jumps-toggle');
        this.aiDiffGroup = document.getElementById('ai-difficulty-group');

        this.btnNewGame = document.getElementById('btn-new-game');
        this.btnUndo = document.getElementById('btn-undo');
        this.btnHint = document.getElementById('btn-hint');

        this.modalEl = document.getElementById('victory-modal');
        this.modalTitleEl = document.getElementById('modal-title');
        this.modalMsgEl = document.getElementById('modal-message');
        this.modalRestartBtn = document.getElementById('modal-restart');
    }

    bindEvents() {
        this.modeSelect.addEventListener('change', (e) => {
            this.mode = e.target.value;
            this.aiDiffGroup.style.display = this.mode === 'ai' ? 'flex' : 'none';
            this.startNewGame();
        });

        this.diffSelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });

        this.colorSelect.addEventListener('change', (e) => {
            this.playerColor = e.target.value;
            this.startNewGame();
        });

        this.forcedToggle.addEventListener('change', (e) => {
            this.forcedJumps = e.target.checked;
            this.updateValidMovesForTurn();
            this.renderBoard();
        });

        this.btnNewGame.addEventListener('click', () => this.startNewGame());
        this.btnUndo.addEventListener('click', () => this.undoMove());
        this.btnHint.addEventListener('click', () => this.showHint());
        this.modalRestartBtn.addEventListener('click', () => {
            this.modalEl.classList.add('hidden');
            this.startNewGame();
        });
    }

    startNewGame() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.turn = 'red';
        this.selectedSquare = null;
        this.validMoves = [];
        this.history = [];
        this.moveLog = [];
        this.multiJumpPiece = null;
        this.isGameOver = false;

        // Populate pieces (Dark tiles only: (r + c) % 2 === 1)
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if ((r + c) % 2 === 1) {
                    if (r < 3) {
                        this.board[r][c] = { color: 'black', isKing: false };
                    } else if (r > 4) {
                        this.board[r][c] = { color: 'red', isKing: false };
                    }
                }
            }
        }

        this.resetTimer();
        this.startTimer();

        this.updateValidMovesForTurn();
        this.renderBoard();
        this.updateUI();

        // If AI plays first (Player selected Black)
        if (this.mode === 'ai' && this.turn !== this.playerColor) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerSeconds = 0;
        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            const mins = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
            const secs = String(this.timerSeconds % 60).padStart(2, '0');
            this.timerEl.textContent = `Time: ${mins}:${secs}`;
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timerEl.textContent = 'Time: 00:00';
    }

    saveStateSnapshot() {
        // Deep copy board state
        const boardCopy = this.board.map(row => row.map(cell => cell ? { ...cell } : null));
        this.history.push({
            board: boardCopy,
            turn: this.turn,
            moveLog: [...this.moveLog],
            multiJumpPiece: this.multiJumpPiece ? { ...this.multiJumpPiece } : null
        });
        this.btnUndo.disabled = this.history.length === 0;
    }

    undoMove() {
        if (this.history.length === 0 || this.isGameOver) return;
        
        let targetState;
        if (this.mode === 'ai') {
            // Undo 2 steps to get back to player's turn, unless AI hasn't moved
            if (this.history.length >= 2) {
                this.history.pop();
                targetState = this.history.pop();
            } else {
                targetState = this.history.pop();
            }
        } else {
            targetState = this.history.pop();
        }

        if (targetState) {
            this.board = targetState.board;
            this.turn = targetState.turn;
            this.moveLog = targetState.moveLog;
            this.multiJumpPiece = targetState.multiJumpPiece;
            this.selectedSquare = null;
            this.updateValidMovesForTurn();
            this.renderBoard();
            this.updateUI();
        }

        this.btnUndo.disabled = this.history.length === 0;
    }

    // Move Logic & Rule Enforcement
    getValidMovesForPiece(r, c, board = this.board) {
        const piece = board[r][c];
        if (!piece) return [];

        const moves = [];
        const directions = [];

        if (piece.color === 'red' || piece.isKing) {
            directions.push([-1, -1], [-1, 1]); // Up
        }
        if (piece.color === 'black' || piece.isKing) {
            directions.push([1, -1], [1, 1]); // Down
        }

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            // Simple 1-step move
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                if (!board[nr][nc]) {
                    moves.push({
                        from: { r, c },
                        to: { r: nr, c: nc },
                        isJump: false,
                        jumped: null
                    });
                } else if (board[nr][nc].color !== piece.color) {
                    // Jump move
                    const jnr = r + dr * 2;
                    const jnc = c + dc * 2;
                    if (jnr >= 0 && jnr < 8 && jnc >= 0 && jnc < 8 && !board[jnr][jnc]) {
                        moves.push({
                            from: { r, c },
                            to: { r: jnr, c: jnc },
                            isJump: true,
                            jumped: { r: nr, c: nc }
                        });
                    }
                }
            }
        }
        return moves;
    }

    getAllValidMoves(color, board = this.board) {
        let allMoves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] && board[r][c].color === color) {
                    const pieceMoves = this.getValidMovesForPiece(r, c, board);
                    allMoves.push(...pieceMoves);
                }
            }
        }

        const jumpMoves = allMoves.filter(m => m.isJump);
        if (this.forcedJumps && jumpMoves.length > 0) {
            return jumpMoves;
        }
        return allMoves;
    }

    updateValidMovesForTurn() {
        if (this.multiJumpPiece) {
            // Must continue jumping with the same piece if available
            const pieceMoves = this.getValidMovesForPiece(this.multiJumpPiece.r, this.multiJumpPiece.c);
            this.validMoves = pieceMoves.filter(m => m.isJump);
        } else {
            this.validMoves = this.getAllValidMoves(this.turn);
        }
    }

    handleSquareClick(r, c) {
        if (this.isGameOver) return;
        if (this.mode === 'ai' && this.turn !== this.playerColor) return;

        this.sounds.init();

        const piece = this.board[r][c];

        // If clicking destination of selected piece
        if (this.selectedSquare) {
            const chosenMove = this.validMoves.find(
                m => m.from.r === this.selectedSquare.r && m.from.c === this.selectedSquare.c && m.to.r === r && m.to.c === c
            );

            if (chosenMove) {
                this.executeMove(chosenMove);
                return;
            }
        }

        // If locked in multi-jump, only allow selecting that piece
        if (this.multiJumpPiece && (r !== this.multiJumpPiece.r || c !== this.multiJumpPiece.c)) {
            return;
        }

        // Select piece of current player's color
        if (piece && piece.color === this.turn) {
            const hasMoves = this.validMoves.some(m => m.from.r === r && m.from.c === c);
            if (hasMoves) {
                this.selectedSquare = { r, c };
                this.renderBoard();
            }
        }
    }

    executeMove(move) {
        this.saveStateSnapshot();

        const { from, to, isJump, jumped } = move;
        const piece = { ...this.board[from.r][from.c] };

        this.board[from.r][from.c] = null;
        this.board[to.r][to.c] = piece;

        let kinged = false;
        // Check king promotion
        if (!piece.isKing) {
            if ((piece.color === 'red' && to.r === 0) || (piece.color === 'black' && to.r === 7)) {
                piece.isKing = true;
                kinged = true;
            }
        }

        if (isJump && jumped) {
            this.board[jumped.r][jumped.c] = null;
            this.sounds.playCapture();
        } else {
            this.sounds.playMove();
        }

        if (kinged) {
            this.sounds.playKing();
        }

        // Move logging notation
        const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const notation = `${piece.color.toUpperCase()} ${colLetters[from.c]}${8 - from.r} ${isJump ? 'x' : '->'} ${colLetters[to.c]}${8 - to.r}${kinged ? ' (King)' : ''}`;
        this.moveLog.push(notation);

        // Multi-jump check (if jump performed and not kinged on this move)
        let canContinueJump = false;
        if (isJump && !kinged) {
            const nextMoves = this.getValidMovesForPiece(to.r, to.c).filter(m => m.isJump);
            if (nextMoves.length > 0) {
                canContinueJump = true;
                this.multiJumpPiece = { r: to.r, c: to.c };
                this.selectedSquare = { r: to.r, c: to.c };
            }
        }

        if (!canContinueJump) {
            this.multiJumpPiece = null;
            this.selectedSquare = null;
            this.switchTurn();
        } else {
            this.updateValidMovesForTurn();
        }

        this.renderBoard();
        this.updateUI();

        // Trigger AI if turn changed and mode is AI
        if (!this.isGameOver && this.mode === 'ai' && this.turn !== this.playerColor) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    switchTurn() {
        this.turn = this.turn === 'red' ? 'black' : 'red';
        this.updateValidMovesForTurn();

        // Check Win/Loss/Draw
        if (this.validMoves.length === 0) {
            this.isGameOver = true;
            const winner = this.turn === 'red' ? 'Black' : 'Red';
            this.showGameOver(`${winner} Wins!`, `${this.turn.toUpperCase()} has no valid moves remaining.`);
            this.sounds.playWin();
        }
    }

    // Minimax AI Engine
    makeAIMove() {
        if (this.isGameOver) return;

        let selectedMove = null;
        const validMoves = this.getAllValidMoves(this.turn);

        if (validMoves.length === 0) return;

        if (this.difficulty === 'easy') {
            selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
            const depth = this.difficulty === 'medium' ? 3 : 5;
            selectedMove = this.getBestMoveMinimax(depth);
        }

        if (selectedMove) {
            this.executeMove(selectedMove);
        }
    }

    getBestMoveMinimax(depth) {
        let bestMove = null;
        let bestValue = -Infinity;
        const aiColor = this.turn;
        const moves = this.getAllValidMoves(aiColor);

        for (const move of moves) {
            const tempBoard = this.simulateMove(this.board, move);
            const boardVal = this.minimax(tempBoard, depth - 1, -Infinity, Infinity, false, aiColor);

            if (boardVal > bestValue) {
                bestValue = boardVal;
                bestMove = move;
            }
        }

        return bestMove || moves[0];
    }

    minimax(board, depth, alpha, beta, isMaximizing, aiColor) {
        const currentColor = isMaximizing ? aiColor : (aiColor === 'red' ? 'black' : 'red');
        const moves = this.getAllValidMoves(currentColor, board);

        if (depth === 0 || moves.length === 0) {
            return this.evaluateBoard(board, aiColor);
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const nextBoard = this.simulateMove(board, move);
                const evalVal = this.minimax(nextBoard, depth - 1, alpha, beta, false, aiColor);
                maxEval = Math.max(maxEval, evalVal);
                alpha = Math.max(alpha, evalVal);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const nextBoard = this.simulateMove(board, move);
                const evalVal = this.minimax(nextBoard, depth - 1, alpha, beta, true, aiColor);
                minEval = Math.min(minEval, evalVal);
                beta = Math.min(beta, evalVal);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    simulateMove(board, move) {
        const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
        const { from, to, isJump, jumped } = move;
        const piece = newBoard[from.r][from.c];

        newBoard[from.r][from.c] = null;
        newBoard[to.r][to.c] = piece;

        if (!piece.isKing) {
            if ((piece.color === 'red' && to.r === 0) || (piece.color === 'black' && to.r === 7)) {
                piece.isKing = true;
            }
        }

        if (isJump && jumped) {
            newBoard[jumped.r][jumped.c] = null;
        }

        return newBoard;
    }

    evaluateBoard(board, aiColor) {
        let score = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p) {
                    let val = p.isKing ? 1.8 : 1.0;
                    // Positional weight: reward center control
                    const centerWeight = (r >= 2 && r <= 5 && c >= 2 && c <= 5) ? 0.2 : 0;
                    val += centerWeight;

                    if (p.color === aiColor) {
                        score += val;
                    } else {
                        score -= val;
                    }
                }
            }
        }
        return score;
    }

    showHint() {
        if (this.isGameOver) return;
        const moves = this.validMoves;
        if (moves.length > 0) {
            const hintMove = moves[Math.floor(Math.random() * moves.length)];
            this.selectedSquare = { r: hintMove.from.r, c: hintMove.from.c };
            this.renderBoard();
        }
    }

    showGameOver(title, message) {
        clearInterval(this.timerInterval);
        this.modalTitleEl.textContent = title;
        this.modalMsgEl.textContent = message;
        this.modalEl.classList.remove('hidden');
    }

    // UI & Rendering
    renderBoard() {
        this.boardEl.innerHTML = '';

        let redPieces = 0;
        let blackPieces = 0;

        const mustJumpSquares = new Set();
        if (this.forcedJumps) {
            this.validMoves.filter(m => m.isJump).forEach(m => mustJumpSquares.add(`${m.from.r},${m.from.c}`));
        }

        const validTargets = new Set();
        if (this.selectedSquare) {
            this.validMoves
                .filter(m => m.from.r === this.selectedSquare.r && m.from.c === this.selectedSquare.c)
                .forEach(m => validTargets.add(`${m.to.r},${m.to.c}`));
        }

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const squareEl = document.createElement('div');
                const isDark = (r + c) % 2 === 1;
                squareEl.className = `square ${isDark ? 'dark' : 'light'}`;

                if (isDark) {
                    squareEl.classList.add('playable');

                    if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
                        squareEl.classList.add('selected');
                    } else if (mustJumpSquares.has(`${r},${c}`)) {
                        squareEl.classList.add('must-jump');
                    }

                    if (validTargets.has(`${r},${c}`)) {
                        const hintDot = document.createElement('div');
                        hintDot.className = 'move-hint';
                        squareEl.appendChild(hintDot);
                    }

                    const piece = this.board[r][c];
                    if (piece) {
                        if (piece.color === 'red') redPieces++;
                        if (piece.color === 'black') blackPieces++;

                        const pieceEl = document.createElement('div');
                        pieceEl.className = `piece ${piece.color} ${piece.isKing ? 'king' : ''}`;
                        squareEl.appendChild(pieceEl);
                    }

                    squareEl.addEventListener('click', () => this.handleSquareClick(r, c));
                }

                this.boardEl.appendChild(squareEl);
            }
        }

        this.redCountEl.textContent = redPieces;
        this.blackCountEl.textContent = blackPieces;

        // Render captured counters
        this.renderCaptured(this.redCapturedEl, 12 - blackPieces, 'black');
        this.renderCaptured(this.blackCapturedEl, 12 - redPieces, 'red');
    }

    renderCaptured(containerEl, count, color) {
        containerEl.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const mini = document.createElement('div');
            mini.className = `captured-mini-piece ${color}`;
            containerEl.appendChild(mini);
        }
    }

    updateUI() {
        const turnName = this.turn.charAt(0).toUpperCase() + this.turn.slice(1);
        this.statusTextEl.textContent = `${turnName}'s Turn`;

        if (this.turn === 'red') {
            this.turnDotEl.className = 'indicator-dot';
        } else {
            this.turnDotEl.className = 'indicator-dot black-turn';
        }

        // Render history log
        this.historyListEl.innerHTML = '';
        this.moveLog.forEach(log => {
            const li = document.createElement('li');
            li.className = `history-item ${log.startsWith('RED') ? 'red-move' : 'black-move'}`;
            li.textContent = log;
            this.historyListEl.appendChild(li);
        });

        // Scroll log to bottom
        this.historyListEl.parentElement.scrollTop = this.historyListEl.parentElement.scrollHeight;
    }
}

// Instantiate game on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CheckersGame();
});
