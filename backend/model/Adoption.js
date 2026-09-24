const pool = require('../config/db');

class Adoption {
    static async create(pet_id, adopter_id) {
        const result = await pool.query(
            'INSERT INTO adoption (pet_id, adopter_id, status) VALUES ($1, $2, $3) RETURNING *',
            [pet_id, adopter_id, 'Pending']
        );
        return result.rows[0];
    }

    static async findAllWithDetails() {
        const query = `
            SELECT a.id, a.status, a.adoption_date, p.name as pet_name, ad.name as adopter_name
            FROM adoption a
                     JOIN pet p ON a.pet_id = p.id
                     JOIN adopter ad ON a.adopter_id = ad.id
            ORDER BY a.adoption_date DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            'UPDATE adoption SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }

    static async findByAdopterId(adopter_id) {
        const result = await pool.query(
            'SELECT * FROM adoption WHERE adopter_id = $1',
            [adopter_id]
        );
        return result.rows;
    }

    static async deletePending(id, adopter_id) {
        const result = await pool.query(
            'DELETE FROM adoption WHERE id = $1 AND adopter_id = $2 AND status = $3 RETURNING *',
            [id, adopter_id, 'Pending']
        );
        return result.rows[0];
    }
}



module.exports = Adoption;