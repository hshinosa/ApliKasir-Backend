const Pengguna = require('../models/penggunaModel');

exports.getAllPengguna = (req, res) => {
    Pengguna.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getPenggunaById = (req, res) => {
    const { id } = req.params;
    Pengguna.getById(id, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Pengguna not found');
        res.json(results[0]);
    });
};

exports.updatePengguna = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const updatedPengguna = {
        nama: data.nama,
        username: data.username,
        email: data.email,
        password: data.password, // Pastikan Anda melakukan hash pada password jika diubah
        role: data.role,
        updated_at: new Date()
    };

    const updatedDetailPengguna = {
        nomor_telepon: data.nomor_telepon,
        nama_toko: data.nama_toko,
        alamat_toko: data.alamat_toko,
        gambar_qris: data.gambar_qris,
        status_akun: data.status_akun,
        updated_at: new Date()
    };

    Pengguna.update(id, updatedPengguna, (err) => {
        if (err) return res.status(500).send(err);

        Pengguna.updateDetail(id, updatedDetailPengguna, (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Pengguna updated successfully' });
        });
    });
};

exports.deletePengguna = (req, res) => {
    const { id } = req.params;

    Pengguna.deleteDetail(id, (err) => {
        if (err) return res.status(500).send(err);

        Pengguna.delete(id, (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Pengguna deleted successfully' });
        });
    });
};
