import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactModal from "./ContactModal";

const API_URL = "http://localhost:5000";

function App() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Fetch contacts
  const fetchContacts = () => {
    fetch(`${API_URL}/contacts`)
      .then(res => res.json())
      .then(data => setContacts(data.contacts))
      .catch(() => toast.error("Failed to fetch contacts"));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add or update contact
  const handleSave = (contact) => {
    const method = contact.id ? "PATCH" : "POST";
    const url = contact.id
      ? `${API_URL}/update-contact/${contact.id}`
      : `${API_URL}/create-contact`;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success(contact.id ? "Contact updated!" : "Contact added!");
          fetchContacts();
          setModalShow(false);
        } else {
          toast.error(data.error || "Operation failed");
        }
      })
      .catch(() => toast.error("Network error"));
  };

  // Delete contact
  const handleDelete = (id) => {
    if (!window.confirm("Delete this contact?")) return;
    fetch(`${API_URL}/delete-contact/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success("Contact deleted!");
          fetchContacts();
        } else {
          toast.error(data.error || "Delete failed");
        }
      })
      .catch(() => toast.error("Network error"));
  };

  // Filter contacts
  const filteredContacts = contacts.filter(
    c =>
      c.first_name.toLowerCase().includes(search.toLowerCase()) ||
      c.last_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Contact List</h1>
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Search contacts..."
        onChange={e => setSearch(e.target.value)}
      />
      {filteredContacts.length === 0 && (
        <div className="alert alert-info">No contacts found.</div>
      )}
      {filteredContacts.map(contact => (
        <div className="contact-card" key={contact.id}>
          <div>
            <strong>{contact.first_name} {contact.last_name}</strong><br />
            <small>{contact.email}</small>
          </div>
          <div className="contact-actions">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                setEditingContact(contact);
                setModalShow(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(contact.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <button
        className="add-btn mt-3"
        onClick={() => {
          setEditingContact(null);
          setModalShow(true);
        }}
      >
        Add Contact
      </button>
      <ContactModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onSave={handleSave}
        contact={editingContact}
      />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
