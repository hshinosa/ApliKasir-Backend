const db = require('./db');

class Kredit {
    static async getAll() {
        const connection = await db();
        const query = 'SELECT * FROM kredit';
        const [results] = await connection.query(query);
        return results;
    }

    static async getById(id) {
        const connection = await db();
        const query = 'SELECT * FROM kredit WHERE id = ?';
        const [results] = await connection.query(query, [id]);
        return results;
    }

    static async create(data) {
        const connection = await db();
        const query = 'INSERT INTO kredit SET ?';
        const [results] = await connection.query(query, data);
        return results;
    }

    static async update(id, data) {
        const connection = await db();
        const query = 'UPDATE kredit SET ? WHERE id = ?';
        const [results] = await connection.query(query, [data, id]);
        return results;
    }

    static async delete(id) {
        const connection = await db();
        const query = 'DELETE FROM kredit WHERE id = ?';
        const [results] = await connection.query(query, [id]);
        return results;
    }
}

module.exports = Kredit;
