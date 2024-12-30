const RiwayatAdmin = require('../models/riwayatAdminModel');

exports.getAllRiwayatAdmin = async (req, res) => {
    try {
        const results = await RiwayatAdmin.getAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching admin history', error: err });
    }
};

exports.getRiwayatAdminByAdminId = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await RiwayatAdmin.getByAdminId(id);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No history found for the specified admin' });
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving admin history', error: err });
    }
};

exports.createRiwayatAdmin = async (req, res) => {
    const data = req.body;
    try {
        const result = await RiwayatAdmin.create(data);
        res.status(201).json({ message: 'Admin history created successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Error creating admin history', error: err });
    }
};
