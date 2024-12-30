const createConnection = require('./db');

class Pengguna {
    static async getAll() {
        const connection = await createConnection();
        const query = `
            SELECT p.id, p.nama, p.username, p.email, p.role, dp.nomor_telepon, dp.nama_toko, dp.alamat_toko, dp.gambar_qris, dp.status_akun
            FROM pengguna p
            LEFT JOIN detail_pengguna dp ON p.id = dp.pengguna_id
        `;
        try {
            const [rows] = await connection.query(query);
            return rows;
        } catch (err) {
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }

    static async getById(id) {
        const connection = await createConnection();
        const query = `
            SELECT p.id, p.nama, p.username, p.email, p.role, dp.nomor_telepon, dp.nama_toko, dp.alamat_toko, dp.gambar_qris, dp.status_akun
            FROM pengguna p
            LEFT JOIN detail_pengguna dp ON p.id = dp.pengguna_id
            WHERE p.id = ?
        `;
        try {
            const [rows] = await connection.query(query, [id]);
            return rows;
        } catch (err) {
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }

    static async update(id, data) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('UPDATE pengguna SET ? WHERE id = ?', [data, id]);
            return result;
        } catch (err) {
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }

    static async updateDetail(id, data) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('UPDATE detail_pengguna SET ? WHERE pengguna_id = ?', [data, id]);
            return result;
        } catch (err) {
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }

    static async delete(id) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('DELETE FROM pengguna WHERE id = ?', [id]);
            return result;
        } catch (err) {
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }

    static async deleteDetail(id) {
        const connection = await createConnection();
        try {
            const [result] = await connection.query('DELETE FROM detail_pengguna WHERE pengguna_id = ?', [id]);
            return result;
        } catch (err) {
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }
}

module.exports = Pengguna;
