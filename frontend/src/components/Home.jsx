// D:\AspireVmodel2\frontend\src\components\Home.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importado useNavigate
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-basic-dist';
import CompanyLogo from '../assets/Selettra_Transparente.png'; 
function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Inicializado useNavigate
  
  // Estados para o dashboard do USUÁRIO logado
  const [myDashboardData, setMyDashboardData] = useState(null);
  const [myChartData, setMyChartData] = useState(null);

  // Estados para a VISÃO GERAL (todos os requisitos)
  const [overallDashboardData, setOverallDashboardData] = useState(null);
  const [overallChartData, setOverallChartData] = useState(null);
  const [allRequirements, setAllRequirements] = useState([]); // Lista de todos os requisitos

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOverallView, setShowOverallView] = useState(false); // Estado para alternar a visão

  // --- NOVOS ESTADOS PARA FILTROS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' ou um status específico
  const [filterType, setFilterType] = useState('ALL');   // 'ALL' ou um tipo específico

  // Mapeamento dos status do banco de dados para nomes amigáveis em português
  const STATUS_LABELS = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em Progresso',
    COMPLETED: 'Concluído',
    BLOCKED: 'Bloqueado',
    CANCELLED: 'Cancelado',
    // Adicione outros status se houver, alinhados com o backend
  };

  // Mapeamento dos tipos de requisitos para nomes amigáveis em português
  const TYPE_LABELS = {
    FEATURE: 'Funcionalidade',
    BUG: 'Bug',
    TASK: 'Tarefa',
    IMPROVEMENT: 'Melhoria',
    SYS: 'Sistema',
    SWE: 'Software',
    FUNC: 'Funcional',
    NON_FUNC: 'Não Funcional',
    // Adicione outros tipos se houver
  };

  const statusColors = {
    'PENDING': '#FFC107', // Amarelo para Pendente
    'IN_PROGRESS': '#17A2B8', // Azul claro para Em Progresso
    'COMPLETED': '#28A745', // Verde para Concluído
    'BLOCKED': '#DC3545', // Vermelho para Bloqueado
    'CANCELLED': '#6C757D', // Cinza para Cancelado
  };

  // Função para processar os dados do dashboard (cria o objeto para o Plotly)
  const processChartData = (data, titleSuffix) => {
    const labels = [];
    const values = [];
    const colors = [];

    let hasChartData = false;
    Object.keys(data.statusCounts).forEach(statusKey => {
      if (data.statusCounts[statusKey] > 0) {
        labels.push(STATUS_LABELS[statusKey] || statusKey);
        values.push(data.statusCounts[statusKey]);
        colors.push(statusColors[statusKey] || '#6c757d');
        hasChartData = true;
      }
    });

    if (hasChartData) {
      const plotlyData = [
        {
          labels: labels,
          values: values,
          type: 'pie',
          marker: { colors: colors },
          hoverinfo: 'label+percent',
          textinfo: 'percent',
          hole: .4
        },
      ];

      const plotlyLayout = {
        title: `Distribuição de Requisitos por Status ${titleSuffix}`,
        height: 400,
        width: 500,
        margin: { t: 50, b: 50, l: 50, r: 50 },
        showlegend: true
      };
      return { data: plotlyData, layout: plotlyLayout };
    }
    return null;
  };

  // --- Função para buscar os dados do dashboard do USUÁRIO LOGADO ---
  const fetchMyDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/requirements/dashboard-summary');
      const data = response.data;
      setMyDashboardData(data);
      setMyChartData(processChartData(data, '(Meus)'));
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard do usuário:', err);
      setError('Erro ao carregar dados do seu dashboard. Verifique o console.');
      setMyDashboardData(null);
      setMyChartData(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // --- Função para buscar os dados da VISÃO GERAL ---
  const fetchOverallData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Busca o resumo geral
      const summaryResponse = await api.get('/api/requirements/dashboard-summary-all');
      const summaryData = summaryResponse.data;
      setOverallDashboardData(summaryData);
      setOverallChartData(processChartData(summaryData, '(Geral)'));

      // Busca todos os requisitos
      const allRequirementsResponse = await api.get('/api/requirements/all');
      setAllRequirements(allRequirementsResponse.data);

    } catch (err) {
      console.error('Erro ao carregar dados da visão geral:', err);
      setError('Erro ao carregar dados da visão geral. Verifique o console.');
      setOverallDashboardData(null);
      setOverallChartData(null);
      setAllRequirements([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Efeito para buscar os dados do dashboard do usuário quando autenticado e não na visão geral
  useEffect(() => {
    if (isAuthenticated && !showOverallView) {
      fetchMyDashboardData();
    }
  }, [isAuthenticated, showOverallView, fetchMyDashboardData]);

  // Efeito para buscar os dados da visão geral quando autenticado e na visão geral
  useEffect(() => {
    if (isAuthenticated && showOverallView) {
      fetchOverallData();
    }
  }, [isAuthenticated, showOverallView, fetchOverallData]);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredRequirements = useMemo(() => {
    if (!allRequirements) return [];

    let currentFiltered = allRequirements;

    // 1. Filtrar por termo de busca (título, descrição, criador, atribuído)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(req =>
        (req.title && req.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (req.description && req.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (req.created_by_username && req.created_by_username.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (req.assigned_to_username && req.assigned_to_username.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // 2. Filtrar por status
    if (filterStatus !== 'ALL') {
      currentFiltered = currentFiltered.filter(req => req.status === filterStatus);
    }

    // 3. Filtrar por tipo
    if (filterType !== 'ALL') {
      currentFiltered = currentFiltered.filter(req => req.type === filterType);
    }

    return currentFiltered;
  }, [allRequirements, searchTerm, filterStatus, filterType]);


  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Bem-vindo(a) à sua Plataforma de Gerenciamento!</h1>
         <img src={CompanyLogo} alt="Logo da Empresa" style={styles.companyLogo} /> 
        <p style={styles.subHeading}>Sua ferramenta essencial para organizar e acompanhar requisitos.</p>
        <div style={styles.buttonContainer}>
          <Link to="/login" style={styles.button}>
            Fazer Login 
          </Link>
          <Link to="/register" style={styles.button}>
            Registrar-se 
          </Link>
        </div>
        <p style={styles.infoText}>Comece a gerenciar seus projetos de automação agora mesmo!</p>
      </div>
    );
  }

  // Renderização principal para usuário autenticado
  return (
    <div style={styles.container}>
      {user && (
        <h1 style={styles.heading}>Bem-vindo(a), {user.username}!</h1> 
      )}
      
      <div style={styles.toggleButtonContainer}>
        <button 
          onClick={() => setShowOverallView(false)} 
          style={showOverallView ? styles.toggleButtonInactive : styles.toggleButtonActive}
        >
          Meu Dashboard
        </button>
        <button 
          onClick={() => setShowOverallView(true)} 
          style={showOverallView ? styles.toggleButtonActive : styles.toggleButtonInactive}
        >
          Visão Geral
        </button>
      </div>

      <p style={styles.subHeading}>
        Visão geral {showOverallView ? 'de todos os requisitos' : 'dos seus requisitos'}:
      </p>

      {loading ? (
        <p>Carregando dados do dashboard...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {showOverallView ? ( // Conteúdo da Visão Geral
            <>
              {overallDashboardData ? (
                <>
                  <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                      <h3>Total de Requisitos (Geral)</h3>
                      <p>{overallDashboardData.totalRequirements}</p>
                    </div>
                    {Object.keys(overallDashboardData.statusCounts).map(statusKey => (
                      <div key={statusKey} style={styles.statCard}>
                        <h3>{STATUS_LABELS[statusKey] || statusKey}</h3>
                        <p>{overallDashboardData.statusCounts[statusKey]}</p>
                      </div>
                    ))}
                  </div>

                  <h2 style={styles.sectionHeading}>Distribuição por Status (Geral)</h2>
                  <div style={styles.chartContainer}>
                    {overallChartData && overallChartData.data.length > 0 ? (
                      <Plot
                        data={overallChartData.data}
                        layout={overallChartData.layout}
                        config={{ responsive: true, displayModeBar: true, displaylogo: false }}
                        plotly={Plotly} 
                      />
                    ) : (
                      <p>Não há dados suficientes ou requisitos para gerar o gráfico de pizza geral.</p>
                    )}
                  </div>
                  
                  <h2 style={styles.sectionHeading}>Todos os Requisitos</h2>
                  
                  {/* --- CAMPOS DE FILTRO AQUI --- */}
                  <div style={styles.filterContainer}>
                      <input
                          type="text"
                          placeholder="Buscar por título, descrição, criador, atribuído..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={styles.filterInput}
                      />
                      <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          style={styles.filterSelect}
                      >
                          <option value="ALL">Todos os Status</option>
                          {Object.keys(STATUS_LABELS).map(statusKey => (
                              <option key={statusKey} value={statusKey}>{STATUS_LABELS[statusKey]}</option>
                          ))}
                      </select>
                      <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          style={styles.filterSelect}
                      >
                          <option value="ALL">Todos os Tipos</option>
                          {Object.keys(TYPE_LABELS).map(typeKey => (
                              <option key={typeKey} value={typeKey}>{TYPE_LABELS[typeKey]}</option>
                          ))}
                      </select>
                  </div>
                  {/* --- FIM DOS CAMPOS DE FILTRO --- */}

                  {filteredRequirements.length > 0 ? ( // Renderiza os requisitos FILTRADOS
                    <div style={styles.tableWrapper}> {/* Reutilizando tableWrapper para scroll */}
                      <table style={styles.table}>
                          <thead style={styles.tableHeader}>
                              <tr>
                                  <th style={styles.th}>ID</th>
                                  <th style={styles.th}>Título</th>
                                  <th style={styles.th}>Tipo</th>
                                  <th style={styles.th}>Status</th>
                                  <th style={styles.th}>Prioridade</th>
                                  <th style={styles.th}>Criado Por</th>
                                  <th style={styles.th}>Atribuído A</th>
                                  <th style={styles.th}>Criado Em</th>
                                  {/* Sem coluna de Ações aqui, já que é uma visão geral */}
                              </tr>
                          </thead>
                          <tbody>
                              {filteredRequirements.map(req => (
                                  <tr key={req.id} style={styles.tableRow}>
                                      <td style={styles.td}>{req.id}</td>
                                      <td style={styles.td}>{req.title}</td>
                                      <td style={styles.td}>{TYPE_LABELS[req.type] || req.type}</td>
                                      <td style={styles.td}>
                                        <span style={{ color: statusColors[req.status] || '#6c757d', fontWeight: 'bold' }}>
                                          {STATUS_LABELS[req.status] || req.status}
                                        </span>
                                      </td>
                                      <td style={styles.td}>{req.priority || 'N/A'}</td>
                                      <td style={styles.td}>{req.created_by_username || 'N/A'}</td>
                                      <td style={styles.td}>{req.assigned_to_username || 'N/A'}</td>
                                      <td style={styles.td}>{new Date(req.created_at).toLocaleDateString()}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Nenhum requisito encontrado com os filtros aplicados.</p>
                  )}

                </>
              ) : (
                <p>Nenhum dado da visão geral disponível.</p>
              )}
            </>
          ) : ( // Conteúdo do Meu Dashboard
            <>
              {myDashboardData ? (
                <>
                  <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                      <h3>Total de Requisitos (Meus)</h3>
                      <p>{myDashboardData.totalRequirements}</p>
                    </div>
                    {Object.keys(myDashboardData.statusCounts).map(statusKey => (
                      <div key={statusKey} style={styles.statCard}>
                        <h3>{STATUS_LABELS[statusKey] || statusKey}</h3>
                        <p>{myDashboardData.statusCounts[statusKey]}</p>
                      </div>
                    ))}
                  </div>

                  <h2 style={styles.sectionHeading}>Distribuição por Status (Meus)</h2>
                  <div style={styles.chartContainer}>
                    {myChartData && myChartData.data.length > 0 ? (
                      <Plot
                        data={myChartData.data}
                        layout={myChartData.layout}
                        config={{ responsive: true, displayModeBar: true, displaylogo: false }}
                        plotly={Plotly} 
                      />
                    ) : (
                      <p>Não há dados suficientes ou requisitos para gerar o gráfico de pizza.</p>
                    )}
                  </div>

                  <div style={styles.buttonContainer}>
                    <Link to="/requirements" style={styles.button}>
                      Ver Todos os Meus Requisitos 📋
                    </Link>
                    <Link to="/requirements/new" style={styles.button}>
                      Criar Novo Requisito ✨
                    </Link>
                  </div>
                </>
              ) : (
                <p>Nenhum dado do seu dashboard disponível.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// Estilos (mantidos e adaptados do último Home.jsx e RequirementList.jsx)
const styles = {

  companyLogo: {
    maxWidth: '300px', // Ajuste o tamanho máximo da largura do seu logo
    height: 'auto',    // Mantém a proporção
    marginBottom: '30px', // Espaço abaixo do logo
  },



  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '20px auto',
    maxWidth: '1400px', // Aumentado para acomodar a tabela
  },
  heading: {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '1.2em',
    color: '#666',
    marginBottom: '30px',
  },
  toggleButtonContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  toggleButtonActive: {
    padding: '10px 20px',
    fontSize: '1em',
    backgroundColor: '#95130a',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  toggleButtonInactive: {
    padding: '10px 20px',
    fontSize: '1em',
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    width: '100%',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center',
    borderLeft: '5px solid #95130a',
  },
  sectionHeading: {
    fontSize: '1.8em',
    color: '#333',
    marginBottom: '20px',
    width: '100%',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    textAlign: 'left',
  },
  chartContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  filterContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterInput: {
    padding: '10px 15px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '1em',
    flex: '1',
    minWidth: '500px',
  },
  filterSelect: {
    padding: '10px 15px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '1em',
    backgroundColor: '#fff',
    flex: '0 1 auto', 
    minWidth: '100px', 
  },
  // --- ESTILOS DA TABELA (REAPROVEITADOS DO RequirementList.jsx) ---
  tableWrapper: {
    overflowX: 'auto', // Permite scroll horizontal em telas menores
    width: '100%',
    marginBottom: '40px', // Adicionado um margin-bottom
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '0 auto',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    backgroundColor: '#95130a',
    color: '#fff',
    textAlign: 'left',
  },
  th: {
    padding: '12px 15px',
    borderBottom: '1px solid #dee2e6',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
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
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '30px',
    marginTop: '20px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.1em',
    color: '#fff',
    backgroundColor: '#95130a',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  },
  infoText: {
    fontSize: '1em',
    color: '#888',
  }
  
};

export default Home;