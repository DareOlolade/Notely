const Note = require("../models/Note");
const createNote = async (req, res) => {
  try {
    const noteData = req.body;
    if (!noteData) {
      return res.status(400).json({ message: "no note data found" });
    }
    noteData.author = req.user.id;
    const note = Note(noteData);
    await note.save();
    res.status(201).json({ title: note.title, body: note.body });
  } catch (error) {
    console.error(`error creating note`, error.message);
    res.status(400).json({ message: "Error creating note" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user.id });
    if (!notes) {
      return res.status(400).json({ message: "notes not found" });
    }
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: "Error geting note" });
  }
};
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateNote) {
      return res.status(400).json({ message: "note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: "Error updating note" });
  }
};
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(400).json({ message: "note not found" });
    }
    res.status(200).json(deletedNote);
  } catch (error) {
    res.status(400).json({ message: "Error deleting note" });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
