// D:\AspireVmodel2\frontend\src\pages\RequirementsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import requirementService from '../services/requirementService';

function RequirementsPage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [requirements, setRequirements] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'SYS',
        status: 'Draft',
        priority: 'Medium',
        assignedToUserId: '', // Futuramente será um dropdown com usuários
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingRequirements, setLoadingRequirements] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchRequirements = async () => {
            try {
                const data = await requirementService.getRequirements();
                setRequirements(data);
            } catch (err) {
                setError('Erro ao carregar requisitos.');
                console.error('Erro ao buscar requisitos:', err);
            } finally {
                setLoadingRequirements(false);
            }
        };

        if (user) { // Apenas busca se o usuário estiver logado
            fetchRequirements();
        }
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await requirementService.createRequirement(form);
            setSuccess('Requisito criado com sucesso!');
            // Limpa o formulário e recarrega os requisitos
            setForm({
                title: '',
                description: '',
                type: 'SYS',
                status: 'Draft',
                priority: 'Medium',
                assignedToUserId: '',
            });
            const updatedRequirements = await requirementService.getRequirements();
            setRequirements(updatedRequirements);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar requisito.');
            console.error('Erro ao criar requisito:', err);
        }
    };

    if (authLoading || loadingRequirements) {
        return <div>Carregando requisitos...</div>;
    }

    if (!user) {
        return <p>Você precisa estar logado para ver os requisitos.</p>;
    }

    return (
        <div>
            <h2>Gerenciamento de Requisitos</h2>

            <h3>Adicionar Novo Requisito</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label>Tipo:</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                        <option value="SYS">SYS (Sistema)</option>
                        <option value="SWE">SWE (Software)</option>
                        <option value="FUNC">Funcional</option>
                        <option value="NON_FUNC">Não Funcional</option>
                    </select>
                </div>
                <div>
                    <label>Status:</label>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="Draft">Rascunho</option>
                        <option value="Under Review">Em Revisão</option>
                        <option value="Approved">Aprovado</option>
                        <option value="Rejected">Rejeitado</option>
                        <option value="Implemented">Implementado</option>
                        <option value="Archived">Arquivado</option>
                    </select>
                </div>
                <div>
                    <label>Prioridade:</label>
                    <select name="priority" value={form.priority} onChange={handleChange}>
                        <option value="Low">Baixa</option>
                        <option value="Medium">Média</option>
                        <option value="High">Alta</option>
                        <option value="Critical">Crítica</option>
                    </select>
                </div>
                {/* Futuramente: campo para assignedToUserId */}
                <button type="submit">Criar Requisito</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>

            <h3>Lista de Requisitos</h3>
            {requirements.length === 0 ? (
                <p>Nenhum requisito encontrado. Crie um novo!</p>
            ) : (
                <ul>
                    {requirements.map((req) => (
                        <li key={req.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
                            <strong>{req.title}</strong> ({req.type}) - Prioridade: {req.priority}
                            <p>Status: {req.status}</p>
                            <p>{req.description}</p>
                            <small>Criado por: {req.created_by_username || 'Desconhecido'} em {new Date(req.created_at).toLocaleDateString()}</small><br/>
                            <small>Atribuído a: {req.assigned_to_username || 'Ninguém'}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RequirementsPage;