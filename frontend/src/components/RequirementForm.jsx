// D:\AspireVmodel2\frontend\src\components\RequirementForm.jsx
import React, { useState, useEffect } from 'react';

function RequirementForm({ initialData = {}, onSave, isEditing = false, users = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FEATURE', // Valor padrão
    status: 'PENDING', // Valor padrão
    priority: 'MEDIUM', // Valor padrão
    assignedToUserId: '', // Ou null, dependendo de como você trata no backend
    projectName: '', // <--- NOVO: Adicione o campo projectName aqui
    ...initialData, // Sobrescreve com dados iniciais se estiver editando
  });

  // Atualiza o formulário se initialData mudar (útil para edição)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave && typeof onSave === 'function') { // Verifica se onSave é uma função
      onSave(formData);
    } else {
      console.error("Erro: 'onSave' prop não fornecida ou não é uma função em RequirementForm.");
      // Opcional: alertar o usuário ou mostrar uma mensagem de erro
    }
  };

  const formStyles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1em',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.form}>
      <div>
        <label htmlFor="title" style={formStyles.label}>Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={formStyles.input}
        />
      </div>
      <div>
        <label htmlFor="description" style={formStyles.label}>Descrição:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={formStyles.textarea}
        ></textarea>
      </div>

      {/* --- NOVO CAMPO PARA NOME DO PROJETO --- */}
      <div>
        <label htmlFor="projectName" style={formStyles.label}>Nome do Projeto:</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          required
          style={formStyles.input}
        />
      </div>
      {/* --- FIM DO NOVO CAMPO --- */}

      <div>
        <label htmlFor="type" style={formStyles.label}>Tipo:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          style={formStyles.select}
        >
          <option value="FEATURE">Funcionalidade (Feature)</option>
          <option value="BUG">Bug</option>
          <option value="TASK">Tarefa (Task)</option>
          <option value="IMPROVEMENT">Melhoria</option>
          <option value="SYS">Sistema</option>
          <option value="SWE">Software</option>
          <option value="FUNC">Funcional</option>
          <option value="NON_FUNC">Não Funcional</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" style={formStyles.label}>Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          style={formStyles.select}
        >
          <option value="PENDING">Pendente</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="COMPLETED">Concluído</option>
          <option value="BLOCKED">Bloqueado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" style={formStyles.label}>Prioridade:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
          style={formStyles.select}
        >
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>
      </div>
      <div>
        <label htmlFor="assignedToUserId" style={formStyles.label}>Atribuído a:</label>
        <select
          id="assignedToUserId"
          name="assignedToUserId"
          value={formData.assignedToUserId || ''}
          onChange={handleChange}
          style={formStyles.select}
        >
          <option value="">Não atribuído</option>
          {users.map(userOption => (
            <option key={userOption.id} value={userOption.id}>
              {userOption.username}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" style={formStyles.button}>
        {isEditing ? 'Atualizar Requisito' : 'Criar Requisito'}
      </button>
    </form>
  );
}

export default RequirementForm;