const Laporan = require('../models/laporanModel');

exports.getAllLaporan = async (req, res) => {
    try {
        const results = await Laporan.getAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching laporan data', error: err });
    }
};

exports.getLaporanById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await Laporan.getById(id);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Laporan not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching laporan by ID', error: err });
    }
};

exports.createLaporan = async (req, res) => {
    const data = req.body;
    try {
        const result = await Laporan.create(data);
        res.status(201).json({ id: result.insertId, ...data });
    } catch (err) {
        res.status(500).json({ message: 'Error creating laporan', error: err });
    }
};

exports.updateLaporan = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await Laporan.update(id, data);
        res.status(200).json({ message: 'Laporan updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating laporan', error: err });
    }
};

exports.deleteLaporan = async (req, res) => {
    const { id } = req.params;
    try {
        await Laporan.delete(id);
        res.status(200).json({ message: 'Laporan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting laporan', error: err });
    }
};
