// ui.test.js - Comprehensive UI Test Suite for Keith Checkers

function runUITests() {
    console.log("🚀 Starting Keith Checkers UI Test Suite...");

    function assertUI(condition, testName, details) {
        if (!condition) {
            throw new Error(`[UI FAIL] ${testName}${details ? ': ' + details : ''}`);
        }
        console.log(`✓ ${testName}`);
    }

    // 1. Verify App Title & Branding
    const h1 = document.querySelector('.app-header h1');
    assertUI(h1 && h1.textContent.trim() === 'Keith Checkers', 'Header shows "Keith Checkers" title');

    // 2. Verify Board Grid Initialization (64 squares: 32 light, 32 dark)
    const board = document.getElementById('board');
    assertUI(board !== null, 'Board container exists');
    
    const squares = board.querySelectorAll('.square');
    assertUI(squares.length === 64, 'Checkerboard renders exactly 64 squares (8x8)');

    const darkSquares = board.querySelectorAll('.square.dark');
    assertUI(darkSquares.length === 32, '32 dark playable tiles rendered');

    // 3. Verify Initial Piece Count (12 Red pieces, 12 Black pieces)
    const redPieces = board.querySelectorAll('.piece.red');
    const blackPieces = board.querySelectorAll('.piece.black');
    assertUI(redPieces.length === 12, 'Initial board has 12 Red pieces');
    assertUI(blackPieces.length === 12, 'Initial board has 12 Black pieces');

    // 4. Verify Score Section Displays
    const redCountEl = document.getElementById('red-count');
    const blackCountEl = document.getElementById('black-count');
    assertUI(redCountEl && redCountEl.textContent === '12', 'Red score card displays 12');
    assertUI(blackCountEl && blackCountEl.textContent === '12', 'Black score card displays 12');

    // 5. Verify Turn Indicator & Status Text
    const statusText = document.getElementById('status-text');
    assertUI(statusText && statusText.textContent.includes("Red's Turn"), 'Status bar displays "Red\'s Turn"');

    // 6. Test Interactive Piece Selection & Move Highlight
    const firstRedSquare = Array.from(darkSquares).find(sq => sq.querySelector('.piece.red'));
    assertUI(firstRedSquare !== undefined, 'Found playable Red piece square');

    firstRedSquare.click();
    const isSelected = firstRedSquare.classList.contains('selected');
    assertUI(isSelected, 'Tapping Red piece highlights it as selected');

    const moveHints = board.querySelectorAll('.move-hint');
    assertUI(moveHints.length > 0, 'Selecting Red piece shows valid move highlight dots (.move-hint)');

    // 7. Test Interactive Move Execution
    const firstTargetSquare = Array.from(squares).find(sq => sq.querySelector('.move-hint'));
    assertUI(firstTargetSquare !== undefined, 'Found valid move target square');

    firstTargetSquare.click();
    assertUI(firstTargetSquare.querySelector('.piece.red') !== null, 'Tapping destination square moves Red piece to target square');

    // 8. Verify Undo Button State
    const undoBtn = document.getElementById('btn-undo');
    assertUI(undoBtn && !undoBtn.disabled, 'Undo Move button is enabled after making a move');

    // 9. Test Match Counter Buttons (+, -, 0)
    const plusBtn = document.getElementById('btn-counter-plus');
    const minusBtn = document.getElementById('btn-counter-minus');
    const zeroBtn = document.getElementById('btn-counter-zero');
    const counterDisplay = document.getElementById('counter-value');

    zeroBtn.click();
    assertUI(counterDisplay.textContent === '0', 'Counter resets to 0');

    plusBtn.click();
    assertUI(counterDisplay.textContent === '1', 'Counter increments to 1');

    minusBtn.click();
    assertUI(counterDisplay.textContent === '0', 'Counter decrements to 0');

    // 10. Test New Game Button Reset
    const newGameBtn = document.getElementById('btn-new-game');
    newGameBtn.click();
    
    const resetRedPieces = board.querySelectorAll('.piece.red');
    assertUI(resetRedPieces.length === 12, 'New Game button resets board back to 12 Red pieces');

    console.log("🎉 All 10 UI tests passed successfully!");
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runUITests);
    } else {
        runUITests();
    }
}
