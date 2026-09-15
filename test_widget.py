#!/usr/bin/env python3
"""
Automated Widget Test Suite for Keith Checkers Counter (+, -, 0)
"""

import os
import sys

def run_widget_tests():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(base_dir, "index.html")
    css_path = os.path.join(base_dir, "style.css")
    js_path = os.path.join(base_dir, "game.js")

    print("=" * 60)
    print(" [TESTS] Running Keith Checkers Widget Test Suite (+, -, 0)")
    print("=" * 60)

    tests_passed = 0
    tests_failed = 0

    def assert_test(condition, description):
        nonlocal tests_passed, tests_failed
        if condition:
            print(f" [PASS] {description}")
            tests_passed += 1
        else:
            print(f" [FAIL] {description}")
            tests_failed += 1

    # Read files
    with open(html_path, "r", encoding="utf-8") as f:
        html_code = f.read()

    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()

    with open(js_path, "r", encoding="utf-8") as f:
        js_code = f.read()

    # --- HTML Widget Component Tests ---
    print("\n[Section 1: HTML DOM Component Tests]")
    assert_test('id="btn-counter-minus"' in html_code, "Minus (-) button element (#btn-counter-minus) exists in index.html")
    assert_test('id="btn-counter-zero"' in html_code, "Zero (0) button element (#btn-counter-zero) exists in index.html")
    assert_test('id="btn-counter-plus"' in html_code, "Plus (+) button element (#btn-counter-plus) exists in index.html")
    assert_test('id="counter-value"' in html_code, "Counter display element (#counter-value) exists in index.html")

    # --- CSS Styling Widget Tests ---
    print("\n[Section 2: CSS Styling & Theme Tests]")
    assert_test('.counter-card' in css_code, ".counter-card style rule defined in style.css")
    assert_test('.btn-counter' in css_code, ".btn-counter base button style defined in style.css")
    assert_test('.btn-counter-minus' in css_code, ".btn-counter-minus style rule defined in style.css")
    assert_test('.btn-counter-plus' in css_code, ".btn-counter-plus style rule defined in style.css")
    assert_test('.btn-counter-zero' in css_code, ".btn-counter-zero style rule defined in style.css")

    # --- JavaScript State & Handler Widget Tests ---
    print("\n[Section 3: JavaScript Engine & Handler Tests]")
    assert_test('this.matchCounter' in js_code, "matchCounter state variable initialized in CheckersGame")
    assert_test('btnCounterMinus' in js_code, "btnCounterMinus DOM binding present in game.js")
    assert_test('btnCounterZero' in js_code, "btnCounterZero DOM binding present in game.js")
    assert_test('btnCounterPlus' in js_code, "btnCounterPlus DOM binding present in game.js")
    assert_test('updateCounterDisplay' in js_code, "updateCounterDisplay() view updater function present in game.js")
    assert_test('this.matchCounter--' in js_code, "Minus (-) decrement logic present in event handler")
    assert_test('this.matchCounter = 0' in js_code, "Zero (0) reset logic present in event handler")
    assert_test('this.matchCounter++' in js_code, "Plus (+) increment logic present in event handler")

    print("\n" + "=" * 60)
    print(f" Summary: {tests_passed} Passed, {tests_failed} Failed")
    print("=" * 60)

    if tests_failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_widget_tests()
