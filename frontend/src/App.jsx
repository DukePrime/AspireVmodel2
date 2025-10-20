// D:\AspireVmodel2\frontend\src\App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import RegisterPage from './pages/RegisterPage'; // <-- CORREÇÃO AQUI! O CAMINHO E O NOME!
import Login from './components/Login'; // Mantém o nome Login, pois o arquivo é Login.jsx
import RequirementList from './components/RequirementList';
import RequirementForm from './components/RequirementForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider> {/* Opcional, se estiver usando AuthContext */}
      <Router>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Registrar</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/requirements">Requisitos</Link></li> {/* Novo link para os requisitos */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} /> {/* <-- USANDO O NOME CORRETO AQUI! */}
          <Route path="/login" element={<Login />} />

          {/* Rota para exibir a lista de requisitos */}
          <Route path="/requirements" element={
            <ProtectedRoute> {/* Opcional: Proteger a rota */}
              <RequirementList />
            </ProtectedRoute>
          } />

          {/* Rota para criar ou editar um requisito (se for o caso) */}
          <Route path="/requirements/new" element={
            <ProtectedRoute> {/* Opcional: Proteger a rota */}
              <RequirementForm />
            </ProtectedRoute>
          } />
          {/* Se você tiver rotas de edição, adicione algo como: */}
          <Route path="/requirements/edit/:id" element={
            <ProtectedRoute>
              <RequirementForm />
            </ProtectedRoute>
          } />

          {/* Rotas protegidas adicionais, se houver */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;