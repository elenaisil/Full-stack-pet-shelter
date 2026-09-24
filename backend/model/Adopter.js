const pool = require('../config/db');

class Adopter {
    // Check if email exists OR find user for login
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM adopter WHERE email = $1', [email]);
        return result.rows[0];
    }

    // Create a new adopter (Signup)
    static async create({ name, email, phone, address, city, hashPass }) {
        const result = await pool.query(
            'INSERT INTO adopter (name, email, phone, address, city, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email',
            [name, email, phone, address, city, hashPass]
        );
        return result.rows[0];
    }

    // Get all (Admin view)
    static async findAll() {
        const result = await pool.query('SELECT id, name, email, phone, address, city FROM adopter ORDER BY id ASC');
        return result.rows;
    }

    // Get by ID
    static async findById(id) {
        const result = await pool.query('SELECT id, name, email, phone, address, city FROM adopter WHERE id = $1', [id]);
        return result.rows[0];
    }
}

module.exports = Adopter;