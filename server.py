#!/usr/bin/env python3
"""
TS-HACK // Cyberpunk Server with SQLite3 Database Integration & Permanent Disk Audio Cache
Serves static web files, provides SQLite REST endpoints, and permanently caches Kokoro Docker MP3 files to hard drive.
"""

import os
import sys
import json
import sqlite3
import hashlib
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

DB_FILE = os.path.join(os.path.dirname(__file__), 'notes.db')
AUDIO_CACHE_DIR = os.path.join(os.path.dirname(__file__), 'audio_cache')
KOKORO_DOCKER_HOST = 'http://localhost:8880'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            tags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print(f"[SQLITE3]: Initialized database at {DB_FILE}")

def init_audio_cache():
    if not os.path.exists(AUDIO_CACHE_DIR):
        os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)
    print(f"[AUDIO CACHE]: Disk cache directory active at {AUDIO_CACHE_DIR}")

class CyberRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/notes':
            self.handle_get_notes()
        elif self.path == '/api/kokoro/voices':
            self.handle_kokoro_voices()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/notes':
            self.handle_post_note()
        elif self.path == '/api/kokoro/speech':
            self.handle_kokoro_speech()
        else:
            self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        if self.path.startswith('/api/notes/'):
            try:
                note_id = int(self.path.split('/')[-1])
                self.handle_delete_note(note_id)
            except ValueError:
                self.send_error(400, "Invalid note ID")
        else:
            self.send_error(404, "Endpoint not found")

    # SQLite Handlers
    def handle_get_notes(self):
        try:
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT id, title, content, tags, created_at FROM notes ORDER BY id DESC')
            rows = cursor.fetchall()
            conn.close()

            notes = [dict(row) for row in rows]
            self.send_json_response(200, notes)
        except Exception as e:
            self.send_json_response(500, {"error": str(e)})

    def handle_post_note(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            title = data.get('title', 'Untitled Note')
            content = data.get('content', '')
            tags = data.get('tags', 'general')

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO notes (title, content, tags) VALUES (?, ?, ?)',
                (title, content, tags)
            )
            conn.commit()
            note_id = cursor.lastrowid
            conn.close()

            self.send_json_response(201, {
                "success": True,
                "id": note_id,
                "title": title,
                "content": content,
                "tags": tags,
                "message": "Note saved to SQLite3 database (notes.db)"
            })
        except Exception as e:
            self.send_json_response(500, {"error": str(e)})

    def handle_delete_note(self, note_id):
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('DELETE FROM notes WHERE id = ?', (note_id,))
            conn.commit()
            conn.close()
            self.send_json_response(200, {"success": True, "id": note_id})
        except Exception as e:
            self.send_json_response(500, {"error": str(e)})

    # Kokoro Docker Proxy Handlers with Permanent Disk Caching
    def handle_kokoro_voices(self):
        try:
            req = urllib.request.Request(f"{KOKORO_DOCKER_HOST}/v1/audio/voices")
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                self.send_json_response(200, data)
        except Exception as e:
            self.send_json_response(503, {"error": "Kokoro Docker unavailable", "details": str(e)})

    def handle_kokoro_speech(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            # Compute disk cache hash key
            cache_hash = hashlib.md5(post_data).hexdigest()
            cache_filepath = os.path.join(AUDIO_CACHE_DIR, f"{cache_hash}.mp3")

            # 1. DISK CACHE HIT: Serve pre-generated MP3 directly from hard drive in 0ms!
            if os.path.exists(cache_filepath):
                print(f"⚡ [DISK CACHE HIT]: Serving pre-rendered MP3 from {cache_filepath}")
                with open(cache_filepath, 'rb') as f:
                    audio_bytes = f.read()

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_bytes)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(audio_bytes)
                return

            # 2. DISK CACHE MISS: Request audio from Kokoro Docker container on CPU
            print(f"🐢 [DISK CACHE MISS]: Requesting PyTorch CPU speech generation for hash {cache_hash[:8]}...")
            req = urllib.request.Request(
                f"{KOKORO_DOCKER_HOST}/v1/audio/speech",
                data=post_data,
                headers={'Content-Type': 'application/json'}
            )

            with urllib.request.urlopen(req, timeout=120) as resp:
                audio_bytes = resp.read()

                # Save audio file to permanent hard drive cache directory
                try:
                    with open(cache_filepath, 'wb') as f:
                        f.write(audio_bytes)
                    print(f"💾 [DISK CACHE SAVED]: Permanently saved MP3 to disk ({cache_filepath})")
                except Exception as save_err:
                    print(f"⚠️ [DISK CACHE SAVE WARN]: Could not save file to disk: {save_err}")

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_bytes)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(audio_bytes)
        except Exception as e:
            self.send_json_response(500, {"error": "Kokoro Docker speech proxy failed", "details": str(e)})

    def send_json_response(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

def run(port=8080):
    init_db()
    init_audio_cache()
    server_address = ('', port)
    httpd = HTTPServer(server_address, CyberRequestHandler)
    print(f"[TS-HACK SERVER]: Running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run(port)
