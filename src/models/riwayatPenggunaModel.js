const db = require('./db');

class RiwayatPengguna {
    static getAll(callback) {
        const query = 'SELECT * FROM riwayat_pengguna';
        db.query(query, callback);
    }

    static getByPenggunaId(id_pengguna, callback) {
        const query = 'SELECT * FROM riwayat_pengguna WHERE id_pengguna = ?';
        db.query(query, [id_pengguna], callback);
    }

    static create(data, callback) {
        const query = 'INSERT INTO riwayat_pengguna SET ?';
        db.query(query, data, callback);
    }
}

module.exports = RiwayatPengguna;