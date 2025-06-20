import React, { useState } from "react";

const EnquiryModal = ({ isOpen, onClose, onSubmit, programTitle }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false)
    await onSubmit({ ...form, program: programTitle });
    setSubmitting(false);
    setSuccess(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 8, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: "0 2px 16px rgba(0,0,0,0.2)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>&times;</button>
        <h2 style={{ marginBottom: 16 }}>Enquire about {programTitle}</h2>
        {success ? (
          <div style={{ color: "green", marginBottom: 16 }}>Thank you for your enquiry!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: 8, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: "100%", padding: 8, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={{ width: "100%", padding: 8, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} required style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 60 }} />
            </div>
            <button type="submit" disabled={submitting} style={{ width: "100%", padding: 10, background: "#2c5aa0", color: "#fff", border: "none", borderRadius: 4, fontWeight: 600, cursor: "pointer" }}>
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal; 