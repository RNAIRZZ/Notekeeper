import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Note from './Note';

function NotesGrid() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNotes = async () => {
      const q = query(
        collection(db, 'notes'),
        orderBy('pinned', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setNotes(notesData);
    };

    fetchNotes();
  }, [page]);

  const handlePin = (id) => {
    // logic to pin/unpin the note
  };

  return (
    <div>
      <div className="notes-grid">
        {notes.map(note => (
          <Note key={note.id} note={note} onPin={handlePin} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default NotesGrid;
