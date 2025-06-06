import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function Questions() {
  const navigate = useNavigate();
  const { id: sondageId } = useParams();
  const token = localStorage.getItem('token');

  const [sondageTitre, setSondageTitre] = useState('');
  const [questions, setQuestions] = useState([]);
  const [createurId, setCreateurId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('ouverte');
  const [newQcmOptions, setNewQcmOptions] = useState(['', '']);

  const [editIndex, setEditIndex] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editQuestionType, setEditQuestionType] = useState('ouverte');
  const [editQcmOptions, setEditQcmOptions] = useState(['']);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    if (!token) {
      alert('Connectez-vous d’abord');
      navigate('/login');
      return;
    }

    const decoded = parseJwt(token);
    if (decoded?.id) {
      setCurrentUserId(decoded.id);
    }

    if (!sondageId) {
      alert('Aucun sondage spécifié');
      navigate('/sondages');
      return;
    }

    fetchQuestions();
  }, [sondageId]);

  function parseJwt(token) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  async function fetchQuestions() {
    try {
      const res = await fetch(`http://localhost:5001/api/sondages/${sondageId}`, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!res.ok) {
        alert('Erreur chargement sondage');
        return;
      }

      const data = await res.json();
      setSondageTitre(data.nom || '(Sans titre)');
      setQuestions(data.questions || []);
      setCreateurId(data.createur);
    } catch (e) {
      alert('Erreur réseau');
      console.error(e);
    }
  }

  async function saveQuestions(updatedQuestions) {
    try {
      const res = await fetch(`http://localhost:5001/api/sondages/${sondageId}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ questions: updatedQuestions }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert('Erreur sauvegarde : ' + (data.message || res.statusText));
        return false;
      }
      return true;
    } catch (e) {
      alert('Erreur réseau');
      console.error(e);
      return false;
    }
  }

  async function handleAddQuestion() {
    const text = newQuestionText.trim();
    if (!text) {
      alert('Le texte de la question est obligatoire');
      return;
    }

    const reponses = newQuestionType === 'qcm' ? newQcmOptions.filter(o => o.trim() !== '') : [];
    if (newQuestionType === 'qcm' && reponses.length < 2) {
      alert('Veuillez fournir au moins deux réponses pour un QCM');
      return;
    }

    const updatedQuestions = [...questions, { text, type: newQuestionType, reponses }];
    const success = await saveQuestions(updatedQuestions);
    if (success) {
      setQuestions(updatedQuestions);
      setNewQuestionText('');
      setNewQuestionType('ouverte');
      setNewQcmOptions(['', '']);
    }
  }

  function handleStartEdit(index) {
    const q = questions[index];
    setEditIndex(index);
    setEditQuestionText(q.text);
    setEditQuestionType(q.type);
    setEditQcmOptions(q.type === 'qcm' ? q.reponses : ['']);
    setOpenEditDialog(true);
  }

  async function handleUpdateQuestion() {
    const text = editQuestionText.trim();
    if (!text) {
      alert('Le texte de la question est obligatoire');
      return;
    }

    const reponses = editQuestionType === 'qcm' ? editQcmOptions.filter(o => o.trim() !== '') : [];
    if (editQuestionType === 'qcm' && reponses.length < 2) {
      alert('Veuillez fournir au moins deux réponses pour un QCM');
      return;
    }

    const updatedQuestions = [...questions];
    updatedQuestions[editIndex] = { text, type: editQuestionType, reponses };
    const success = await saveQuestions(updatedQuestions);
    if (success) {
      setQuestions(updatedQuestions);
      handleCloseEdit();
    }
  }

  function handleCloseEdit() {
    setOpenEditDialog(false);
    setEditIndex(null);
    setEditQuestionText('');
    setEditQuestionType('ouverte');
    setEditQcmOptions(['']);
  }

  async function handleDeleteQuestion(index) {
    if (!window.confirm('Voulez-vous vraiment supprimer cette question ?')) return;
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    const success = await saveQuestions(updatedQuestions);
    if (success) {
      setQuestions(updatedQuestions);
    }
  }

  function handleGoBack() {
    navigate('/sondages');
  }

  const isOwner = currentUserId && createurId && currentUserId === createurId;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={2} color="black">
        Questions du sondage
      </Typography>
      <Button variant="outlined" onClick={handleGoBack} sx={{ mb: 3 }}>
        Retour aux sondages
      </Button>

      <Typography variant="h5" mb={3} align="center" color="text.secondary">
        {sondageTitre}
      </Typography>

      {isOwner && (
        <Box component="section" mb={4}>
          <Typography variant="h6" gutterBottom color="black">
            Ajouter une question
          </Typography>
          <TextField
            label="Texte de la question"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Type de réponse</InputLabel>
            <Select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
              label="Type de réponse"
            >
              <MenuItem value="ouverte">Réponse ouverte</MenuItem>
              <MenuItem value="qcm">QCM (choix multiple)</MenuItem>
            </Select>
          </FormControl>

          {newQuestionType === 'qcm' && (
            <Box mt={2}>
              <Typography>Réponses possibles :</Typography>
              {newQcmOptions.map((option, idx) => (
                <TextField
                  key={idx}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQcmOptions];
                    newOptions[idx] = e.target.value;
                    setNewQcmOptions(newOptions);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  fullWidth
                  margin="dense"
                />
              ))}
              <Button onClick={() => setNewQcmOptions([...newQcmOptions, ''])}>Ajouter une option</Button>
            </Box>
          )}

          <Button variant="contained" onClick={handleAddQuestion} sx={{ mt: 2 }}>
            Ajouter la question
          </Button>
        </Box>
      )}

      <Box component="section">
        <Typography variant="h6" gutterBottom color="black">
          Liste des questions
        </Typography>

        {questions.length === 0 ? (
          <Typography>Aucune question pour le moment.</Typography>
        ) : (
          <List>
            {questions.map((q, i) => (
              <ListItem key={i} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2, color: 'black' }}>
                <ListItemText
                  primary={<strong>Q{i + 1} :</strong>}
                  secondary={`Type : ${q.type}`}
                />
                <Typography>{q.text}</Typography>
                {q.type === 'qcm' && (
                  <ul>
                    {q.reponses?.map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                )}
                {isOwner && (
                  <Stack direction="row" spacing={1} mt={1}>
                    <Button onClick={() => handleStartEdit(i)}>Modifier</Button>
                    <Button color="error" onClick={() => handleDeleteQuestion(i)}>Supprimer</Button>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Dialog open={openEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>Modifier la question</DialogTitle>
        <DialogContent>
          <TextField
            label="Texte"
            value={editQuestionText}
            onChange={(e) => setEditQuestionText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={editQuestionType}
              onChange={(e) => setEditQuestionType(e.target.value)}
              label="Type"
            >
              <MenuItem value="ouverte">Réponse ouverte</MenuItem>
              <MenuItem value="qcm">QCM (choix multiple)</MenuItem>
            </Select>
          </FormControl>
          {editQuestionType === 'qcm' && (
            <Box>
              <Typography>Réponses possibles :</Typography>
              {editQcmOptions.map((opt, idx) => (
                <TextField
                  key={idx}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...editQcmOptions];
                    newOpts[idx] = e.target.value;
                    setEditQcmOptions(newOpts);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  fullWidth
                  margin="dense"
                />
              ))}
              <Button onClick={() => setEditQcmOptions([...editQcmOptions, ''])}>Ajouter une option</Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Annuler</Button>
          <Button onClick={handleUpdateQuestion} variant="contained">Sauvegarder</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
