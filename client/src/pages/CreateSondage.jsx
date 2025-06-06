import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateSondage() {
  const [titre, setTitre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // ou la route de ta page d'accueil
    }
  }, [navigate]);

  const creerSondage = async () => {
    setError('');
    const trimmedTitre = titre.trim();
    if (!trimmedTitre) {
      setError('Le titre est obligatoire.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/sondages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ nom: trimmedTitre }),
      });

      if (res.ok) {
        navigate('/sondages'); // redirige vers la liste des sondages
      } else {
        const err = await res.json();
        setError(err.message || 'Création échouée');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur serveur ou réseau');
    }
  };

  const retour = () => {
    navigate('/sondages');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Créer un nouveau sondage
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Titre du sondage"
          fullWidth
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          margin="normal"
          autoFocus
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" onClick={creerSondage}>
            Créer
          </Button>
          <Button variant="outlined" onClick={retour}>
            Annuler
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
