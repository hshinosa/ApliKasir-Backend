const Kredit = require('../models/kreditModel');

exports.getAllKredit = async (req, res) => {
    try {
        const results = await Kredit.getAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching kredit data', error: err });
    }
};

exports.getKreditById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await Kredit.getById(id);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Kredit not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching kredit by ID', error: err });
    }
};

exports.createKredit = async (req, res) => {
    const data = req.body;
    try {
        const result = await Kredit.create(data);
        res.status(201).json({ id: result.insertId, ...data });
    } catch (err) {
        res.status(500).json({ message: 'Error creating kredit', error: err });
    }
};

exports.updateKredit = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await Kredit.update(id, data);
        res.status(200).json({ message: 'Kredit updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating kredit', error: err });
    }
};

exports.deleteKredit = async (req, res) => {
    const { id } = req.params;
    try {
        await Kredit.delete(id);
        res.status(200).json({ message: 'Kredit deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting kredit', error: err });
    }
};
