const createConnection = require('./db');

class User {
    // Fungsi untuk mencari user berdasarkan username dan role
    static async getByUsername(username, role) {
        const connection = await createConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM pengguna WHERE username = ? AND role = ?',
                [username, role]
            );
            return rows;
        } finally {
            await connection.end();
        }
    }

    // Fungsi untuk membuat pengguna
    static async createPengguna(data) {
        const connection = await createConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO pengguna (nama, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [data.nama, data.username, data.email, data.password, 'pengguna']
            );
            const penggunaId = result.insertId;

            // Tambahkan detail pengguna
            await connection.execute(
                'INSERT INTO detail_pengguna (pengguna_id, nomor_telepon, nama_toko, alamat_toko, gambar_qris, status_akun) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    penggunaId,
                    data.nomor_telepon,
                    data.nama_toko,
                    data.alamat_toko,
                    data.gambar_qris || null,
                    'aktif',
                ]
            );
            return result;
        } finally {
            await connection.end();
        }
    }

    // Fungsi untuk membuat admin
    static async createAdmin(data) {
        const connection = await createConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO pengguna (nama, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [data.nama, data.username, data.email, data.password, 'admin']
            );
            return result;
        } finally {
            await connection.end();
        }
    }

    // Fungsi untuk mencari user berdasarkan email
    static async getByEmail(email, role) {
        const connection = await createConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM pengguna WHERE email = ? AND role = ?',
                [email, role]
            );
            return rows;
        } finally {
            await connection.end();
        }
    }
}

module.exports = User;
