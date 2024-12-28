const Kredit = require('../models/kreditModel');

exports.getAllKredit = (req, res) => {
    Kredit.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getKreditById = (req, res) => {
    const { id } = req.params;
    Kredit.getById(id, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Kredit not found');
        res.json(results[0]);
    });
};

exports.createKredit = (req, res) => {
    const data = req.body;
    Kredit.create(data, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, ...data });
    });
};

exports.updateKredit = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    Kredit.update(id, data, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Kredit updated successfully' });
    });
};

exports.deleteKredit = (req, res) => {
    const { id } = req.params;
    Kredit.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Kredit deleted successfully' });
    });
};
