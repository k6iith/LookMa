#!/usr/bin/env python3
"""
LookMa Local Development HTTP Server
Launches the LookMa Checkers web application locally.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    url = f"http://localhost:{PORT}"
    
    print("=" * 60)
    print(" 🔴⚫ LookMa Checkers Game Server")
    print("=" * 60)
    print(f" Serving project files at: {os.getcwd()}")
    print(f" Opening web application at: {url}")
    print(" Press Ctrl+C to stop the server.")
    print("=" * 60)

    # Open browser automatically after server setup
    webbrowser.open(url)

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped gracefully.")
        sys.exit(0)

if __name__ == "__main__":
    main()
