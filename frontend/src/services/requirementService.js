// D:\AspireVmodel2\frontend\src\services\requirementService.js
import api from './api';

const requirementService = {
    async createRequirement(requirementData) {
        const response = await api.post('/requirements', requirementData);
        return response.data;
    },

    async getRequirements() {
        const response = await api.get('/requirements');
        return response.data;
    },

    // Futuramente: getRequirementById, updateRequirement, deleteRequirement
};

export default requirementService;