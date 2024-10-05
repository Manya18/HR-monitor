import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import VacanciesPage from './pages/VacanciesPage';
import CandidatesPage from './pages/CandidatesPage';
import AnalisysPage from './pages/AnalisysPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<VacanciesPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/analisys" element={<AnalisysPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;