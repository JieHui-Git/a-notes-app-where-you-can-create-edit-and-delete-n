const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3000;

const notesFile = path.join(__dirname, 'notes.json');

app.use(express.json());

if (!fs.existsSync(notesFile)) {
  fs.writeFileSync(notesFile, JSON.stringify([]));
}

function readNotes() {
  return fs.readJSONSync(notesFile);
}

function writeNotes(notes) {
  fs.writeJSONSync(notesFile, notes);
}

app.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const notes = readNotes();
  const newNote = { id: Date.now().toString(), content: req.body.content };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

app.delete('/notes/:id', (req, res) => {
  const notes = readNotes();
  const updatedNotes = notes.filter(note => note.id !== req.params.id);
  writeNotes(updatedNotes);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
