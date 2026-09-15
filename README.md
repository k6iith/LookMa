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

## Running Widget Tests (+, -, 0)

You can run automated widget tests directly from the source code in two ways:

### 1. Terminal / CLI Test Suite
Run the automated Python test suite to verify DOM elements, CSS styles, and JavaScript handlers for the `+`, `-`, and `0` buttons:

```bash
python test_widget.py
```

### 2. Browser Interactive Test Runner
Open `tests.html` in your browser to run live interactive assertions for the counter widget buttons:

```bash
# Open in browser
Start-Process "tests.html"
```

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6)
- **AI Engine**: Minimax algorithm with alpha-beta pruning
- **Testing**: Python CLI Test Suite (`test_widget.py`) & Browser Test Runner (`tests.html`)
- **Audio**: Web Audio API (no external audio assets required)
- **Server**: Python `http.server`
