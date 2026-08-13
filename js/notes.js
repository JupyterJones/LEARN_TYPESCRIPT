/* TS-HACK // SQLite3 Cyber Notepad Integration */

class NotesManager {
  constructor() {
    this.apiHost = '';
  }

  async fetchNotes() {
    try {
      const response = await fetch(`${this.apiHost}/api/notes`);
      if (response.ok) {
        const notes = await response.json();
        return notes;
      }
    } catch (err) {
      console.warn('[SQLITE3]: Error fetching notes:', err);
    }
    return [];
  }

  async saveNote(title, content, tags = 'ts-notes') {
    try {
      const response = await fetch(`${this.apiHost}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags })
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (err) {
      console.error('[SQLITE3]: Error saving note to database:', err);
    }
    return { success: false };
  }

  async deleteNote(id) {
    try {
      const response = await fetch(`${this.apiHost}/api/notes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.error('[SQLITE3]: Error deleting note:', err);
    }
    return false;
  }
}

window.notesManager = new NotesManager();
