const db = require('./db');

class Transaksi {
    static getAll(callback) {
        const query = `
            SELECT t.*, p.nama AS pengguna_nama 
            FROM transaksi t 
            JOIN pengguna p ON t.id_pengguna = p.id
        `;
        db.query(query, callback);
    }

    static getById(id, callback) {
        const query = `
            SELECT t.*, p.nama AS pengguna_nama 
            FROM transaksi t 
            JOIN pengguna p ON t.id_pengguna = p.id 
            WHERE t.id = ?
        `;
        db.query(query, [id], callback);
    }

    static getDetailByTransaksiId(id_transaksi, callback) {
        const query = `
            SELECT d.*, pr.nama_produk 
            FROM detail_transaksi d 
            JOIN produk pr ON d.id_produk = pr.id 
            WHERE d.id_transaksi = ?
        `;
        db.query(query, [id_transaksi], callback);
    }

    static create(data, callback) {
        const query = 'INSERT INTO transaksi SET ?';
        db.query(query, data, callback);
    }

    static createDetail(data, callback) {
        const query = 'INSERT INTO detail_transaksi SET ?';
        db.query(query, data, callback);
    }
}

module.exports = Transaksi;
