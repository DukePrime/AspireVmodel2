import React, { useState } from 'react';

function RequirementCard({ requirement, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(requirement.title);
  const [description, setDescription] = useState(requirement.description);
  const [processStep, setProcessStep] = useState(requirement.processStep);
  const [status, setStatus] = useState(requirement.status);
  const [priority, setPriority] = useState(requirement.priority);

  const handleSave = () => {
    onUpdate(requirement.id, { title, description, processStep, status, priority });
    setIsEditing(false);
  };

  const renderStatusBadge = (status) => {
    let bgColor;
    switch (status) {
      case 'DRAFT':
        bgColor = 'bg-gray-400';
        break;
      case 'APPROVED':
        bgColor = 'bg-green-500';
        break;
      case 'IMPLEMENTED':
        bgColor = 'bg-blue-500';
        break;
      case 'VERIFIED':
        bgColor = 'bg-yellow-500';
        break;
      case 'VALIDATED':
        bgColor = 'bg-purple-500';
        break;
      default:
        bgColor = 'bg-gray-400';
    }
    return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${bgColor}`}>{status}</span>;
  };

  const renderPriorityBadge = (priority) => {
    let bgColor;
    switch (priority) {
      case 1:
        bgColor = 'bg-red-500';
        break;
      case 2:
        bgColor = 'bg-yellow-500';
        break;
      case 3:
        bgColor = 'bg-green-500';
        break;
      default:
        bgColor = 'bg-gray-400';
    }
    return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${bgColor}`}>P{priority}</span>;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{requirement.code} - {requirement.title}</h3>
        <div className="flex space-x-2">
          {renderStatusBadge(requirement.status)}
          {renderPriorityBadge(requirement.priority)}
        </div>
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />
          <select
            value={processStep}
            onChange={(e) => setProcessStep(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          >
            {['SYS_1','SYS_2','SYS_3','SYS_4','SYS_5','SWE_1','SWE_2','SWE_3','SWE_4','SWE_5','SWE_6'].map(step => (
              <option key={step} value={step}>{step}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          >
            {['DRAFT', 'APPROVED', 'IMPLEMENTED', 'VERIFIED', 'VALIDATED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            min="1"
            max="3"
            className="w-full p-2 border rounded-md mb-2"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
          >
            Salvar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 mb-2">{requirement.description}</p>
          <p className="text-gray-600 text-sm">Passo: {requirement.processStep}</p>
          <p className="text-gray-600 text-sm">Tipo: {requirement.type}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
}

export default RequirementCard;