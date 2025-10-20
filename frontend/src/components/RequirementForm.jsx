// D:\AspireVmodel2\frontend\src\components\RequirementForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function RequirementForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('PENDING'); // Definindo um valor inicial padrão consistente com o DB
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchRequirement = async () => {
        try {
          const response = await api.get(`/api/requirements/${id}`);
          setTitle(response.data.title);
          setDescription(response.data.description);
          setType(response.data.type);
          setStatus(response.data.status);
        } catch (error) {
          setMessage('Erro ao carregar requisito para edição.');
          console.error('Erro ao carregar requisito:', error);
        }
      };
      fetchRequirement();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/api/requirements/${id}`, { title, description, type, status });
        setMessage('Requisito atualizado com sucesso!');
      } else {
        await api.post('/api/requirements', { title, description, type, status });
        setMessage('Requisito criado com sucesso!');
      }
      navigate('/requirements');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao salvar requisito.');
      console.error('Erro ao salvar requisito:', error);
    }
  };

  return (
    <div className="requirement-form-container">
      <h2>{id ? 'Editar Requisito' : 'Criar Novo Requisito'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="type">Tipo:</label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Selecione um status</option>
            {/* VALORES AJUSTADOS PARA CORRESPONDER À NOVA CONSTRAINT NO BANCO DE DADOS */}
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="COMPLETED">Concluído</option>
            <option value="BLOCKED">Bloqueado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
        <button type="submit">{id ? 'Atualizar' : 'Criar'}</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/requirements')}>Voltar para a Lista</button>
    </div>
  );
}

export default RequirementForm;