const RiwayatPengguna = require('../models/riwayatPenggunaModel');

exports.getAllRiwayatPengguna = (req, res) => {
    RiwayatPengguna.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getRiwayatPenggunaByPenggunaId = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'id_pengguna is required' });
    }

    RiwayatPengguna.getByPenggunaId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user history', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `No history found for user ID ${id}` });
        }

        res.status(200).json({ data: results });
    });
};


exports.createRiwayatPengguna = (req, res) => {
    const data = req.body;

    // Validasi data input
    if (!data.id_pengguna || !data.kategori || !data.deskripsi) {
        return res.status(400).json({ message: 'id_pengguna, kategori, and deskripsi are required' });
    }

    RiwayatPengguna.create(data, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating pengguna history', error: err });
        }

        res.status(201).json({ message: 'Pengguna history created successfully', id: results.insertId });
    });
};