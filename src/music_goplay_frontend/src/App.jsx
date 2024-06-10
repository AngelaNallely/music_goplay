import React, { useEffect, useState } from 'react';
import { music_goplay_backend } from 'declarations/music_goplay_backend';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FormMusic from './FormMusic';

function App() {
  const [musics, setMusics] = useState([]);
  const [music, setMusic] = useState({});
  const [show, setShow] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getMusics();
  }, []);

  function getMusics() {
    Swal.fire("Cargando canciones, por favor espere...");
    Swal.showLoading();
    music_goplay_backend.getMusics().then(musics => { 
      setMusics(musics);
      Swal.close();
    });
  }

  const handleCloseModal = () => {
    setShow(false);
    setMusic({});
    setSelectedMusicId(null);
  };

  const handleEditMusic = (id) => {
    const selectedMusic = musics.find(music => music.id === id);
    setMusic(selectedMusic);
    setSelectedMusicId(id);
    setShow(true);
  };

  const handleDeleteMusic = async (id) => {
    Swal.fire("Eliminando la canción, por favor espere...");
    Swal.showLoading();
    try {
      await music_goplay_backend.deleteMusic(BigInt(id));
      getMusics();
      Swal.close();
    } catch (error) {
      Swal.fire("Error", "Hubo un error al eliminar la canción", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire("Guardando cambios, por favor espere...");
    Swal.showLoading();
    try {
      if (selectedMusicId) {
        await music_goplay_backend.updateMusic(
          BigInt(selectedMusicId),
          music.title,
          "",
          music.artist,
          BigInt(music.rating)
        );
      } else {
        await music_goplay_backend.addMusic(
          BigInt(music.rating),
          music.title,
          "",
          music.artist
        );
      }
      getMusics();
      setShow(false);
      Swal.close();
    } catch (error) {
      Swal.fire("Error", "Hubo un error al guardar los cambios", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMusic(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Container fluid>
      <Row className='m-5'>
        <Card>
          <Card.Body>
            <Row className='m-3'>
              <Col>
                <Card.Title>Lista de canciones</Card.Title>
              </Col>
              <Col>
                <Button variant="success" onClick={() => setShow(true)}>Agregar Canción</Button>
              </Col> 
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Artista</th>
                  <th>Rating</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  musics.map((music, index) => (
                    <tr key={index}>
                      <td>{Number(music.id)}</td>
                      <td>{music.title}</td>
                      <td>{music.artist}</td>
                      <td>{Number(music.rating)}</td>
                      <td>
                        <Button variant="info" onClick={() => handleEditMusic(music.id)}>Editar</Button>{' '}
                        <Button variant="danger" onClick={() => handleDeleteMusic(music.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMusicId ? "Editar Canción" : "Agregar Canción"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={music.title || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formArtist">
              <Form.Label>Artista</Form.Label>
              <Form.Control
                type="text"
                name="artist"
                value={music.artist || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={music.rating || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedMusicId ? "Guardar" : "Agregar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;


