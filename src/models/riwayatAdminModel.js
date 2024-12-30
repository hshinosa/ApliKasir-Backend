const db = require('./db');

class RiwayatAdmin {
    static async getAll() {
        const connection = await db();
        const query = 'SELECT * FROM riwayat_admin';
        const [results] = await connection.query(query);
        return results;
    }

    static async getByAdminId(id_admin) {
        const connection = await db();
        const query = 'SELECT * FROM riwayat_admin WHERE id_admin = ?';
        const [results] = await connection.query(query, [id_admin]);
        return results;
    }

    static async create(data) {
        const connection = await db();
        const query = 'INSERT INTO riwayat_admin SET ?';
        const [results] = await connection.query(query, data);
        return results;
    }
}

module.exports = RiwayatAdmin;
