import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import { Delete, Edit, Logout, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Sondages() {
  const [sondages, setSondages] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchSondages();
    }
  }, []);

  const getUserIdFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const fetchSondages = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/sondages', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.status === 401) {
        alert('Session expirée, reconnectez-vous.');
        handleLogout();
        return;
      }
      const data = await res.json();
      setSondages(data);
    } catch (err) {
      alert('Erreur serveur');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce sondage ?')) return;
    try {
      await fetch(`http://localhost:5001/api/sondages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      fetchSondages();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const userId = getUserIdFromToken();

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h4" color='black'>Liste des sondages</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout} startIcon={<Logout />}>
          Déconnexion
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/create-sondage')}
        sx={{ mb: 3 }}
      >
        Créer un sondage
      </Button>

      <List>
        {sondages.map((s) => (
          <React.Fragment key={s._id}>
            <ListItem>
              <ListItemText
                primary={s.nom || '(Sans titre)'}
                secondary={s.createur?.nom || s.createur?.email || 'Auteur inconnu'}
                primaryTypographyProps={{ sx: { color: 'black' } }}
                secondaryTypographyProps={{ sx: { color: 'gray' } }}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => navigate(`/questions/${s._id}`)} title="Voir les réponses">
                  <Visibility />
                </IconButton>

                {s.createur && (s.createur._id === userId || s.createur === userId) && (
                  <>
                    <IconButton
                      edge="end"
                      title="Modifier"
                      onClick={() => navigate(`/edit-sondage/${s._id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" title="Supprimer" onClick={() => handleDelete(s._id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}