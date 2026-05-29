const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());

let notes = [];

const dataPath = path.join(__dirname, 'notes.json');

const loadNotes = async () => {
  if (await fs.pathExists(dataPath)) {
    const notesData = await fs.readFile(dataPath, 'utf-8');
    notes = JSON.parse(notesData);
  }
};

const saveNotes = async () => {
  await fs.writeFile(dataPath, JSON.stringify(notes, null, 2));
};

loadNotes();

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const { content } = req.body;
  if (!content.trim()) return res.status(400).send('Note cannot be empty');
  const newNote = { id: uuidv4(), content };
  notes.push(newNote);
  saveNotes();
  res.json(newNote);
});

app.put('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { content } = req.body;
  if (!content.trim()) return res.status(400).send('Note cannot be empty');
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex].content = content;
    saveNotes();
    res.json(notes[noteIndex]);
  } else {
    res.status(404).send('Note not found');
  }
});

app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  notes = notes.filter(n => n.id !== noteId);
  saveNotes();
  res.sendStatus(204);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
