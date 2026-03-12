import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NoteModal from './NoteModal';
import SkeletonTableRow from '../../components/skeleton/SkeletonTableRow';

const NotesTab = ({ notes, loading, createOrUpdateNote, deleteNote }) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', class: '6th' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteFile, setNoteFile] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const [displayNotes, setDisplayNotes] = useState(notes || []);

  useEffect(() => {
    setDisplayNotes(notes || []);
  }, [notes]);

  const handleNoteFormChange = (e) => {
    setNoteForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNote = () => {
    setNoteForm({ title: '', content: '', class: '6th' });
    setNoteFile(null);
    setEditingNoteId(null);
    setShowNoteModal(true);
  };

  const handleEditNote = (note) => {
    setNoteForm({ title: note.title, content: note.content || '', class: note.class });
    setNoteFile(null);
    setEditingNoteId(note._id);
    setShowNoteModal(true);
  };

  const handleNoteFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setDisplayNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success('Note deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete note');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingNote(true);
      const data = await createOrUpdateNote(noteForm, noteFile, editingNoteId);
      const updatedNote = data?.note;

      if (updatedNote) {
        setDisplayNotes((prev) => {
          if (editingNoteId) {
            return prev.map((note) => (note._id === editingNoteId ? updatedNote : note));
          }
          return [updatedNote, ...prev];
        });
      }

      toast.success(editingNoteId ? 'Note updated' : 'Note added');
      setShowNoteModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="notes-section">
      <div className="section-header">
        <h3>Class Notes</h3>
        <button className="add-btn" onClick={handleAddNote}>Add Note</button>
      </div>
      {loading ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonTableRow key={`notes-skeleton-${index}`} />
              ))}
            </tbody>
          </table>
        </div>
      ) : displayNotes.length === 0 ? (
        <div>No notes available.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayNotes.map((note) => (
                <tr key={note._id}>
                  <td>{note.title}</td>
                  <td>{note.class}</td>
                  <td>
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${note.pdf.replace('\\', '/')}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEditNote(note)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSubmit={handleNoteSubmit}
        noteForm={noteForm}
        onFormChange={handleNoteFormChange}
        onFileChange={handleNoteFileChange}
        editingNoteId={editingNoteId}
        loading={loading || savingNote}
      />
    </div>
  );
};

export default React.memo(NotesTab);
