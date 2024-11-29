import React from 'react';

function Note({ note, onClick, onPin }) {
  return (
    <div className="note" onClick={() => onClick(note.id)}>
      <h2>{note.title}</h2>
      <p>{note.tagline}</p>
      <button onClick={(e) => { e.stopPropagation(); onPin(note.id) }}>
        {note.pinned ? "Unpin" : "Pin"}
      </button>
    </div>
  );
}

export default Note;
