import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Import Firebase config
import './App.css';

function App() {
  const [newNote, setNewNote] = useState({ title: "", tagline: "", body: "" });
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Fetch notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notes"));
        const notesArray = [];
        querySnapshot.forEach((doc) => {
          notesArray.push({ id: doc.id, ...doc.data() });
        });
        // Sort notes: pinned notes at the top
        notesArray.sort((a, b) => b.pinned - a.pinned);
        setNotes(notesArray);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  // Handle note submission
  const handleAddNote = async () => {
    if (!newNote.title || !newNote.body) {
      alert("Title and Body are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title: newNote.title,
        tagline: newNote.tagline,
        body: newNote.body,
        createdAt: serverTimestamp(),
        pinned: false, // Initially set as unpinned
      });

      // Add the new note directly to the local state
      setNotes((prevNotes) => [
        { id: docRef.id, ...newNote, createdAt: serverTimestamp() },
        ...prevNotes,
      ]);
      setNewNote({ title: "", tagline: "", body: "" }); // Reset form
      alert("Note added successfully!");
    } catch (error) {
      console.error("Error adding note: ", error);
      alert("Error saving note. Please try again.");
    }
  };

  // Toggle pinned status
  const handleTogglePin = async (id) => {
    const noteToUpdate = notes.find((note) => note.id === id);
    const updatedNote = { ...noteToUpdate, pinned: !noteToUpdate.pinned };

    try {
      const noteDocRef = doc(db, "notes", id);
      await updateDoc(noteDocRef, { pinned: updatedNote.pinned });

      // Re-fetch notes after updating pin status
      const querySnapshot = await getDocs(collection(db, "notes"));
      const updatedNotesArray = [];
      querySnapshot.forEach((doc) => {
        updatedNotesArray.push({ id: doc.id, ...doc.data() });
      });
      updatedNotesArray.sort((a, b) => b.pinned - a.pinned);
      setNotes(updatedNotesArray);
    } catch (error) {
      console.error("Error updating pin status: ", error);
    }
  };

  // Open modal to edit note
  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  // Handle note update
  const handleUpdateNote = async () => {
    if (!currentNote.title || !currentNote.body) {
      alert("Title and Body are required!");
      return;
    }

    try {
      const noteDocRef = doc(db, "notes", currentNote.id);
      await updateDoc(noteDocRef, {
        title: currentNote.title,
        tagline: currentNote.tagline,
        body: currentNote.body,
      });

      // Update the note directly in the local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === currentNote.id
            ? { ...note, title: currentNote.title, tagline: currentNote.tagline, body: currentNote.body }
            : note
        )
      );

      setIsModalOpen(false);
      alert("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note: ", error);
      alert("Error updating note. Please try again.");
    }
  };

  // Delete note function
  const handleDeleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes(notes.filter((note) => note.id !== id)); // Remove from local state
      alert("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note: ", error);
      alert("Error deleting note. Please try again.");
    }
  };

  return (
    <div className="App">
      <div className="note-form">
        <h1 className="app-heading">NoteKeeper</h1>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tagline"
          value={newNote.tagline}
          onChange={(e) => setNewNote({ ...newNote, tagline: e.target.value })}
        />
        <textarea
          placeholder="Body"
          value={newNote.body}
          onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            onClick={() => handleEditNote(note)}
          >
            <h3>{note.title}</h3>
            <p>{note.tagline}</p>
            <p>{note.body}</p>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>Delete</button>
            <button onClick={(e) => { e.stopPropagation(); handleTogglePin(note.id); }}>
              {note.pinned ? "Unpin" : "Pin"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal to edit note */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Note</h2>
            <input
              type="text"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            />
            <input
              type="text"
              value={currentNote.tagline}
              onChange={(e) => setCurrentNote({ ...currentNote, tagline: e.target.value })}
            />
            <textarea
              value={currentNote.body}
              onChange={(e) => setCurrentNote({ ...currentNote, body: e.target.value })}
            />
            <button onClick={handleUpdateNote}>Update Note</button>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
