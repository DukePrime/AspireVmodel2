// D:\AspireVmodel2\backend\src\models\requirementModel.js
const pool = require('../config/db');

class Requirement {
    static async create(title, description, type, status, priority, createdByUserId, assignedToUserId) {
        const query = `
            INSERT INTO requirements (title, description, type, status, priority, created_by_user_id, assigned_to_user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [title, description, type, status, priority, createdByUserId, assignedToUserId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll() {
        const query = `
            SELECT
                r.id, r.title, r.description, r.type, r.status, r.priority, r.created_at, r.updated_at,
                cb.username AS created_by_username,
                at.username AS assigned_to_username
            FROM requirements r
            LEFT JOIN users cb ON r.created_by_user_id = cb.id
            LEFT JOIN users at ON r.assigned_to_user_id = at.id
            ORDER BY r.created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Você pode precisar de métodos como findById, update e delete aqui também.
    // Exemplo de findById, se necessário:
    static async findById(id) {
        const query = `
            SELECT
                r.id, r.title, r.description, r.type, r.status, r.priority, r.created_at, r.updated_at,
                cb.username AS created_by_username,
                at.username AS assigned_to_username
            FROM requirements r
            LEFT JOIN users cb ON r.created_by_user_id = cb.id
            LEFT JOIN users at ON r.assigned_to_user_id = at.id
            WHERE r.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Exemplo de update, se necessário:
    static async update(id, { title, description, type, status, priority, assignedToUserId }) {
        const query = `
            UPDATE requirements
            SET title = $1, description = $2, type = $3, status = $4, priority = $5, assigned_to_user_id = $6, updated_at = NOW()
            WHERE id = $7
            RETURNING *;
        `;
        const values = [title, description, type, status, priority, assignedToUserId, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Exemplo de delete, se necessário:
    static async delete(id) {
        const query = 'DELETE FROM requirements WHERE id = $1 RETURNING *;';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Requirement;