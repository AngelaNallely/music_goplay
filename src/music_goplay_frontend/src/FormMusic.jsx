import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap'; // Asegúrate de importar Card
import { music_goplay_backend } from 'declarations/music_goplay_backend';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const FormMusic = ({ id, pTitle, pArtist, pRating, isEditable, getMusics, setShow }) => {
  const [title, setTitle] = useState(pTitle || '');
  const [artist, setArtist] = useState(pArtist || '');
  const [rating, setRating] = useState(pRating || 0);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(pTitle || '');
    setArtist(pArtist || '');
    setRating(pRating || 0);
  }, [pTitle, pArtist, pRating]);

  function handleSubmit(event) {
    event.preventDefault();
    Swal.fire("Guardando la canción, por favor espere...");
    Swal.showLoading();

    if (isEditable) {
      music_goplay_backend.updateMusic(BigInt(id), title, "", artist, BigInt(rating)).then(() => {
        getMusics();
        setShow(false);
        Swal.close();
      });
    } else {
      music_goplay_backend.addMusic(BigInt(rating), title, "", artist).then(() => {
        getMusics();
        setShow(false);
        Swal.close();
      });
    }

    navigate('/');
  }

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formArtist">
            <Form.Label>Artista</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar artista"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingresar rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {isEditable ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormMusic;
  


