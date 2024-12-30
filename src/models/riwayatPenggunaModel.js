const db = require('./db');

class RiwayatPengguna {
    static async getAll() {
        const connection = await db();
        const query = 'SELECT * FROM riwayat_pengguna';
        const [results] = await connection.query(query);
        return results;
    }

    static async getByPenggunaId(id_pengguna) {
        const connection = await db();
        const query = 'SELECT * FROM riwayat_pengguna WHERE id_pengguna = ?';
        const [results] = await connection.query(query, [id_pengguna]);
        return results;
    }

    static async create(data) {
        const connection = await db();
        const query = 'INSERT INTO riwayat_pengguna SET ?';
        const [results] = await connection.query(query, data);
        return results;
    }
}

module.exports = RiwayatPengguna;
