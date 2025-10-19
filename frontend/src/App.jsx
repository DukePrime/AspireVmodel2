// D:\AspireVmodel2\frontend\src\App.jsx

// Bloco: Importações de React, React Router e Componentes/Serviços
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import RequirementsPage from './pages/RequirementsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { checkAuth, logout } from './services/authService.js';

// IMPORTANTE: Importe o módulo CSS aqui!
import styles from './App.module.css';

// Bloco: Componente PrivateRoute para proteção de rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = checkAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Bloco: Componente principal da aplicação (App)
function App() {
  // Bloco: Estado para controle de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  // Bloco: useEffect para monitorar mudanças no localStorage (logout em outra aba, etc.)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(checkAuth());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Bloco: Função para lidar com sucesso no login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Bloco: Função para lidar com logout
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  // Bloco: Renderização da interface do usuário
  return (
    <Router>
      {/* ATUALIZADO: Usando classes do CSS Module */}
      <div className={styles.appContainer}>
        {/* Bloco: Barra de navegação condicional (mostrada apenas se autenticado) */}
        {isAuthenticated && (
          // ATUALIZADO: Usando classes do CSS Module
          <nav className={styles.navbar}>
            <h1 className={styles.navbarTitle}>AspireVmodel2</h1>
            <div>
              <button
                onClick={() => {
                  window.location.href = '/projects';
                }}
                className={styles.navButton} // ATUALIZADO
              >
                Projetos
              </button>
              <button
                onClick={handleLogout}
                className={styles.logoutButton} // ATUALIZADO
              >
                Logout
              </button>
            </div>
          </nav>
        )}
        {/* Bloco: Conteúdo principal com rotas */}
        {/* ATUALIZADO: Usando classes do CSS Module */}
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId/requirements"
              element={
                <PrivateRoute>
                  <RequirementsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            {/* Bloco: Rotas padrão/redirecionamento */}
            <Route path="/" element={<Navigate to="/projects" />} />
            <Route path="*" element={<Navigate to="/projects" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;