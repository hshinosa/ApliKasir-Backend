const createConnection = require('./db');

class Pengguna {
    static async getAll(callback) {
        const connection = await createConnection();
        const query = `
            SELECT p.id, p.nama, p.username, p.email, p.role, dp.nomor_telepon, dp.nama_toko, dp.alamat_toko, dp.gambar_qris, dp.status_akun
            FROM pengguna p
            LEFT JOIN detail_pengguna dp ON p.id = dp.pengguna_id
        `;
        try {
            const [rows] = await connection.query(query);
            callback(null, rows);
        } catch (err) {
            callback(err, null);
        } finally {
            await connection.end();
        }
    }
    

    static async getById(id, callback) {
        const connection = await createConnection();
        const query = `
            SELECT p.id, p.nama, p.username, p.email, p.role, dp.nomor_telepon, dp.nama_toko, dp.alamat_toko, dp.gambar_qris, dp.status_akun
            FROM pengguna p
            LEFT JOIN detail_pengguna dp ON p.id = dp.pengguna_id
            WHERE p.id = ?
        `;
        try {
            const [rows] = await connection.query(query, [id]);
            callback(null, rows);
        } catch (err) {
            callback(err, null);
        } finally {
            await connection.end();
        }
    }

    static async update(id, data, callback) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('UPDATE pengguna SET ? WHERE id = ?', [data, id]);
            callback(null, result);
        } catch (err) {
            callback(err, null);
        } finally {
            await connection.end();
        }
    }
    
    static async updateDetail(id, data, callback) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('UPDATE detail_pengguna SET ? WHERE pengguna_id = ?', [data, id]);
            callback(null, result);
        } catch (err) {
            callback(err, null);
        } finally {
            await connection.end();
        }
    }
    

    static async delete(id, callback) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('DELETE FROM pengguna WHERE id = ?', [id]);
            callback(null, result);
        } catch (err) {
            callback(err, null);
        } finally {
            await connection.end();
        }
    }
    
    static async deleteDetail(id, callback) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('DELETE FROM detail_pengguna WHERE pengguna_id = ?', [id]);
            callback(null, result);
        } catch (err) {
            callback(err, null);
        } finally {
            await connection.end();
        }
    }
}

module.exports = Pengguna;
