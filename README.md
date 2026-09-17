# Keith Checkers

A web-based checkers game featuring local 2-player mode and an AI opponent built with vanilla HTML5, CSS3, and JavaScript, styled in a sleek red and black ombre aesthetic.

## Features

- **2 Game Modes**: Play against a local player or against an AI with 3 difficulty levels (Easy, Medium, Hard).
- **Checkers Engine**:
  - Valid move highlighting
  - Single and multi-jump captures
  - Mandatory jump option
  - King promotion & movement
  - Move history tracking and undo support
- **Match Counter Widget**: Dedicated `-`, `0`, and `+` counter controls matching the UI theme.
- **Audio & Visuals**:
  - Web Audio API synthesizer for move, capture, kinging, and win sound effects.
  - Red & black ombre gradients with responsive board design.

## Running the Game

Run the included Python server to launch locally:

```bash
python server.py
```

Or simply open `index.html` directly in any web browser.

## Running UI & Widget Tests

You can run automated UI and counter widget tests in your browser:

### 1. Full UI Test Suite (`ui.test.js` / `ui-test.html`)
Tests app branding, 8x8 checkerboard layout, piece counts, move highlight dots, move execution, undo button enabling, and New Game reset:

```bash
Start-Process "ui-test.html"
```

### 2. Counter Widget Test Suite (`counter.test.js` / `test.html`)
Tests counter controls (`+`, `-`, `0`) step-by-step:

```bash
Start-Process "test.html"
```

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6)
- **AI Engine**: Minimax algorithm with alpha-beta pruning
- **Testing**: `ui.test.js` (`ui-test.html`) & `counter.test.js` (`test.html`)
- **Audio**: Web Audio API
- **Server**: Python `http.server`
