// counter.test.js - UI tests for +, -, and 0 counter buttons

function runCounterTests() {
    // Start app / get counter controls
    const plusBtn = document.getElementById('btn-counter-plus');
    const minusBtn = document.getElementById('btn-counter-minus');
    const zeroBtn = document.getElementById('btn-counter-zero');
    const display = document.getElementById('counter-value');

    // Helper function to make sure each test passes
    function expectCounter(expected, message) {
        const actual = display.textContent.trim();

        if (actual !== String(expected)) {
            throw new Error(
                `${message}: Expected ${expected}, but got ${actual}`
            );
        }

        console.log(`✓ ${message}`);
    }

    // 1. Counter increment
    plusBtn.click();
    expectCounter(1, 'Counter increments to 1');

    // 2. Start test by resetting counter to 0
    zeroBtn.click();
    expectCounter(0, 'Counter resets to 0');

    // 3. Tap + icon to increase counter
    plusBtn.click();
    expectCounter(1, 'Counter increases to 1');

    // 4. Tap + icon again
    plusBtn.click();
    expectCounter(2, 'Counter increases to 2');

    // 5. Tap - icon to decrement counter
    minusBtn.click();
    expectCounter(1, 'Counter decrements to 1');

    // 6. Tap 0 icon to reset counter
    zeroBtn.click();
    expectCounter(0, 'Counter resets back to 0');

    console.log('✓ All counter tests passed successfully!');
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runCounterTests);
    } else {
        runCounterTests();
    }
}
