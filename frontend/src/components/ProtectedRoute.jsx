// D:\AspireVmodel2\frontend\src\components\ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- CORREÇÃO AQUI: Importar 'useAuth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // <--- CORREÇÃO AQUI: Usar o hook 'useAuth'

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  return children; // Renderiza os componentes filhos se estiver autenticado
};

export default ProtectedRoute;