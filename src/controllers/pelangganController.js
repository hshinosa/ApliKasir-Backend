const Pelanggan = require('../models/pelangganModel');
const Pengguna = require('../models/penggunaModel');


exports.getAllPelanggan = async (req, res) => {
    try {
        const results = await Pelanggan.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching pelanggan data:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPelangganById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await Pelanggan.getById(id);
        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'Pelanggan not found' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error(`Error fetching pelanggan with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fungsi untuk Registrasi Pelanggan
exports.createPelanggan = async (req, res) => {
    const { id_pengguna, nama, nomor_telepon, email } = req.body;

    // Validasi jika semua field yang dibutuhkan ada
    if (!id_pengguna || !nama) {
        return res.status(400).json({ message: 'id_pengguna and nama are required' });
    }

    try {
        // Mengecek apakah id_pengguna ada di tabel Pengguna
        const penggunaResults = await Pengguna.getById(id_pengguna);
        if (penggunaResults.length === 0) {
            return res.status(400).json({ message: 'id_pengguna does not exist in pengguna table' });
        }

        // Data pelanggan yang akan disimpan
        const data = {
            id_pengguna,
            nama,
            nomor_telepon,
            email: email || null,  // Jika email tidak ada, set null
        };

        // Menyimpan data pelanggan baru ke database
        const results = await Pelanggan.create(data);
        res.status(201).json({ message: 'Pelanggan created successfully', id: results.insertId, ...data });
    } catch (err) {
        console.error('Error creating pelanggan:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updatePelanggan = async (req, res) => {
    const { id } = req.params;
    const { id_pengguna, nama, nomor_telepon, email } = req.body;

    // Validate required fields
    if (!id_pengguna || !nama || id_pengguna == null) {
        return res.status(400).json({ error: 'id_pengguna or nama are required' });
    }

    try {
        // Check if the pengguna exists
        const penggunaResults = await Pengguna.getById(id_pengguna);
        if (penggunaResults.length === 0) {
            return res.status(400).json({ error: 'id_pengguna does not exist in pengguna table' });
        }

        // Prepare the data for updating
        const data = {
            id_pengguna,
            nama,
            nomor_telepon: nomor_telepon|| null,
            email: email || null, // Set email to null if not provided
        };

        // Update the pelanggan in the database
        await Pelanggan.update(id, data);
        res.json({ message: 'Pelanggan updated successfully' });
    } catch (err) {
        console.error(`Error updating pelanggan with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deletePelanggan = async (req, res) => {
    const { id } = req.params;
    try {
        await Pelanggan.delete(id);
        res.json({ message: 'Pelanggan deleted successfully' });
    } catch (err) {
        console.error(`Error deleting pelanggan with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
