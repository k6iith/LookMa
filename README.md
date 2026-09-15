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

## Testing the Counter Widget (+, -, 0)

You can run the simple counter widget UI tests by opening `test.html` in your browser:

```bash
Start-Process "test.html"
```

Or view the clean test assertions in `counter.test.js`.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6)
- **AI Engine**: Minimax algorithm with alpha-beta pruning
- **Testing**: `counter.test.js` & `test.html`
- **Audio**: Web Audio API
- **Server**: Python `http.server`
