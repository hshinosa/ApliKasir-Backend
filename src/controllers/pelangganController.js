const Pelanggan = require('../models/pelangganModel');
const Pengguna = require('../models/penggunaModel'); // Tambahkan model Pengguna

exports.getAllPelanggan = (req, res) => {
    Pelanggan.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getPelangganById = (req, res) => {
    const { id } = req.params;
    Pelanggan.getById(id, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Pelanggan not found');
        res.json(results[0]);
    });
};

exports.createPelanggan = (req, res) => {
    const data = {
        id_pengguna: req.body.id_pengguna,
        nama: req.body.nama,
        nomor_telepon: req.body.nomor_telepon || null,
        email: req.body.email || null,
    };

    // Validasi jika id_pengguna tidak diberikan
    if (!data.id_pengguna) {
        return res.status(400).json({ error: 'id_pengguna is required' });
    }

    // Periksa apakah id_pengguna ada di tabel pengguna
    Pengguna.getById(data.id_pengguna, (err, results) => {
        if (err) return res.status(500).send(err);

        // Jika tidak ditemukan
        if (results.length === 0) {
            return res.status(400).json({ error: 'id_pengguna does not exist in pengguna table' });
        }

        // Jika id_pengguna valid, lanjutkan pembuatan pelanggan
        Pelanggan.create(data, (err, results) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ id: results.insertId, ...data });
        });
    });
};

exports.updatePelanggan = (req, res) => {
    const { id } = req.params;
    const data = {
        id_pengguna: req.body.id_pengguna,
        nama: req.body.nama,
        nomor_telepon: req.body.nomor_telepon,
        email: req.body.email,
    };

    // Validasi jika id_pengguna tidak diberikan
    if (!data.id_pengguna) {
        return res.status(400).json({ error: 'id_pengguna is required' });
    }

    // Periksa apakah id_pengguna ada di tabel pengguna
    Pengguna.getById(data.id_pengguna, (err, results) => {
        if (err) return res.status(500).send(err);

        // Jika tidak ditemukan
        if (results.length === 0) {
            return res.status(400).json({ error: 'id_pengguna does not exist in pengguna table' });
        }

        // Jika id_pengguna valid, lanjutkan pembaruan pelanggan
        Pelanggan.update(id, data, (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Pelanggan updated successfully' });
        });
    });
};

exports.deletePelanggan = (req, res) => {
    const { id } = req.params;
    Pelanggan.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Pelanggan deleted successfully' });
    });
};
