import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ContactModal({ show, onHide, onSave, contact }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setFirstName(contact ? contact.first_name : "");
    setLastName(contact ? contact.last_name : "");
    setEmail(contact ? contact.email : "");
  }, [contact, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!first_name || !last_name || !email) return;
    onSave({
      id: contact ? contact.id : undefined,
      first_name,
      last_name,
      email,
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{contact ? "Edit" : "Add"} Contact</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={first_name}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={last_name}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ContactModal;
