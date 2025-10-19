const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  createRequirement,
  listRequirements,
  updateRequirement,
  createTrace,
  listTraces
} = require('../controllers/requirementsController');
const { prisma } = require('../config/prisma'); // Este prisma não é usado aqui, mas não causará erro.

router.post('/', auth(), createRequirement);
router.get('/', auth(), listRequirements);
router.put('/:id', auth(), updateRequirement);

router.post('/:id/trace', auth(), createTrace);
router.get('/:id/trace', auth(), listTraces);

router.post('/:id/attachments', auth(), upload.single('file'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) return res.status(400).json({ error: 'Arquivo obrigatório (campo: file)' });

    const created = await prisma.attachment.create({
      data: {
        requirementId: id,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        storagePath: req.file.path,
        uploadedById: req.user.sub
      }
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao anexar arquivo' });
  }
});

router.get('/:id/attachments', auth(), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const items = await prisma.attachment.findMany({
      where: { requirementId: id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao listar anexos' });
  }
});

module.exports = router;