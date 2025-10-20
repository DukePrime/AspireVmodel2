// AspireVmodel2/frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [protectedError, setProtectedError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    const fetchProtectedData = async () => {
        try {
            const response = await api.get('/protected');
            setProtectedData(response.data.message);
        } catch (error) {
            setProtectedError('Não foi possível carregar dados protegidos. Talvez o token tenha expirado.');
            console.error('Erro ao buscar dados protegidos:', error);
        }
    };

    if (user) {
        fetchProtectedData();
    }
  }, [user, loading, navigate, logout]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <h2>Bem-vindo, {user.username}! 🎉</h2>
          <p>Este é o seu Dashboard do AspireVmodel2.</p>
          <p>E-mail: {user.email}</p>

          <h3>Informações Protegidas:</h3>
          {protectedData ? (
              <p>{protectedData}</p>
          ) : (
              <p className="error-message">{protectedError || 'Carregando dados protegidos...'}</p>
          )}

          <h3>Resumo de Requisitos</h3>
          <p>Em breve, aqui você verá um resumo dos requisitos SYS e SWE, com filtros por status, fase, etc.</p>

          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <p>Você não está logado. Por favor, <Link to="/login">faça login</Link>.</p>
      )}
    </div>
  );
}

export default DashboardPage;