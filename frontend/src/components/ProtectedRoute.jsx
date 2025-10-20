// D:\AspireVmodel2\frontend\src\components\ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Certifique-se do caminho correto

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    // Usuário não autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  return children; // Usuário autenticado, renderiza o componente filho
}

export default ProtectedRoute;