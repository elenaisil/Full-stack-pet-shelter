const pool = require('../config/db');

class Shelter {
    static async findAll() {
        const result = await pool.query('SELECT * FROM shelter ORDER BY id ASC');
        return result.rows;
    }

    static async searchByName(keyword) {
        const result = await pool.query('SELECT * FROM shelter WHERE name ILIKE $1', [`%${keyword}%`]);
        return result.rows;
    }

    static async create(data) {
        const { name, location, capacity, phone, creationday } = data;
        const result = await pool.query(
            'INSERT INTO shelter (name, location, capacity, phone, creationday) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, location, capacity, phone, creationday]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM shelter WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async searchByLocation(location) {
        const result = await pool.query('SELECT * FROM shelter WHERE location ILIKE $1', [`%${location}%`]);
        return result.rows;
    }

    static async update(id, { name, location, capacity, phone }) {
        const result = await pool.query(
            'UPDATE shelter SET name=$1, location=$2, capacity=$3, phone=$4 WHERE id=$5 RETURNING *',
            [name, location, capacity, phone, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM shelter WHERE id = $1', [id]);
    }
}

module.exports = Shelter;