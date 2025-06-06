import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Sondages from './pages/Sondages';
import CreateSondage from './pages/CreateSondage';
import Questions from './pages/Question';
import EditSondage from './pages/EditSondage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sondages" element={<Sondages />} />
        <Route path="/create-sondage" element={<CreateSondage />} />
        <Route path="/questions/:id" element={<Questions />} />
        <Route path="/edit-sondage/:id" element={<EditSondage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
