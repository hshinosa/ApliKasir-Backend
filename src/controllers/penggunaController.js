const bcrypt = require('bcryptjs');
const Pengguna = require('../models/penggunaModel');
const Pelanggan = require('../models/pelangganModel');

exports.getAllPengguna = async (req, res) => {
    try {
        const results = await Pengguna.getAll();
        res.json(results);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getPenggunaById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await Pengguna.getById(id);
        if (results.length === 0) {
            return res.status(404).send('Pengguna not found');
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updatePengguna = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    console.log(`[DEBUG] Received update request for user ID: ${id}`); // Log awal
    console.log(`[DEBUG] Request body:`, data);

    const updatedPengguna = {
        nama: data.nama,
        username: data.username,
        email: data.email,
        role: data.role,
        updated_at: new Date()
    };

    // Jika password ada, hash password tersebut
    if (data.password) {
        try {
            console.log(`[DEBUG] Hashing password for user ID: ${id}`);
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updatedPengguna.password = hashedPassword;
        } catch (err) {
            console.error(`[ERROR] Error hashing password: ${err.message}`);
            return res.status(500).send('Error hashing password: ' + err.message);
        }
    }

    // Log data pengguna yang akan diperbarui
    console.log(`[DEBUG] Updated user data:`, updatedPengguna);

    // Jika role adalah admin
    if (data.role === 'admin') {
        try {
            console.log(`[DEBUG] Updating user with admin role for ID: ${id}`);
            await Pengguna.update(id, updatedPengguna);
            return res.json({ message: 'Pengguna updated successfully, detail tidak diubah karena role admin' });
        } catch (err) {
            console.error(`[ERROR] Error updating admin user: ${err.message}`);
            return res.status(500).send(err.message);
        }
    }

    const updatedDetailPengguna = {
        nomor_telepon: data.nomor_telepon,
        nama_toko: data.nama_toko,
        alamat_toko: data.alamat_toko,
        gambar_qris: data.gambar_qris,
        status_akun: data.status_akun,
        updated_at: new Date()
    };

    console.log(`[DEBUG] Updating user detail for ID: ${id}`);

    try {
        await Pengguna.update(id, updatedPengguna);
        await Pengguna.updateDetail(id, updatedDetailPengguna);
        console.log(`[DEBUG] User updated successfully for ID: ${id}`);
        res.json({ message: 'Pengguna updated successfully' });
    } catch (err) {
        console.error(`[ERROR] Error updating user detail: ${err.message}`);
        res.status(500).send(err.message);
    }
};

exports.deletePengguna = async (req, res) => {
    const { id } = req.params;

    try {
        await Pengguna.deleteDetail(id);
        await Pengguna.delete(id);
        res.json({ message: 'Pengguna deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.showCustomer = async (req, res) => {
    const penggunaId = req.params.id;

    try {
        // Mengambil semua data pelanggan berdasarkan ID pengguna
        const pelanggan = await Pelanggan.getByUserId(penggunaId);
        
        // Menambahkan validasi untuk memastikan data pengguna ada
        const pengguna = await Pengguna.getById(penggunaId);
        if (!pengguna || pengguna.length === 0) {
            return res.status(404).json({ 
                message: 'Pengguna tidak ditemukan' 
            });
        }

        // Return data pelanggan beserta info pengguna
        res.status(200).json(pelanggan.map(p => ({
            id: p.id,
            nama: p.nama,
            nomor_telepon: p.nomor_telepon,
            email: p.email,
            id_pengguna: penggunaId
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan saat mengambil data pelanggan' 
        });
    }
};