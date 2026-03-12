import React from 'react';

const NoteModal = ({
  isOpen,
  onClose,
  onSubmit,
  noteForm,
  onFormChange,
  onFileChange,
  editingNoteId,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingNoteId ? 'Edit Note' : 'Add Note'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={noteForm.title} onChange={onFormChange} required />
            </div>
            <div className="form-group">
              <label>Class</label>
              <select name="class" value={noteForm.class} onChange={onFormChange} required>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Content</label>
              <textarea
                name="content"
                value={noteForm.content}
                onChange={onFormChange}
                required
                rows={4}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>PDF File</label>
              <input type="file" accept="application/pdf" onChange={onFileChange} required={!editingNoteId} />
            </div>
            <button type="submit" disabled={loading}>{editingNoteId ? 'Update Note' : 'Add Note'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoteModal);

