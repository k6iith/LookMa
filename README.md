# LookMa Checkers

A sleek, responsive, zero-dependency web-based Checkers (Draughts) game built with HTML5, CSS3, and modern JavaScript.

Repository: `https://github.com/k6iith/LookMa.git`

![LookMa Banner](index.html)

## Features

- **Multiple Game Modes**:
  - **vs AI (Computer)**: Play solo against the Minimax AI engine with adjustable difficulties (Easy, Medium, Hard).
  - **2 Players (Local)**: Play face-to-face on the same screen.
- **Full Checkers Rule Enforcement**:
  - Valid diagonal moves & highlight move targets.
  - Single and multi-jump captures.
  - Optional mandatory capture enforcement.
  - Automatic King promotion (with King movements in all diagonal directions).
- **Interactive UI & Polish**:
  - Live score tracking and captured piece displays.
  - Move history log with standard checker notation (`RED B6 -> C5`).
  - Move undo/redo stack.
  - Best move Hint button.
  - Game match timer.
  - Synthesized web audio sound effects for moves, captures, kinging, and victory.

## Quick Start

You can run the application using Python's built-in HTTP server:

```bash
python server.py
```

This will automatically launch `http://localhost:8000` in your default web browser.

Alternatively, you can open `index.html` directly in any web browser!

## Project Structure

- `index.html` - Game structure and UI layout.
- `style.css` - Custom visual theme and board animations.
- `game.js` - Checkers rule engine, Minimax AI, audio synth, and game manager.
- `server.py` - Local Python dev server.

## Pushing Changes to GitHub

To push this initialized project to the remote repository `https://github.com/k6iith/LookMa.git`:

```bash
git add .
git commit -m "Initialize LookMa Checkers game project"
git branch -M main
git push -u origin main
```
