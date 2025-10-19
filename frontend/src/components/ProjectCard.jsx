import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex justify-end space-x-2">
        <Link
          to={`/projects/${project.id}/dashboard`}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to={`/projects/${project.id}/requirements`}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Ver Requisitos
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;