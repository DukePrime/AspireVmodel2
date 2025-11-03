import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Usando diretamente o 'api' aqui, como no Home.jsx

function RequirementList() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mapeamento de status para exibir nomes amigáveis (com base nos status do backend)
    const STATUS_LABELS = {
      PENDING: 'Pendente',
      IN_PROGRESS: 'Em Progresso',
      COMPLETED: 'Concluído',
      BLOCKED: 'Bloqueado',
      CANCELLED: 'Cancelado',
      // Se houver status como "Draft", "Under Review" no seu DB, adicione-os aqui para exibição:
      // Draft: 'Rascunho',
      // 'Under Review': 'Em Revisão',
      // Approved: 'Aprovado',
      // Rejected: 'Rejeitado',
      // Implemented: 'Implementado',
      // Archived: 'Arquivado',
    };

    const statusColors = {
      'PENDING': '#FFC107', // Amarelo para Pendente
      'IN_PROGRESS': '#17A2B8', // Azul claro para Em Progresso
      'COMPLETED': '#28A745', // Verde para Concluído
      'BLOCKED': '#DC3545', // Vermelho para Bloqueado
      'CANCELLED': '#6C757D', // Cinza para Cancelado
    };

    // Mapeamento dos tipos de requisitos para nomes amigáveis em português
    const TYPE_LABELS = {
      FEATURE: 'Funcionalidade',
      BUG: 'Bug',
      TASK: 'Tarefa',
      IMPROVEMENT: 'Melhoria',
      SYS: 'Sistema', // Adicionado do seu RequirementsPage anterior
      SWE: 'Software', // Adicionado do seu RequirementsPage anterior
      FUNC: 'Funcional', // Adicionado do seu RequirementsPage anterior
      NON_FUNC: 'Não Funcional', // Adicionado do seu RequirementsPage anterior
      // Adicione outros tipos se houver
    };

    const fetchRequirements = useCallback(async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const response = await api.get('/api/requirements'); // Chamada para /api/requirements para obter os do usuário logado
            setRequirements(response.data);
            setError(null);
        } catch (err) {
            console.error('Erro ao buscar requisitos:', err);
            setError('Erro ao carregar seus requisitos. Por favor, tente novamente.');
            setRequirements([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        fetchRequirements();
    }, [fetchRequirements]);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza de que deseja excluir este requisito?')) {
            try {
                await api.delete(`/api/requirements/${id}`);
                fetchRequirements(); // Recarrega a lista após a exclusão
            } catch (err) {
                console.error('Erro ao excluir requisito:', err);
                alert('Erro ao excluir requisito. Por favor, tente novamente.');
            }
        }
    };

    if (!isAuthenticated) {
        return <p style={styles.message}>Você precisa estar logado para ver esta página.</p>;
    }

    if (loading) {
        return <p style={styles.message}>Carregando requisitos...</p>;
    }

    if (error) {
        return <p style={{...styles.message, color: 'red'}}>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Meus Requisitos</h1>
            <div style={styles.buttonContainer}>
                <Link to="/requirements/new" style={styles.button}>
                    Criar Novo Requisito ✨
                </Link>
            </div>

            {requirements.length === 0 ? (
                <p style={styles.message}>Você ainda não tem nenhum requisito cadastrado.</p>
            ) : (
                <div style={styles.tableWrapper}> {/* Adicionado para lidar com scroll horizontal */}
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Nome do Projeto</th>
                                <th style={styles.th}>Título</th>
                                <th style={styles.th}>Tipo</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Prioridade</th>
                                <th style={styles.th}>Criado Por</th>
                                <th style={styles.th}>Atribuído A</th>
                                <th style={styles.th}>Criado Em</th>
                                <th style={styles.th}>Ações</th>
                            </tr>
                        </thead>
                       <tbody>
    {requirements.map((req) => (
        <tr key={req.id} style={styles.tableRow}>
            <td style={styles.td}>{req.id}</td>{/*
            */}<td style={styles.td}>{req.project_name || 'N/A'}</td>{/*
            */}<td style={styles.td}>{req.title}</td>{/*
            */}<td style={styles.td}>{TYPE_LABELS[req.type] || req.type}</td>{/*
            */}<td style={styles.td}>
              <span style={{ color: statusColors[req.status] || '#6c757d', fontWeight: 'bold' }}>
                {STATUS_LABELS[req.status] || req.status}
              </span>
            </td>{/*
            */}<td style={styles.td}>{req.priority || 'N/A'}</td>{/*
            */}<td style={styles.td}>{req.created_by_username || 'N/A'}</td>{/*
            */}<td style={styles.td}>{req.assigned_to_username || 'N/A'}</td>{/*
            */}<td style={styles.td}>{new Date(req.created_at).toLocaleDateString()}</td>{/*
            */}<td style={styles.tdActions}>
                <Link to={`/requirements/edit/${req.id}`} style={{...styles.actionButton, ...styles.editButton}}>
                    Editar
                </Link>{/* */} {/* Este também era um ponto de atenção anterior */}
                <button onClick={() => handleDelete(req.id)} style={{...styles.actionButton, ...styles.deleteButton}}>
                    Excluir
                </button>
            </td>
        </tr>
    ))}
</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1400px', // Aumentado para acomodar a tabela larga
        margin: '20px auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2.5em',
        color: '#333',
        marginBottom: '20px',
    },
    message: {
        fontSize: '1.2em',
        color: '#666',
        marginTop: '20px',
    },
    buttonContainer: {
        marginBottom: '30px',
        textAlign: 'right', // Alinhar o botão de criar à direita
        paddingRight: '10px',
    },
    button: {
        padding: '12px 25px',
        fontSize: '1em',
        color: '#fff',
        backgroundColor: '#95130A',
        borderRadius: '5px',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    // --- ESTILOS DA TABELA ---
    tableWrapper: {
        overflowX: 'auto', // Permite scroll horizontal em telas menores
        width: '100%',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0 auto',
        borderRadius: '8px',
        overflow: 'hidden', // Para bordas arredondadas funcionarem com collapse
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    tableHeader: {
        backgroundColor: '#95130A',
        color: '#fff',
        textAlign: 'left',
    },
    th: {
        padding: '12px 15px',
        borderBottom: '1px solid #dee2e6',
        fontWeight: 'bold',
        whiteSpace: 'nowrap', // Impede que o texto do cabeçalho quebre
    },
    tableRow: {
        borderBottom: '1px solid #e9ecef',
    },
    tableRowHover: {
        backgroundColor: '#f8f9fa',
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid #dee2e6',
        textAlign: 'left',
        verticalAlign: 'middle',
    },
    tdActions: {
        padding: '12px 15px',
        borderBottom: '1px solid #dee2e6',
        textAlign: 'center',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap', // Mantém botões na mesma linha
    },
    actionButton: {
        padding: '8px 12px',
        margin: '0 5px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '0.9em',
        textDecoration: 'none', // Para Link e Button
        display: 'inline-block',
    },
    editButton: {
        backgroundColor: '#17a2b8',
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
    },
};

export default RequirementList;