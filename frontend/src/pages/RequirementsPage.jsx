import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createRequirement, getRequirements, updateRequirement } from '../services/api';
import RequirementCard from '../components/RequirementCard';

function RequirementsPage() {
  const { projectId } = useParams();
  const [requirements, setRequirements] = useState([]);
  const [newRequirementTitle, setNewRequirementTitle] = useState('');
  const [newRequirementDescription, setNewRequirementDescription] = useState('');
  const [newRequirementType, setNewRequirementType] = useState('SYS'); // 'SYS' ou 'SWE'
  const [newRequirementProcessStep, setNewRequirementProcessStep] = useState('SYS_1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sysSteps = ['SYS_1','SYS_2','SYS_3','SYS_4','SYS_5'];
  const sweSteps = ['SWE_1','SWE_2','SWE_3','SWE_4','SWE_5','SWE_6'];

  useEffect(() => {
    fetchRequirements();
  }, [projectId]);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const data = await getRequirements(projectId);
      setRequirements(data);
    } catch (err) {
      setError('Falha ao carregar requisitos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequirement = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createRequirement(
        projectId,
        newRequirementTitle,
        newRequirementDescription,
        newRequirementType,
        newRequirementProcessStep
      );
      setNewRequirementTitle('');
      setNewRequirementDescription('');
      setNewRequirementType('SYS');
      setNewRequirementProcessStep('SYS_1');
      fetchRequirements();
    } catch (err) {
      setError('Falha ao criar requisito: ' + err.message);
    }
  };

  const handleUpdateRequirement = async (id, updatedData) => {
    setError('');
    try {
      await updateRequirement(id, updatedData);
      fetchRequirements(); // Recarregar a lista para exibir as atualizações
    } catch (err) {
      setError('Falha ao atualizar requisito: ' + err.message);
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setNewRequirementType(type);
    setNewRequirementProcessStep(type === 'SYS' ? 'SYS_1' : 'SWE_1');
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Requisitos do Projeto #{projectId}</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Criar Novo Requisito</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleCreateRequirement}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reqTitle">
              Título:
            </label>
            <input
              type="text"
              id="reqTitle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newRequirementTitle}
              onChange={(e) => setNewRequirementTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reqDescription">
              Descrição:
            </label>
            <textarea
              id="reqDescription"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newRequirementDescription}
              onChange={(e) => setNewRequirementDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reqType">
              Tipo:
            </label>
            <select
              id="reqType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newRequirementType}
              onChange={handleTypeChange}
              required
            >
              <option value="SYS">Sistema (SYS)</option>
              <option value="SWE">Software (SWE)</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reqProcessStep">
              Passo do Processo:
            </label>
            <select
              id="reqProcessStep"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newRequirementProcessStep}
              onChange={(e) => setNewRequirementProcessStep(e.target.value)}
              required
            >
              {(newRequirementType === 'SYS' ? sysSteps : sweSteps).map(step => (
                <option key={step} value={step}>{step}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Adicionar Requisito
          </button>
        </form>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Requisitos Existentes</h3>
      {loading ? (
        <p className="text-gray-700">Carregando requisitos...</p>
      ) : requirements.length === 0 ? (
        <p className="text-gray-700">Nenhum requisito encontrado para este projeto.</p>
      ) : (
        <div>
          {requirements.map((req) => (
            <RequirementCard key={req.id} requirement={req} onUpdate={handleUpdateRequirement} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RequirementsPage;