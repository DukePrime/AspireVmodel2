// D:\AspireVmodel2\frontend\src\pages\NewRequirement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RequirementForm from '../components/RequirementForm';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function NewRequirement() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // --- CORREÇÃO AQUI: REVERTER PARA /api/users ---
        const response = await api.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const handleSaveRequirement = async (requirementData) => {
    try {
      await api.post('/api/requirements', requirementData);
      alert('Requisito criado com sucesso!');
      navigate('/requirements');
    } catch (error) {
      console.error('Erro ao criar requisito:', error);
      alert('Erro ao criar requisito. Verifique o console para mais detalhes.');
    }
  };

  const stableInitialData = useMemo(() => ({}), []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Criar Novo Requisito</h2>
      <RequirementForm 
        onSave={handleSaveRequirement} 
        users={users} 
        initialData={stableInitialData} 
      />
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333',
  },
};

export default NewRequirement;