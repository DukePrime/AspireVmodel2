const pool = require('../config/db');

class Requirement {
       static async create(title, description, type, status, priority, createdByUserId, assignedToUserId, projectName) { // <-- Adicione projectName aqui
        console.log('--- Requirement.create: Valores recebidos para INSERT ---');
        console.log({ title, description, type, status, priority, createdByUserId, assignedToUserId, projectName }); // <-- Inclua no log

        const query = `
            INSERT INTO requirements (title, description, type, status, priority, created_by_user_id, assigned_to_user_id, project_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [title, description, type, status, priority, createdByUserId, assignedToUserId, projectName]; // <-- Adicione projectName aqui
        
        console.log('Requirement.create: Executando query:', query);
        console.log('Requirement.create: Com valores:', values);

        try {
            const result = await pool.query(query, values);
            if (result.rows.length > 0) {
                console.log('Requirement.create: Query executada com sucesso. Resultado:', result.rows[0]);
                return result.rows[0];
            } else {
                console.warn('Requirement.create: Query INSERT executada, mas RETURNING * não retornou nenhuma linha. Isso é muito incomum para um INSERT bem-sucedido.');
                return null;
            }
        } catch (error) {
            console.error('Requirement.create: Erro no banco de dados durante INSERT:', error);
            throw error;
        }
    }

    static async findAllByUserId(userId) {
        const query = `
            SELECT
                r.id, r.title, r.description, r.type, r.status, r.priority, r.created_at, r.updated_at,
                r.project_name, -- <-- Adicione project_name aqui
                u.username AS created_by_username,
                at_user.username AS assigned_to_username
            FROM requirements r
            LEFT JOIN users u ON r.created_by_user_id = u.id
            LEFT JOIN users at_user ON r.assigned_to_user_id = at_user.id
            WHERE r.created_by_user_id = $1
            ORDER BY r.created_at DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async findAll() {
        console.log('--- Requirement.findAll: Buscando todos os requisitos ---');
        const query = `
            SELECT
                r.id, r.title, r.description, r.type, r.status, r.priority, r.created_at, r.updated_at,
                r.project_name, -- <-- Adicione project_name aqui
                u.username AS created_by_username,
                at_user.username AS assigned_to_username
            FROM requirements r
            LEFT JOIN users u ON r.created_by_user_id = u.id
            LEFT JOIN users at_user ON r.assigned_to_user_id = at_user.id
            ORDER BY r.created_at DESC;
        `;
        try {
            const result = await pool.query(query);
            console.log(`Requirement.findAll: Encontrados ${result.rows.length} requisitos.`);
            return result.rows;
        } catch (error) {
            console.error('Requirement.findAll: Erro ao buscar todos os requisitos:', error);
            throw error;
        }
    }

    static async findByIdAndUserId(id, userId) {
        const query = `
            SELECT
                r.id, r.title, r.description, r.type, r.status, r.priority, r.created_at, r.updated_at,
                r.project_name, -- <-- Adicione project_name aqui
                u.username AS created_by_username,
                at_user.username AS assigned_to_username
            FROM requirements r
            LEFT JOIN users u ON r.created_by_user_id = u.id
            LEFT JOIN users at_user ON r.assigned_to_user_id = at_user.id
            WHERE r.id = $1 AND r.created_by_user_id = $2;
        `;
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    }

    static async update(id, userId, { title, description, type, status, priority, assignedToUserId, projectName }) { // <-- Adicione projectName aqui
        const query = `
            UPDATE requirements
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                type = COALESCE($3, type),
                status = COALESCE($4, status),
                priority = COALESCE($5, priority),
                assigned_to_user_id = COALESCE($6, assigned_to_user_id),
                project_name = COALESCE($7, project_name), -- <-- Adicione project_name aqui
                updated_at = NOW()
            WHERE id = $8 AND created_by_user_id = $9
            RETURNING *;
        `;
        
        const values = [title, description, type, status, priority, assignedToUserId, projectName, id, userId]; 
        return result.rows[0];
    }


    static async delete(id, userId) {
        const query = 'DELETE FROM requirements WHERE id = $1 AND created_by_user_id = $2 RETURNING *;';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    }
}

module.exports = Requirement;