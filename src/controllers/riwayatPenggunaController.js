const RiwayatPengguna = require('../models/riwayatPenggunaModel');

exports.getAllRiwayatPengguna = async (req, res) => {
    try {
        const results = await RiwayatPengguna.getAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user history', error: err });
    }
};

exports.getRiwayatPenggunaByPenggunaId = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await RiwayatPengguna.getByPenggunaId(id);
        if (results.length === 0) {
            return res.status(404).json({ message: `No history found for user ID ${id}` });
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user history', error: err });
    }
};

exports.createRiwayatPengguna = async (req, res) => {
    const data = req.body;
    try {
        const result = await RiwayatPengguna.create(data);
        res.status(201).json({ message: 'User history created successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user history', error: err });
    }
};
