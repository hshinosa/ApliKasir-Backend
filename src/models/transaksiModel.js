const db = require('./db');

class Transaksi {
    static async getAll() {
        const connection = await db();
        const query = `
            SELECT t.*, p.nama AS pengguna_nama 
            FROM transaksi t 
            JOIN pengguna p ON t.id_pengguna = p.id
        `;
        const [results] = await connection.query(query);
        return results;
    }

    static async getById(id) {
        const connection = await db();
        const query = `
            SELECT t.*, p.nama AS pengguna_nama 
            FROM transaksi t 
            JOIN pengguna p ON t.id_pengguna = p.id 
            WHERE t.id = ?
        `;
        const [results] = await connection.query(query, [id]);
        return results;
    }

    static async getDetailByTransaksiId(id_transaksi) {
        const connection = await db();
        const query = `
            SELECT d.*, pr.nama_produk 
            FROM detail_transaksi d 
            JOIN produk pr ON d.id_produk = pr.id 
            WHERE d.id_transaksi = ?
        `;
        const [results] = await connection.query(query, [id_transaksi]);
        return results;
    }

    static async create(data) {
        const connection = await db();
        const query = 'INSERT INTO transaksi SET ?';
        const [results] = await connection.query(query, data);
        return results;
    }

    static async createDetail(data) {
        const connection = await db();
        const query = 'INSERT INTO detail_transaksi SET ?';
        const [results] = await connection.query(query, data);
        return results;
    }
}

module.exports = Transaksi;
