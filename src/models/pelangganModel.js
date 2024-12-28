const db = require('./db');

class Pelanggan {
    static getAll(callback) {
        const query = 'SELECT * FROM pelanggan';
        db.query(query, callback);
    }

    static getById(id, callback) {
        const query = 'SELECT * FROM pelanggan WHERE id = ?';
        db.query(query, [id], callback);
    }

    static create(data, callback) {
        const query = 'INSERT INTO pelanggan SET ?';
        db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = 'UPDATE pelanggan SET ? WHERE id = ?';
        db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = 'DELETE FROM pelanggan WHERE id = ?';
        db.query(query, [id], callback);
    }
}

module.exports = Pelanggan;