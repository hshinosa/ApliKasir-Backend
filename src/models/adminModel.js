const createConnection = require('./db');

class Admin {
    // Mengambil semua data admin
    static async getAll() {
        const connection = await createConnection();
        const query = 'SELECT * FROM pengguna WHERE role = "admin"';
        const [rows] = await connection.execute(query); // Use execute here
        await connection.end();
        return rows;  // Return the query result
    }

    // Mengambil data admin berdasarkan ID
    static async getById(id) {
        const connection = await createConnection();
        const query = 'SELECT * FROM pengguna WHERE id = ? AND role = "admin"';
        const [rows] = await connection.execute(query, [id]); // Use execute here
        await connection.end();
        return rows;  // Return the query result
    }

    // Menambahkan admin baru
    static async create(data) {
        const connection = await createConnection();
        const query = 'INSERT INTO pengguna (nama, username, email, password, role) VALUES (?, ?, ?, ?, "admin")';
        const [result] = await connection.execute(query, [
            data.nama,
            data.username,
            data.email,
            data.password
        ]); // Use execute here
        await connection.end();
        return result;  // Return the insert result
    }

    // Memperbarui data admin
    static async update(id, data) {
        const connection = await createConnection();
        const query = 'UPDATE pengguna SET nama = ?, username = ?, email = ?, password = ? WHERE id = ? AND role = "admin"';
        const [result] = await connection.execute(query, [
            data.nama,
            data.username,
            data.email,
            data.password,
            id
        ]); // Use execute here
        await connection.end();
        return result;  // Return the update result
    }

    // Menghapus data admin
    static async delete(id) {
        const connection = await createConnection();
        const query = 'DELETE FROM pengguna WHERE id = ? AND role = "admin"';
        const [result] = await connection.execute(query, [id]); // Use execute here
        await connection.end();
        return result;  // Return the delete result
    }
}

module.exports = Admin;
