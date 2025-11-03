// D:\AspireVmodel2\backend\src\controllers\requirementController.js
const Requirement = require('../models/requirementModel');
const pool = require('../config/db');

// Mapeamento de status para garantir compatibilidade com o banco de dados
const statusMap = {
    'PENDENTE': 'PENDING',
    'EM_PROGRESSO': 'IN_PROGRESS',
    'CONCLUIDO': 'COMPLETED',
    'BLOQUEADO': 'BLOCKED',
    'CANCELADO': 'CANCELLED',
};

// Array de status válidos que o banco de dados aceita
const validDbStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED'];

// Handler para criar um novo requisito
exports.createRequirement = async (req, res) => {
    const createdByUserId = req.userId; // ID do usuário logado
    let { title, description, type, status, priority, assignedToUserId, projectName } = req.body;


    console.log('--- createRequirement: Dados recebidos ---');
    console.log('req.body:', { title, description, type, status, priority, assignedToUserId, projectName });
    console.log('createdByUserId (do token):', createdByUserId);

    if (!title || !type || !status) {
        console.error('createRequirement: Erro de validação - Título, tipo e status são obrigatórios.');
        return res.status(400).json({ message: 'Título, tipo e status são obrigatórios.' });
    }

    let processedStatus = status.toUpperCase();
    if (statusMap[processedStatus]) {
        processedStatus = statusMap[processedStatus];
    } else if (!validDbStatuses.includes(processedStatus)) {
        console.warn(`createRequirement: Status '${status}' recebido é inválido. Usando 'PENDING' como padrão.`);
        processedStatus = 'PENDING';
    }

    // --- Tratamento para campos opcionais vazios se tornarem NULL, para DB ---
    const finalDescription = description === '' || description === undefined ? null : description;
    const finalPriority = priority === '' || priority === undefined ? null : priority;
    const finalAssignedToUserId = assignedToUserId === '' || assignedToUserId === undefined ? null : assignedToUserId;
    const finalProjectName = projectName === '' || projectName === undefined ? null : projectName;

    console.log('createRequirement: Dados processados antes de enviar ao modelo:', {
        title,
        description: finalDescription,
        type,
        status: processedStatus,
        priority: finalPriority,
        createdByUserId,
        assignedToUserId: finalAssignedToUserId,
        projectName: finalProjectName
    });

    try {
        const newRequirement = await Requirement.create(
            title,
            finalDescription,
            type,
            processedStatus,
            finalPriority,
            createdByUserId,
            finalAssignedToUserId,
            finalProjectName
        );
        
        if (newRequirement && newRequirement.id) {
            console.log('createRequirement: Requisito criado com sucesso no banco de dados. ID:', newRequirement.id);
            res.status(201).json(newRequirement);
        } else {
            console.error('createRequirement: Requirement.create não retornou um objeto de requisito válido com ID, apesar de não ter lançado erro.');
            res.status(500).json({ message: 'Erro interno do servidor: O requisito não foi retornado após a criação no DB.' });
        }
    } catch (error) {
        console.error('createRequirement: Erro CATASTRÓFICO ao criar requisito no controlador:', error);
        let errorMessage = 'Erro interno do servidor ao criar requisito.';
        if (error.detail) errorMessage += ` Detalhes: ${error.detail}`;
        if (error.hint) errorMessage += ` Dica: ${error.hint}`;
        if (error.code) errorMessage += ` Código do Erro PG: ${error.code}`;
        res.status(500).json({ message: errorMessage });
    }
};

// Handler para obter todos os requisitos do usuário logado
exports.getRequirements = async (req, res) => {
    try {
        const userId = req.userId;
        const { projectName } = req.query; // <--- CORREÇÃO: Extrai o parâmetro projectName da query string

        // Passa o projectName para o método de busca
        const requirements = await Requirement.findAllByUserId(userId, projectName); // <--- CORREÇÃO: Passa projectName
        res.status(200).json(requirements);
    } catch (error) {
        console.error('Erro ao buscar requisitos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar requisitos.' });
    }
};

// NOVO HANDLER: Para obter TODOS os requisitos (não filtrados por user ID)
exports.getAllRequirements = async (req, res) => {
    console.log('--- getAllRequirements: Requisição para todos os requisitos recebida ---');
    try {
        const { projectName } = req.query; // <--- CORREÇÃO: Extrai o parâmetro projectName da query string

        // Passa o projectName para o método de busca
        const requirements = await Requirement.findAll(projectName); // <--- CORREÇÃO: Passa projectName
        res.status(200).json(requirements);
    } catch (error) {
        console.error('getAllRequirements: Erro ao buscar TODOS os requisitos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar todos os requisitos.' });
    }
};

// Handler para obter um requisito por ID do usuário logado
exports.getRequirementById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        console.log('--- DEBUG getRequirementById ---');
        console.log('ID do requisito da URL:', id);
        console.log('ID do usuário do token (req.userId):', userId); 
        const requirement = await Requirement.findByIdAndUserId(id, userId);
        if (!requirement) {
            return res.status(404).json({ message: 'Requisito não encontrado ou você não tem permissão para vê-lo.' });
        }
        res.status(200).json(requirement);
    } catch (error) {
        console.error('Erro ao buscar requisito por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar requisito.' });
    }
};

// Handler para atualizar um requisito do usuário logado
exports.updateRequirement = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    // <--- CORREÇÃO: Inclui projectName na desestruturação de req.body
    let { title, description, type, status, priority, assignedToUserId, projectName } = req.body;

    let processedStatus = status ? status.toUpperCase() : undefined;
    if (processedStatus && statusMap[processedStatus]) {
        processedStatus = statusMap[processedStatus];
    } else if (processedStatus && !validDbStatuses.includes(processedStatus)) {
        console.warn(`Status '${status}' recebido para atualização é inválido. Não será atualizado.`);
        processedStatus = undefined;
    }

    const finalAssignedToUserId = assignedToUserId !== undefined ? (assignedToUserId === '' ? null : assignedToUserId) : undefined;
    const finalDescription = description !== undefined ? (description === '' ? null : description) : undefined;
    const finalPriority = priority !== undefined ? (priority === '' ? null : priority) : undefined;
    // <--- CORREÇÃO: Processa projectName para NULL se vazio/undefined
    const finalProjectName = projectName !== undefined ? (projectName === '' ? null : projectName) : undefined;

    try {
        const updatedRequirement = await Requirement.update(id, userId, {
            title,
            description: finalDescription,
            type,
            status: processedStatus,
            priority: finalPriority,
            assignedToUserId: finalAssignedToUserId,
            projectName: finalProjectName // <--- CORREÇÃO: Passa projectName para a função update do modelo
        });
        if (!updatedRequirement) {
            return res.status(404).json({ message: 'Requisito não encontrado ou você não tem permissão para atualizá-lo.' });
        }
        res.status(200).json(updatedRequirement);
    } catch (error) {
        console.error('Erro ao atualizar requisito:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar requisito.' });
    }
};

// Handler para deletar um requisito do usuário logado
exports.deleteRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deletedRequirement = await Requirement.delete(id, userId);
        if (!deletedRequirement) {
            return res.status(404).json({ message: 'Requisito não encontrado ou você não tem permissão para excluí-lo.' });
        }
        res.status(200).json({ message: 'Requisito excluído com sucesso.', deletedRequirement });
    } catch (error) {
        console.error('Erro ao deletar requisito:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar requisito.' });
    }
};

// @desc    Obter resumo de dados para o dashboard do usuário logado
// @route   GET /api/requirements/dashboard-summary
// @access  Private
exports.getDashboardSummary = async (req, res) => {
    const userId = req.userId;

    try {
        // Total de requisitos para o usuário logado
        const totalResult = await pool.query('SELECT COUNT(*) FROM requirements WHERE created_by_user_id = $1', [userId]);
        const totalRequirements = parseInt(totalResult.rows[0].count, 10);

        // Contagem de requisitos por status para o usuário logado
        const statusCountsResult = await pool.query(
            'SELECT status, COUNT(*) FROM requirements WHERE created_by_user_id = $1 GROUP BY status',
            [userId]
        );

        const statusCounts = {};
        validDbStatuses.forEach(status => {
            statusCounts[status] = 0;
        });
        
        statusCountsResult.rows.forEach(row => {
            statusCounts[row.status] = parseInt(row.count, 10);
        });

        res.status(200).json({
            totalRequirements,
            statusCounts,
        });

    } catch (error) {
        console.error('Erro ao obter resumo do dashboard:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter resumo do dashboard.' });
    }
};

// NOVO HANDLER: Obter resumo de dados para o dashboard de TODOS os requisitos
exports.getDashboardSummaryAll = async (req, res) => {
    console.log('--- getDashboardSummaryAll: Requisição para resumo geral recebida ---');
    try {
        // Total de requisitos para TODOS os usuários
        const totalResult = await pool.query('SELECT COUNT(*) FROM requirements');
        const totalRequirements = parseInt(totalResult.rows[0].count, 10);

        // Contagem de requisitos por status para TODOS os usuários
        const statusCountsResult = await pool.query(
            'SELECT status, COUNT(*) FROM requirements GROUP BY status'
        );

        const statusCounts = {};
        validDbStatuses.forEach(status => {
            statusCounts[status] = 0;
        });
        
        statusCountsResult.rows.forEach(row => {
            statusCounts[row.status] = parseInt(row.count, 10);
        });

        res.status(200).json({
            totalRequirements,
            statusCounts,
        });

    } catch (error) {
        console.error('getDashboardSummaryAll: Erro ao obter resumo do dashboard geral:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter resumo do dashboard geral.' });
    }
};