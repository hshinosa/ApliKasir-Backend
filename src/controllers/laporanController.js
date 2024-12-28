const Laporan = require('../models/laporanModel');

exports.getAllLaporan = (req, res) => {
    Laporan.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getLaporanById = (req, res) => {
    const { id } = req.params;
    Laporan.getById(id, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Laporan not found');
        res.json(results[0]);
    });
};

exports.createLaporan = (req, res) => {
    const data = req.body;
    Laporan.create(data, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, ...data });
    });
};

exports.updateLaporan = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    Laporan.update(id, data, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Laporan updated successfully' });
    });
};

exports.deleteLaporan = (req, res) => {
    const { id } = req.params;
    Laporan.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Laporan deleted successfully' });
    });
};
