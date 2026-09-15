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
- **Match Counter**: Dedicated `-`, `0`, and `+` counter controls matching the UI theme.
- **Audio & Visuals**:
  - Web Audio API synthesizer for move, capture, kinging, and win sound effects.
  - Red & black ombre gradients with responsive board design.

## Running the Game

Run the included Python server to launch locally:

```bash
python server.py
```

Or simply open `index.html` directly in any web browser.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6)
- **AI Engine**: Minimax algorithm with alpha-beta pruning
- **Audio**: Web Audio API (no external audio assets required)
- **Server**: Python `http.server`
