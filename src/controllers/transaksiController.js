const Transaksi = require('../models/transaksiModel');
const Produk = require('../models/produkModel');
const Pengguna = require('../models/penggunaModel');

exports.getAllTransaksi = (req, res) => {
    // Ambil semua transaksi
    Transaksi.getAll((err, transaksi) => {
        if (err) return res.status(500).send(err);

        // Ambil detail untuk setiap transaksi
        const transaksiPromises = transaksi.map(transaksiItem => {
            return new Promise((resolve, reject) => {
                // Ambil detail transaksi berdasarkan id transaksi
                Transaksi.getDetailByTransaksiId(transaksiItem.id, (err, details) => {
                    if (err) return reject(err);

                    // Ambil informasi produk terkait dengan setiap detail transaksi
                    const produkPromises = details.map(detail => {
                        return new Promise((resolve, reject) => {
                            Produk.getById(detail.id_produk, (err, produk) => {
                                if (err) return reject(err);
                                if (produk.length === 0) return reject(`Produk dengan ID ${detail.id_produk} tidak ditemukan`);

                                // Gabungkan detail dengan produk untuk mendapatkan informasi lengkap
                                resolve({
                                    id: detail.id_produk,
                                    nama_produk: produk[0].nama_produk,
                                    harga_satuan: detail.harga_satuan,
                                    kuantitas: detail.kuantitas,
                                    subtotal: detail.harga_satuan * detail.kuantitas
                                });
                            });
                        });
                    });

                    // Tunggu hingga semua produk selesai didapatkan
                    Promise.all(produkPromises)
                        .then(produkDetails => {
                            resolve({
                                ...transaksiItem,
                                details: produkDetails
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            });
        });

        // Tunggu hingga semua transaksi dan detailnya selesai
        Promise.all(transaksiPromises)
            .then(transaksiDetails => {
                res.json(transaksiDetails);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });
};

exports.getTransaksiById = (req, res) => {
    const { id } = req.params;

    // Cek apakah transaksi dengan id ada
    Transaksi.getById(id, (err, transaksi) => {
        if (err) return res.status(500).send(err);
        if (transaksi.length === 0) return res.status(404).send('Transaksi not found');

        // Ambil detail transaksi berdasarkan id transaksi
        Transaksi.getDetailByTransaksiId(id, (err, details) => {
            if (err) return res.status(500).send(err);
            if (details.length === 0) return res.status(404).send('Details not found for this transaction');

            // Ambil informasi produk terkait dengan setiap detail transaksi
            const produkPromises = details.map(detail => {
                return new Promise((resolve, reject) => {
                    Produk.getById(detail.id_produk, (err, produk) => {
                        if (err) return reject(err);
                        if (produk.length === 0) return reject(`Produk dengan ID ${detail.id_produk} tidak ditemukan`);
                        
                        // Gabungkan detail dengan produk untuk mendapatkan informasi lengkap
                        resolve({
                            id: detail.id_produk,
                            nama_produk: produk[0].nama_produk,
                            harga_satuan: detail.harga_satuan,
                            kuantitas: detail.kuantitas,
                            subtotal: detail.harga_satuan * detail.kuantitas
                        });
                    });
                });
            });

            // Tunggu hingga semua produk selesai didapatkan
            Promise.all(produkPromises)
                .then(produkDetails => {
                    res.json({
                        ...transaksi[0],
                        details: produkDetails
                    });
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
    });
};

exports.createTransaksi = (req, res) => {
    const { id_pengguna, metode_pembayaran, jenis_transaksi, items } = req.body;

    // Validasi input
    if (!id_pengguna || !items || items.length === 0 || !jenis_transaksi) {
        return res.status(400).json({ message: 'id_pengguna, jenis_transaksi, and items are required' });
    }

    // Validasi jenis_transaksi
    if (!['pembayaran', 'kredit'].includes(jenis_transaksi)) {
        return res.status(400).json({ message: 'Invalid jenis_transaksi' });
    }

    // Cek apakah ID Pengguna ada dalam tabel pengguna
    Pengguna.getById(id_pengguna, (err, pengguna) => {
        if (err) return res.status(500).send(err);
        if (pengguna.length === 0) return res.status(404).json({ message: `Pengguna dengan ID ${id_pengguna} tidak ditemukan` });

        // Hitung total harga berdasarkan produk
        let total_harga = 0;

        // Validasi produk dan hitung subtotal
        Promise.all(
            items.map(item => {
                return new Promise((resolve, reject) => {
                    Produk.getById(item.id_produk, (err, produk) => {
                        if (err) return reject(err);
                        if (produk.length === 0) return reject(`Produk dengan ID ${item.id_produk} tidak ditemukan`);

                        // Hitung harga total untuk item
                        item.harga_satuan = produk[0].harga_jual;
                        total_harga += produk[0].harga_jual * item.kuantitas;
                        resolve();
                    });
                });
            })
        )
        .then(() => {
            // Buat transaksi
            const transaksiData = { id_pengguna, metode_pembayaran, jenis_transaksi, total_harga };

            Transaksi.create(transaksiData, (err, results) => {
                if (err) return res.status(500).send(err);
                const id_transaksi = results.insertId;

                // Buat detail transaksi
                const detailPromises = items.map(item => {
                    return new Promise((resolve, reject) => {
                        Transaksi.createDetail({
                            id_transaksi,
                            id_produk: item.id_produk,
                            kuantitas: item.kuantitas,
                            harga_satuan: item.harga_satuan,
                        }, (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });

                // Tunggu hingga semua detail transaksi selesai
                Promise.all(detailPromises)
                    .then(() => {
                        res.status(201).json({ message: 'Transaksi created successfully', id_transaksi });
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
            });
        })
        .catch(err => {
            res.status(400).json({ message: err.message });
        });
    });
};
