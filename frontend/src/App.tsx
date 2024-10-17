import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import VacanciesPage from './pages/vacanciesPage/VacanciesPage';
import CandidatesPage from './pages/candidatesPage/CandidatesPage';
import HomePage from './pages/homePage/HomePage';
import TasksPage from './pages/tasksPage/TasksPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;