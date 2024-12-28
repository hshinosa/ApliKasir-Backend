const RiwayatAdmin = require('../models/riwayatAdminModel');

exports.getAllRiwayatAdmin = (req, res) => {
    RiwayatAdmin.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getRiwayatAdminByAdminId = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID admin is required' });
    }

    RiwayatAdmin.getByAdminId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving admin history', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No history found for the specified admin' });
        }

        res.status(200).json(results);
    });
};

exports.createRiwayatAdmin = (req, res) => {
    const data = req.body;

    if (!data.id_admin || !data.id_target || !data.tipe_aksi || !data.deskripsi_aksi) {
        return res.status(400).json({ message: 'id_admin, tipe_aksi, and deskripsi_aksi are required' });
    }

    RiwayatAdmin.create(data, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating admin history', error: err });
        }

        res.status(201).json({ message: 'Admin history created successfully', id: results.insertId });
    });
};
