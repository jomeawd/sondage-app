import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [tab, setTab] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const login = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/sondages');
      } else {
        setError(data.message || 'Connexion impossible');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  const register = async () => {
    setError('');
    if (registerPassword !== registerConfirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, password: registerPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setError('');
        setTab(0); // bascule vers l'onglet login
      } else {
        setError(data.message || 'Inscription impossible');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  return (
    <Box
    sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
    }}
    >
  <Container maxWidth="sm">
    <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Bienvenue
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Connexion" />
          <Tab label="Créer un compte" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {tab === 0 && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={login}>
              Se connecter
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type="password"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={register}>
              S'inscrire
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
    </Box>
  );
}