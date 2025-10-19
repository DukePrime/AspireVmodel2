const { prisma } = require('../config/prisma');

async function createProject(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.sub
      }
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao criar projeto' });
  }
}

async function listProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.sub },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar projetos' });
  }
}

module.exports = { createProject, listProjects };