import React, { useState, useEffect } from 'react';
import { createProject, getProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Falha ao carregar projetos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createProject(newProjectName, newProjectDescription);
      setNewProjectName('');
      setNewProjectDescription('');
      fetchProjects(); // Recarregar a lista de projetos
    } catch (err) {
      setError('Falha ao criar projeto: ' + err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Meus Projetos</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Criar Novo Projeto</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleCreateProject}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectName">
              Nome do Projeto:
            </label>
            <input
              type="text"
              id="projectName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectDescription">
              Descrição:
            </label>
            <textarea
              id="projectDescription"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Criar Projeto
          </button>
        </form>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Projetos Existentes</h3>
      {loading ? (
        <p className="text-gray-700">Carregando projetos...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-700">Nenhum projeto encontrado. Crie um novo!</p>
      ) : (
        <div>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;