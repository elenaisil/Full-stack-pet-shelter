const pool = require('../config/db');

class Pet {
    static async findAll() {
        const result = await pool.query('SELECT * FROM pet ORDER BY id ASC');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM pet WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findSpecies() {
        const result = await pool.query('SELECT DISTINCT species FROM pet');
        return result.rows.map(row => row.species);
    }

    static async count() {
        const result = await pool.query('SELECT COUNT(*) FROM pet');
        return result.rows[0].count;
    }

    static async findBySpecies(species) {
        const result = await pool.query('SELECT * FROM pet WHERE species ILIKE $1', [species]);
        return result.rows;
    }

    static async create({ name, species, age, gender, shelter_id }) {
        const result = await pool.query(
            'INSERT INTO pet (name, species, age, gender, shelter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, species, age, gender, shelter_id]
        );
        return result.rows[0];
    }

    static async update(id, { name, species, age, gender, adopted, shelter_id }) {
        const result = await pool.query(
            'UPDATE pet SET name=$1, species=$2, age=$3, gender=$4, adopted=$5, shelter_id=$6 WHERE id=$7 RETURNING *',
            [name, species, age, gender, adopted, shelter_id, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM pet WHERE id = $1', [id]);
    }

    static async markAsAdopted(id) {
        await pool.query('UPDATE pet SET adopted = true WHERE id = $1', [id]);
    }
}

module.exports = Pet;