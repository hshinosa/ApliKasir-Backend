const db = require('./db');

class Laporan {
    static getAll(callback) {
        const query = 'SELECT * FROM laporan';
        db.query(query, callback);
    }

    static getById(id, callback) {
        const query = 'SELECT * FROM laporan WHERE id = ?';
        db.query(query, [id], callback);
    }

    static create(data, callback) {
        const query = 'INSERT INTO laporan SET ?';
        db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = 'UPDATE laporan SET ? WHERE id = ?';
        db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = 'DELETE FROM laporan WHERE id = ?';
        db.query(query, [id], callback);
    }
}

module.exports = Laporan;