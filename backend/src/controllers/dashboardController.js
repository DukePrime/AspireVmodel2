const { prisma } = require('../config/prisma');

async function metrics(req, res) {
  try {
    const projectId = Number(req.query.projectId);
    if (!projectId) return res.status(400).json({ error: 'projectId é obrigatório' });

    const total = await prisma.requirement.count({ where: { projectId } });

    const byType = await prisma.requirement.groupBy({
      by: ['type'],
      where: { projectId },
      _count: { _all: true }
    });

    const byStep = await prisma.requirement.groupBy({
      by: ['processStep'],
      where: { projectId },
      _count: { _all: true }
    });

    const byStatus = await prisma.requirement.groupBy({
      by: ['status'],
      where: { projectId },
      _count: { _all: true }
    });

    res.json({
      total,
      byType: byType.map(r => ({ type: r.type, count: r._count._all })),
      byStep: byStep.map(r => ({ step: r.processStep, count: r._count._all })),
      byStatus: byStatus.map(r => ({ status: r.status, count: r._count._all }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao obter métricas' });
  }
}

module.exports = { metrics };