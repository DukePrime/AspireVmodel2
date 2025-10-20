// D:\AspireVmodel2\backend\src\controllers\requirementController.js
const Requirement = require('../models/requirementModel');

// Mapeamento de status para garantir compatibilidade com o banco de dados
// As chaves são o que seu frontend pode enviar (ou o que você pode querer padronizar),
// e os valores são o que o seu banco de dados espera, em maiúsculas.
const statusMap = {
    'PENDENTE': 'PENDING',
    'EM_PROGRESSO': 'IN_PROGRESS',
    'CONCLUIDO': 'COMPLETED',
    'BLOQUEADO': 'BLOCKED',
    'CANCELADO': 'CANCELLED',
    // Adicione outros mapeamentos se houver variação na entrada do frontend
    // ou se o frontend enviar termos em inglês mas com capitalização diferente (ex: 'in_progress')
};

// Array de status válidos que o banco de dados aceita
const validDbStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED'];

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

    // Processamento do status:
    // 1. Converte para maiúsculas para uniformidade.
    // 2. Tenta encontrar um mapeamento no statusMap.
    // 3. Se não encontrar, assume que o status já pode ser um dos valores válidos do DB.
    let processedStatus = status.toUpperCase(); // Converte para maiúsculas primeiro

    if (statusMap[processedStatus]) { // Verifica se existe um mapeamento exato
        processedStatus = statusMap[processedStatus];
    } else if (!validDbStatuses.includes(processedStatus)) { // Se não mapeou e não é um status válido do DB
        // Aqui, o status recebido é inválido. Pode-se retornar um erro ou definir um padrão.
        console.warn(`Status '${status}' recebido é inválido. Usando 'PENDING' como padrão.`);
        // return res.status(400).json({ message: `Status inválido '${status}'. Valores permitidos: ${validDbStatuses.join(', ')}.` });
        processedStatus = 'PENDING'; // Define um status padrão seguro
    }

    try {
        const newRequirement = await Requirement.create(
            title,
            description,
            type,
            processedStatus, // Usamos o status processado/validado
            priority,
            createdByUserId,
            assignedToUserId
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

    // Processamento do status para update também, se necessário
    let processedStatus = status ? status.toUpperCase() : undefined;
    if (processedStatus && statusMap[processedStatus]) {
        processedStatus = statusMap[processedStatus];
    } else if (processedStatus && !validDbStatuses.includes(processedStatus)) {
        console.warn(`Status '${status}' recebido para atualização é inválido. Não será atualizado.`);
        processedStatus = undefined; // Não atualiza o status se for inválido
    }

    try {
        const updatedRequirement = await Requirement.update(id, {
            title,
            description,
            type,
            status: processedStatus, // Usa o status processado para o update
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