// counter.test.js - Simple UI tests for +, -, and 0 counter buttons

function runCounterTests() {
    console.log("Running Counter Widget Tests...");

    const plusBtn = document.getElementById('btn-counter-plus');
    const minusBtn = document.getElementById('btn-counter-minus');
    const zeroBtn = document.getElementById('btn-counter-zero');
    const display = document.getElementById('counter-value');

    if (!plusBtn || !minusBtn || !zeroBtn || !display) {
        console.error("Counter widget elements not found in DOM");
        return;
    }

    // Reset to 0
    zeroBtn.click();
    console.assert(display.textContent === '0', 'Expected 0 after reset');

    // Tap + to see counter increase
    plusBtn.click();
    console.assert(display.textContent === '1', 'Expected 1 after tapping +');

    plusBtn.click();
    console.assert(display.textContent === '2', 'Expected 2 after tapping + again');

    // Tap - to see counter decrement
    minusBtn.click();
    console.assert(display.textContent === '1', 'Expected 1 after tapping -');

    // Tap 0 to reset counter back to 0
    zeroBtn.click();
    console.assert(display.textContent === '0', 'Expected 0 after tapping reset');

    console.log("✓ All counter tests passed successfully!");
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runCounterTests);
    } else {
        runCounterTests();
    }
}
