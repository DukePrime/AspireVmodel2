// Conteúdo de backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const requirementRoutes = require('./routes/requirements');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Servir arquivos estáticos (uploads) se quiser permitir download direto via URL
const uploadsPath = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Rotas
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/requirements', requirementRoutes);
app.use('/dashboard', dashboardRoutes);

// Healthcheck
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`AspireVmodel2 backend rodando na porta ${port}`);
});