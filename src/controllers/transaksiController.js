const Transaksi = require('../models/transaksiModel');
const Produk = require('../models/produkModel');
const Pengguna = require('../models/penggunaModel');

// Get all transactions with details
exports.getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.getAll();
        
        const transaksiDetails = await Promise.all(transaksi.map(async (transaksiItem) => {
            const details = await Transaksi.getDetailByTransaksiId(transaksiItem.id);

            const produkDetails = await Promise.all(details.map(async (detail) => {
                const produk = await Produk.getById(detail.id_produk);
                if (!produk.length) throw new Error(`Produk dengan ID ${detail.id_produk} tidak ditemukan`);

                return {
                    id: detail.id_produk,
                    nama_produk: produk[0].nama_produk,
                    harga_satuan: detail.harga_satuan,
                    kuantitas: detail.kuantitas,
                    subtotal: detail.harga_satuan * detail.kuantitas,
                };
            }));

            return {
                ...transaksiItem,
                details: produkDetails,
            };
        }));

        res.status(200).json(transaksiDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single transaction by ID with details
exports.getTransaksiById = async (req, res) => {
    const { id } = req.params;
    try {
        const transaksi = await Transaksi.getById(id);
        if (!transaksi.length) return res.status(404).json({ message: 'Transaksi not found' });

        const details = await Transaksi.getDetailByTransaksiId(id);
        const produkDetails = await Promise.all(details.map(async (detail) => {
            const produk = await Produk.getById(detail.id_produk);
            if (!produk.length) throw new Error(`Produk dengan ID ${detail.id_produk} tidak ditemukan`);

            return {
                id: detail.id_produk,
                nama_produk: produk[0].nama_produk,
                harga_satuan: detail.harga_satuan,
                kuantitas: detail.kuantitas,
                subtotal: detail.harga_satuan * detail.kuantitas,
            };
        }));

        res.status(200).json({
            ...transaksi[0],
            details: produkDetails,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new transaction
exports.createTransaksi = async (req, res) => {
    const { id_pengguna, metode_pembayaran, jenis_transaksi, items } = req.body;

    // Validate input
    if (!id_pengguna || !items || !items.length || !jenis_transaksi) {
        return res.status(400).json({ message: 'id_pengguna, jenis_transaksi, and items are required' });
    }

    if (!['pembayaran', 'kredit'].includes(jenis_transaksi)) {
        return res.status(400).json({ message: 'Invalid jenis_transaksi' });
    }

    try {
        const pengguna = await Pengguna.getById(id_pengguna);
        if (!pengguna.length) {
            return res.status(404).json({ message: `Pengguna dengan ID ${id_pengguna} tidak ditemukan` });
        }

        let total_harga = 0;

        // Validate and calculate total price
        await Promise.all(items.map(async (item) => {
            const produk = await Produk.getById(item.id_produk);
            if (!produk.length) throw new Error(`Produk dengan ID ${item.id_produk} tidak ditemukan`);

            item.harga_satuan = produk[0].harga_jual;
            total_harga += produk[0].harga_jual * item.kuantitas;
        }));

        const transaksiData = { id_pengguna, metode_pembayaran, jenis_transaksi, total_harga };
        const { insertId: id_transaksi } = await Transaksi.create(transaksiData);

        // Create transaction details
        await Promise.all(items.map(async (item) => {
            await Transaksi.createDetail({
                id_transaksi,
                id_produk: item.id_produk,
                kuantitas: item.kuantitas,
                harga_satuan: item.harga_satuan,
            });
        }));

        res.status(201).json({ message: 'Transaksi created successfully', id_transaksi });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
