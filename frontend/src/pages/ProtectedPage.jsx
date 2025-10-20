// AspireVmodel2/frontend/src/pages/ProtectedPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ProtectedPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    const fetchProtectedMessage = async () => {
      try {
        const response = await api.get('/protected');
        setMessage(response.data.message);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao acessar conteúdo protegido.');
        console.error("Erro ao buscar rota protegida:", err);
      }
    };

    if (user) {
        fetchProtectedMessage();
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>Página Protegida</h2>
      {message ? <p>{message}</p> : <p className="error-message">{error}</p>}
      <p>Apenas usuários autenticados podem ver esta página.</p>
    </div>
  );
}

export default ProtectedPage;