const { prisma } = require('../config/prisma');

function nextCodePrefix(type) {
  return type === 'SYS' ? 'SYS-REQ' : 'SWE-REQ';
}

async function generateRequirementCode(projectId, type) {
  const prefix = nextCodePrefix(type);
  const count = await prisma.requirement.count({ where: { projectId, type } });
  const nextNum = String(count + 1).padStart(4, '0');
  return `${prefix}-${nextNum}`;
}

async function createRequirement(req, res) {
  try {
    const { projectId, title, description, type, processStep, priority } = req.body;

    if (!projectId || !title || !description || !type || !processStep) {
      return res.status(400).json({ error: 'Campos obrigatórios: projectId, title, description, type, processStep' });
    }
    if (!['SYS', 'SWE'].includes(type))
      return res.status(400).json({ error: 'type deve ser SYS ou SWE' });

    const validSteps = new Set([
      'SYS_1','SYS_2','SYS_3','SYS_4','SYS_5',
      'SWE_1','SWE_2','SWE_3','SWE_4','SWE_5','SWE_6'
    ]);
    if (!validSteps.has(processStep))
      return res.status(400).json({ error: 'processStep inválido' });

    const code = await generateRequirementCode(projectId, type);

    const reqItem = await prisma.requirement.create({
      data: {
        projectId,
        code,
        title,
        description,
        type,
        processStep,
        priority: priority ?? 2,
        createdById: req.user.sub
      }
    });

    res.status(201).json(reqItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao criar requisito' });
  }
}

async function listRequirements(req, res) {
  try {
    const { projectId, type, processStep, status, search } = req.query;
    const where = {};

    if (projectId) where.projectId = Number(projectId);
    if (type) where.type = type;
    if (processStep) where.processStep = processStep;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.requirement.findMany({
      where,
      orderBy: [{ projectId: 'asc' }, { id: 'asc' }]
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar requisitos' });
  }
}

async function updateRequirement(req, res) {
  try {
    const id = Number(req.params.id);
    const { title, description, processStep, status, priority } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;

    const validSteps = new Set([
      'SYS_1','SYS_2','SYS_3','SYS_4','SYS_5',
      'SWE_1','SWE_2','SWE_3','SWE_4','SWE_5','SWE_6'
    ]);
    if (processStep !== undefined) {
      if (!validSteps.has(processStep)) {
        return res.status(400).json({ error: 'processStep inválido' });
      }
      data.processStep = processStep;
    }
    const validStatus = new Set(['DRAFT','APPROVED','IMPLEMENTED','VERIFIED','VALIDATED']);
    if (status !== undefined) {
      if (!validStatus.has(status)) {
        return res.status(400).json({ error: 'status inválido' });
      }
      data.status = status;
    }
    if (priority !== undefined) data.priority = Number(priority);

    const updated = await prisma.requirement.update({
      where: { id },
      data
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao atualizar requisito' });
  }
}

async function createTrace(req, res) {
  try {
    const fromId = Number(req.params.id);
    const { toRequirementId, relation } = req.body;

    const relations = new Set(['DERIVES','SATISFIES','VERIFIES','VALIDATES']);
    if (!relations.has(relation)) return res.status(400).json({ error: 'relation inválida' });

    const link = await prisma.traceLink.create({
      data: {
        fromRequirementId: fromId,
        toRequirementId: Number(toRequirementId),
        relation
      }
    });
    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao criar trace' });
  }
}

async function listTraces(req, res) {
  try {
    const id = Number(req.params.id);
    const traces = await prisma.traceLink.findMany({
      where: {
        OR: [{ fromRequirementId: id }, { toRequirementId: id }]
      },
      include: {
        fromRequirement: true,
        toRequirement: true
      }
    });
    res.json(traces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar traces' });
  }
}

module.exports = {
  createRequirement,
  listRequirements,
  updateRequirement,
  createTrace,
  listTraces
};