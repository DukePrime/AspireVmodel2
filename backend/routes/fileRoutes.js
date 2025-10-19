// AspireVmodel2/backend/src/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { protect } = require('../middleware/authMiddleware'); // Para proteger as rotas de upload
const path = require('path');
const pool = require('../config/db'); // Para salvar metadados no DB

// Rota para upload de um único arquivo
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        const { originalname, filename, path: filepath, mimetype, size } = req.file;
        const { relatedToType, relatedToId } = req.body; // Para associar o arquivo a um requisito

        // Salvar metadados do arquivo no banco de dados
        const result = await pool.query(
            'INSERT INTO attachments (filename, filepath, mimetype, filesize, related_to_type, related_to_id, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [originalname, filepath, mimetype, size, relatedToType, relatedToId, req.userId]
        );

        res.status(200).json({
            message: 'Arquivo enviado e salvo com sucesso!',
            file: result.rows[0],
        });
    } catch (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao processar o upload.' });
    }
});

// Rota para servir arquivos estáticos (downloads)
// ATENÇÃO: Esta rota permite acesso a arquivos no diretório 'uploads'.
// Em produção, considere um serviço de armazenamento de objetos (S3, GCS).
router.get('/download/:filename', protect, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename); // Caminho para a pasta 'uploads'

    res.download(filePath, (err) => {
        if (err) {
            console.error('Erro ao baixar arquivo:', err);
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'Arquivo não encontrado.' });
            }
            res.status(500).json({ message: 'Erro interno do servidor ao baixar o arquivo.' });
        }
    });
});


module.exports = router;