import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

export default function EditSondage() {
  const [titre, setTitre] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id: sondageId } = useParams();

  const token = localStorage.getItem('token');

  // Décodage JWT simple
  function parseJwt(token) {
    try {
      const base64Payload = token.split('.')[1];
      return JSON.parse(atob(base64Payload));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    if (!sondageId) {
      setMessage('Aucun sondage spécifié');
      setLoading(false);
      return;
    }
    chargerSondage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sondageId, token]);

  async function chargerSondage() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5001/api/sondages/${sondageId}`, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!res.ok) {
        setMessage('Erreur : Sondage introuvable.');
        setLoading(false);
        return;
      }

      const sondage = await res.json();

      const decoded = parseJwt(token);
      const currentUserId = decoded?.id;

      if (sondage.createur !== currentUserId) {
        setMessage("Vous n'êtes pas autorisé à modifier ce sondage.");
        setLoading(false);
        return;
      }

      setTitre(sondage.nom || '');
      setQuestions(sondage.questions || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage('Erreur serveur ou réseau.');
      setLoading(false);
    }
  }

  async function sauvegarder() {
    if (!titre.trim()) {
      alert('Le titre ne peut pas être vide.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/sondages/${sondageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ nom: titre.trim() }),
      });

      if (res.ok) {
        alert('Modifications enregistrées !');
        navigate('/sondages');
      } else {
        const err = await res.json();
        alert('Erreur : ' + (err.message || 'Impossible de modifier le sondage'));
      }
    } catch (err) {
      alert('Erreur serveur');
      console.error(err);
    }
  }

  function retour() {
    navigate('/sondages');
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color='black'>
        Modifier le sondage
      </Typography>

      {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

      {!message && !loading && (
        <>
          <TextField
            label="Titre"
            fullWidth
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            margin="normal"
          />

          <Typography variant="h6" sx={{ mt: 3, color: 'black' }}>
            Questions du sondage
          </Typography>

          {questions.length > 0 ? (
            <List>
              {questions.map((q, index) => (
                <ListItem key={index} sx={{color: 'black'}}>
                  {index + 1}. {q.text || 'Question sans titre'}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color='black'>Aucune question pour ce sondage.</Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" onClick={sauvegarder} sx={{ mr: 2 }}>
              Sauvegarder
            </Button>
            <Button variant="outlined" onClick={retour}>
              Annuler
            </Button>
          </Box>
        </>
      )}

      {loading && <Typography>Chargement...</Typography>}
    </Container>
  );
}