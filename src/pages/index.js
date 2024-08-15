import { useState, useEffect } from 'react';
import { Container, Button, Form, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('/api/notes');
      setNotes(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const addNote = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post('/api/notes', { title, body });
      setNotes([...notes, data]);
      setTitle('');
      setBody('');
    } catch (error) {
      console.log(error.response);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleClickDetail = (id) => {
    const note = notes.find(note => note.id === id);
    if (note) {
      setSelectedNote(note);
      setOpenModal(true);
    } else {
      console.log('Note not found');
    }
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setOpenModal(false);
  }

  const handleClickEdit = (id) => {
    const note = notes.find(note => note.id === id);
    if (note) {
      setTitle(note.title);
      setBody(note.body);
      setSelectedNote(note);
    } else {
      console.log('Note not found');
    }
  };

  const updateNote = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.put(`/api/notes/${selectedNote.id}`, { title, body });
      console.log(data);
      setNotes(notes.map(note => note.id === data.id ? data : note));
      setSelectedNote(null);
      setTitle('');
      setBody('');
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    console.log(selectedNote);
  }, [selectedNote]);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container className="mt-5">
      <h1>Note App By <span className="text-primary">Rosmalinda Marbun</span></h1>
      <Form onSubmit={selectedNote ? updateNote : addNote}>
        <Form.Group controlId="noteTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="noteBody" className="mt-3">
          <Form.Label>Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter note body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className={selectedNote ? 'disabled m-3' : 'm-3'}>
          Add Note
        </Button>    
            <Button variant="success" type="submit" className={selectedNote ? '' : 'disabled '}>
          Edit Note
        </Button>
      </Form>

      <Table striped bordered hover className="mt-5" responsive >
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render notes here */}
          {notes.length === 0 && <tr><td colSpan="4">Tidak ada catatan</td></tr>}
          {notes.map((note, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{note.title}</td>
              <td>{new Date(note.createdAt).toLocaleString()}</td>
              <td>{new Date(note.updatedAt).toLocaleString()}</td>
              <td className="d-grid g-2 d-md-block">
                <Button
                  variant="danger"
                  onClick={() => deleteNote(note.id)}
                  className="ms-md-2 mt-md-2 w-md-auto "
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  className="ms-md-2 mt-md-2 w-md-auto "
                  onClick={() => handleClickDetail(note.id)}
                >
                  Detail
                </Button> 
                <Button
                  variant="success"
                  className="ms-md-2 mt-md-2 w-md-auto "
                  onClick={() => handleClickEdit(note.id)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={openModal} onHide={handleCloseModal} className='text-dark'>
        <Modal.Header closeButton>
          <Modal.Title>Note Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='fw-bold '>Id: {selectedNote?.id}</p>
          <p>Title: {selectedNote?.title}</p>
          <p>Body: {selectedNote?.body}</p>
          <p>Created At: {new Date(selectedNote?.createdAt).toLocaleString()}</p>
          <p>Updated At: {new Date(selectedNote?.updatedAt).toLocaleString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
