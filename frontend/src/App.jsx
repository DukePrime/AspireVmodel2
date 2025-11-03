// D:\AspireVmodel2\frontend\src\App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import RegisterPage from './pages/RegisterPage';
import Login from './components/Login';
import RequirementList from './components/RequirementList';
// IMPORTAR O COMPONENTE DE PÁGINA PARA CRIAÇÃO DE REQUISITO
import NewRequirement from './pages/NewRequirement'; // <--- ESTE É O COMPONENTE QUE WRAPPA O FORM E LIDA COM O onSave!
// Importar o componente de página para edição de requisito (se você for criar um)
// import EditRequirement from './pages/EditRequirement'; 

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Navbar from './components/Navbar'; // Exemplo de Navbar, se você quiser centralizar seus links

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Você pode usar um componente Navbar para centralizar seus links, ou manter assim */}
        <Navbar /> {/* Preferência: usar um componente Navbar para os links */}
        {/*
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Registrar</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/requirements">Requisitos</Link></li>
            <li><Link to="/requirements/new">Novo Requisito</Link></li> // Adicionando link para Novo Requisito
          </ul>
        </nav>
        */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />

          {/* Rota para exibir a lista de requisitos */}
          <Route path="/requirements" element={
            <ProtectedRoute>
              <RequirementList />
            </ProtectedRoute>
          } />

          {/* Rota para criar um novo requisito - AGORA USANDO A PÁGINA NewRequirement */}
          <Route path="/requirements/new" element={
            <ProtectedRoute>
              <NewRequirement /> {/* <--- AQUI A MUDANÇA PRINCIPAL! */}
            </ProtectedRoute>
          } />
          
          {/* Rota para editar um requisito específico */}
          {/* Se você criar uma página EditRequirement, ela receberá o ID via useParams */}
          {/* Exemplo: <Route path="/requirements/edit/:id" element={<ProtectedRoute><EditRequirement /></ProtectedRoute>} /> */}

          {/* Rota de fallback para 404 */}
          <Route path="*" element={<h2>404 - Página Não Encontrada</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;