const db = require('./db');

class Kredit {
    static getAll(callback) {
        const query = 'SELECT * FROM kredit';
        db.query(query, callback);
    }

    static getById(id, callback) {
        const query = 'SELECT * FROM kredit WHERE id = ?';
        db.query(query, [id], callback);
    }

    static create(data, callback) {
        const query = 'INSERT INTO kredit SET ?';
        db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = 'UPDATE kredit SET ? WHERE id = ?';
        db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = 'DELETE FROM kredit WHERE id = ?';
        db.query(query, [id], callback);
    }
}

module.exports = Kredit;