// D:\AspireVmodel2\frontend\src\components\RequirementList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate
import api from '../services/api';

function RequirementList() {
  const [requirements, setRequirements] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Inicialize useNavigate

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await api.get('/api/requirements');
        setRequirements(response.data);
      } catch (error) {
        setMessage('Erro ao buscar requisitos: ' + (error.response?.data?.message || error.message));
        console.error('Erro ao buscar requisitos:', error);
      }
    };

    fetchRequirements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/requirements/${id}`);
      setRequirements(requirements.filter(req => req.id !== id));
      setMessage('Requisito excluído com sucesso!');
    } catch (error) {
      setMessage('Erro ao excluir requisito.');
      console.error('Erro ao excluir requisito:', error);
    }
  };

  return (
    <div className="requirement-list-container">
      <h2>Lista de Requisitos</h2>
      {/* Botão para criar novo requisito */}
      <button onClick={() => navigate('/requirements/new')}>
        Criar Novo Requisito
      </button>

      {requirements.length === 0 ? (
        <p>Nenhum requisito encontrado. Crie um novo!</p>
      ) : (
        <ul>
          {requirements.map((req) => (
            <li key={req.id}>
              <h3>{req.title}</h3>
              <p>{req.description}</p>
              <button onClick={() => navigate(`/requirements/edit/${req.id}`)}>Editar</button>
              <button onClick={() => handleDelete(req.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default RequirementList;