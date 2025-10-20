// D:\AspireVmodel2\frontend\src\components\RequirementForm.jsx (Código completo da resposta anterior)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequirementForm = ({ currentRequirement, onSave }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('FUNCIONAL'); // Valor inicial
    const [status, setStatus] = useState('PENDENTE'); // Valor inicial
    const [priority, setPriority] = useState('MEDIUM'); // Novo campo com valor inicial
    const [assignedToUserId, setAssignedToUserId] = useState(''); // Novo campo
    const [users, setUsers] = useState([]); // Para popular o dropdown de usuários

    useEffect(() => {
        if (currentRequirement) {
            // Se estiver editando um requisito existente
            setTitle(currentRequirement.title);
            setDescription(currentRequirement.description);
            setType(currentRequirement.type);
            setStatus(currentRequirement.status);
            setPriority(currentRequirement.priority || 'MEDIUM'); // Garante um valor padrão
            setAssignedToUserId(currentRequirement.assigned_to_user_id || '');
        } else {
            // Resetar o formulário se não houver requisito atual (para criar um novo)
            setTitle('');
            setDescription('');
            setType('FUNCIONAL');
            setStatus('PENDENTE');
            setPriority('MEDIUM');
            setAssignedToUserId('');
        }
        // Carregar a lista de usuários para o dropdown de "Atribuir a"
        fetchUsers();
    }, [currentRequirement]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/users', { // <-- Endpoint que estamos criando!
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Usuário não autenticado.');
            navigate('/login');
            return;
        }

        const requirementData = {
            title,
            description,
            type,
            status,
            priority,
            assignedToUserId: assignedToUserId ? parseInt(assignedToUserId) : null,
        };

        try {
            let response;
            if (currentRequirement) {
                response = await axios.put(`http://localhost:3001/api/requirements/${currentRequirement.id}`, requirementData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Requisito atualizado com sucesso!');
            } else {
                response = await axios.post('http://localhost:3001/api/requirements', requirementData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Requisito criado com sucesso!');
            }
            onSave(response.data);
            if (!currentRequirement) {
                setTitle('');
                setDescription('');
                setType('FUNCIONAL');
                setStatus('PENDENTE');
                setPriority('MEDIUM');
                setAssignedToUserId('');
            }
        } catch (error) {
            console.error('Erro ao salvar requisito:', error.response ? error.response.data : error.message);
            alert(`Erro ao salvar requisito: ${error.response ? (error.response.data.message || error.response.data) : error.message}`);
        }
    };

    const typeOptions = ['FUNCIONAL', 'NAO_FUNCIONAL', 'SEGURANCA', 'PERFORMANCE', 'USABILIDADE'];
    const statusOptions = ['PENDENTE', 'EM_PROGRESSO', 'CONCLUIDO', 'CANCELADO', 'AGUARDANDO_APROVACAO'];
    const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{currentRequirement ? 'Editar Requisito' : 'Criar Novo Requisito'}</h2>

            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Título:</label>
                <input
                    type="text"
                    id="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
                <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                ></textarea>
            </div>

            <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Tipo:</label>
                <select
                    id="type"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    {typeOptions.map(option => (
                        <option key={option} value={option}>{option.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <select
                    id="status"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    {statusOptions.map(option => (
                        <option key={option} value={option}>{option.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Prioridade:</label>
                <select
                    id="priority"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                >
                    {priorityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="assignedToUserId" className="block text-gray-700 text-sm font-bold mb-2">Atribuir a:</label>
                <select
                    id="assignedToUserId"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={assignedToUserId}
                    onChange={(e) => setAssignedToUserId(e.target.value)}
                >
                    <option value="">-- Selecione um usuário --</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username} ({user.email})</option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                {currentRequirement ? 'Atualizar Requisito' : 'Criar Requisito'}
            </button>
        </form>
    );
};

export default RequirementForm;