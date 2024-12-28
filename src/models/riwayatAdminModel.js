const db = require('./db');

class RiwayatAdmin {
    static getAll(callback) {
        const query = 'SELECT * FROM riwayat_admin';
        db.query(query, callback);
    }

    static getByAdminId(id_admin, callback) {
        const query = 'SELECT * FROM riwayat_admin WHERE id_admin = ?';
        db.query(query, [id_admin], callback);
    }

    static create(data, callback) {
        const query = 'INSERT INTO riwayat_admin SET ?';
        db.query(query, data, callback);
    }
}

module.exports = RiwayatAdmin;