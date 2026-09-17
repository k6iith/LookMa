// ui.test.js - Comprehensive UI Test Suite for Keith Checkers

function runUITests() {
    console.log("🚀 Starting Keith Checkers UI Test Suite...");

    const resultsGrid = document.getElementById('results-grid');
    const statusBanner = document.getElementById('ui-test-status');
    let passCount = 0;
    let failCount = 0;

    function renderTestResult(testName, passed, details) {
        if (passed) {
            passCount++;
            console.log(`✓ ${testName}`);
        } else {
            failCount++;
            console.error(`✗ ${testName}: ${details}`);
        }

        if (resultsGrid) {
            const row = document.createElement('div');
            row.className = `test-row ${passed ? '' : 'failed'}`;
            row.innerHTML = `
                <span>${passed ? '✓' : '✗'} ${testName}</span>
                <span class="${passed ? 'badge-pass' : 'badge-fail'}">${passed ? 'PASS' : 'FAIL'}</span>
            `;
            resultsGrid.appendChild(row);
        }
    }

    function runAssertion(testName, testFn) {
        try {
            testFn();
            renderTestResult(testName, true);
        } catch (err) {
            renderTestResult(testName, false, err.message);
        }
    }

    // 1. Verify App Title & Branding
    runAssertion('Header Title Branding', () => {
        const h1 = document.querySelector('.app-header h1');
        if (!h1 || h1.textContent.trim() !== 'Keith Checkers') {
            throw new Error('Title does not match "Keith Checkers"');
        }
    });

    // 2. Verify Board Grid Initialization (64 squares)
    runAssertion('8x8 Board & Tile Grid (64 Squares)', () => {
        const board = document.getElementById('board');
        const squares = board ? board.querySelectorAll('.square') : [];
        if (squares.length !== 64) {
            throw new Error(`Expected 64 squares, got ${squares.length}`);
        }
    });

    // 3. Verify Initial Pieces (12 Red + 12 Black)
    runAssertion('Initial Piece Setup (12 Red + 12 Black)', () => {
        const redPieces = document.querySelectorAll('#board .piece.red');
        const blackPieces = document.querySelectorAll('#board .piece.black');
        if (redPieces.length !== 12 || blackPieces.length !== 12) {
            throw new Error(`Expected 12 Red and 12 Black, got Red=${redPieces.length}, Black=${blackPieces.length}`);
        }
    });

    // 4. Verify Score Cards
    runAssertion('Score Cards Count Display', () => {
        const redCount = document.getElementById('red-count');
        const blackCount = document.getElementById('black-count');
        if (redCount.textContent !== '12' || blackCount.textContent !== '12') {
            throw new Error('Score cards do not display 12');
        }
    });

    // 5. Verify Turn Indicator
    runAssertion('Turn Indicator & Status Text', () => {
        const statusText = document.getElementById('status-text');
        if (!statusText || !statusText.textContent.includes("Red's Turn")) {
            throw new Error('Status text does not display "Red\'s Turn"');
        }
    });

    // 6. Test Interactive Piece Selection & Move Highlight Dots
    runAssertion('Piece Selection & Move Target Dots (.move-hint)', () => {
        const darkSquares = document.querySelectorAll('#board .square.dark');
        const firstRedSquare = Array.from(darkSquares).find(sq => sq.querySelector('.piece.red'));
        if (!firstRedSquare) throw new Error('No Red piece square found');

        firstRedSquare.click();
        const moveHints = document.querySelectorAll('#board .move-hint');
        if (moveHints.length === 0) {
            throw new Error('Selecting Red piece did not display move hint dots');
        }
    });

    // 7. Test Interactive Move Execution
    runAssertion('Interactive Piece Movement', () => {
        const targetSquare = document.querySelector('#board .square:has(.move-hint)') || 
                             Array.from(document.querySelectorAll('#board .square')).find(sq => sq.querySelector('.move-hint'));
        if (!targetSquare) throw new Error('No target square with move hint found');

        targetSquare.click();
        if (!targetSquare.querySelector('.piece.red')) {
            throw new Error('Red piece failed to move to target square');
        }
    });

    // 8. Verify Undo Move Button State
    runAssertion('Undo Move Button Enabling', () => {
        const undoBtn = document.getElementById('btn-undo');
        if (!undoBtn || undoBtn.disabled) {
            throw new Error('Undo Move button is not enabled after making a move');
        }
    });

    // 9. Test Match Counter Controls (+, -, 0)
    runAssertion('Match Counter Controls (+, -, 0)', () => {
        const plusBtn = document.getElementById('btn-counter-plus');
        const minusBtn = document.getElementById('btn-counter-minus');
        const zeroBtn = document.getElementById('btn-counter-zero');
        const display = document.getElementById('counter-value');

        zeroBtn.click();
        if (display.textContent !== '0') throw new Error('Reset failed');
        plusBtn.click();
        if (display.textContent !== '1') throw new Error('Increment failed');
        minusBtn.click();
        if (display.textContent !== '0') throw new Error('Decrement failed');
    });

    // 10. Test New Game Reset
    runAssertion('New Game Reset Button', () => {
        const newGameBtn = document.getElementById('btn-new-game');
        newGameBtn.click();
        const redPieces = document.querySelectorAll('#board .piece.red');
        if (redPieces.length !== 12) {
            throw new Error('New Game did not reset Red pieces back to 12');
        }
    });

    if (statusBanner) {
        statusBanner.textContent = `✓ All ${passCount} UI Tests Passed! (${failCount} Failed)`;
        if (failCount > 0) {
            statusBanner.style.color = '#ff4d4d';
            statusBanner.style.borderColor = '#ff4d4d';
            statusBanner.style.background = 'rgba(230, 43, 58, 0.15)';
        }
    }
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runUITests);
    } else {
        runUITests();
    }
}
