import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editableNoteId, setEditableNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await axios.post('http://localhost:3000/notes', { content: newNote });
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEdit = (noteId) => {
    setEditMode(true);
    setEditableNoteId(noteId);
    const noteToEdit = notes.find(n => n.id === noteId);
    if (noteToEdit) {
      setNewNote(noteToEdit.content);
    }
  };

  const updateNote = async () => {
    try {
      await axios.put(`http://localhost:3000/notes/${editableNoteId}`, { content: newNote });
      setEditMode(false);
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div>
      <h1>Notes App</h1>
      <form onSubmit={editMode ? updateNote : addNote}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a note..."
        />
        <button type="submit">{editMode ? 'Update Note' : 'Add Note'}</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.content}
            <button onClick={() => startEdit(note.id)}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
