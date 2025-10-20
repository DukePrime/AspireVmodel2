// D:\AspireVmodel2\backend\src\controllers\requirementController.js
const Requirement = require('../models/requirementModel');

// Handler para criar um novo requisito
exports.createRequirement = async (req, res) => {
    // req.userId é esperado do middleware de autenticação (JWT)
    const createdByUserId = req.userId; // ID do usuário logado que está criando o requisito

    // Extrair os dados do corpo da requisição
    const { title, description, type, status, priority, assignedToUserId } = req.body;

    // Validação básica (opcional, mas recomendado)
    if (!title || !type || !status) {
        return res.status(400).json({ message: 'Título, tipo e status são obrigatórios.' });
    }

    try {
        const newRequirement = await Requirement.create(
            title,
            description,
            type,
            status,
            priority, // Novo campo
            createdByUserId, // ID do usuário que criou
            assignedToUserId // Novo campo
        );
        res.status(201).json(newRequirement);
    } catch (error) {
        console.error('Erro ao criar requisito:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar requisito.' });
    }
};

// Handler para obter todos os requisitos
exports.getRequirements = async (req, res) => {
    try {
        const requirements = await Requirement.findAll();
        res.status(200).json(requirements);
    } catch (error) {
        console.error('Erro ao buscar requisitos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar requisitos.' });
    }
};

// Handler para obter um requisito por ID (se você adicionou o método findById no model)
exports.getRequirementById = async (req, res) => {
    try {
        const { id } = req.params;
        const requirement = await Requirement.findById(id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requisito não encontrado.' });
        }
        res.status(200).json(requirement);
    } catch (error) {
        console.error('Erro ao buscar requisito por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar requisito.' });
    }
};

// Handler para atualizar um requisito (se você adicionou o método update no model)
exports.updateRequirement = async (req, res) => {
    const { id } = req.params;
    const { title, description, type, status, priority, assignedToUserId } = req.body;
    // O createdByUserId não é atualizado, apenas no create.
    // Você pode adicionar lógica de verificação se o usuário logado tem permissão para atualizar este requisito.

    try {
        const updatedRequirement = await Requirement.update(id, {
            title,
            description,
            type,
            status,
            priority,
            assignedToUserId
        });
        if (!updatedRequirement) {
            return res.status(404).json({ message: 'Requisito não encontrado para atualização.' });
        }
        res.status(200).json(updatedRequirement);
    } catch (error) {
        console.error('Erro ao atualizar requisito:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar requisito.' });
    }
};

// Handler para deletar um requisito (se você adicionou o método delete no model)
exports.deleteRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequirement = await Requirement.delete(id);
        if (!deletedRequirement) {
            return res.status(404).json({ message: 'Requisito não encontrado para exclusão.' });
        }
        res.status(200).json({ message: 'Requisito excluído com sucesso.', deletedRequirement });
    } catch (error) {
        console.error('Erro ao deletar requisito:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar requisito.' });
    }
};