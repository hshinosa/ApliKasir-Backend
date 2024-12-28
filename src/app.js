require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const penggunaRoutes = require('./routes/penggunaRoutes');
const produkRoutes = require('./routes/produkRoutes');
const adminRoutes = require('./routes/adminRoutes');
const kreditRoutes = require('./routes/kreditRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const pelangganRoutes = require('./routes/pelangganRoutes');
const riwayatAdminRoutes = require('./routes/riwayatAdminRoutes');
const riwayatPenggunaRoutes = require('./routes/riwayatPenggunaRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use('/api/pengguna', penggunaRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kredit', kreditRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/pelanggan', pelangganRoutes);
app.use('/api/riwayatadmin', riwayatAdminRoutes);
app.use('/api/riwayatpengguna', riwayatPenggunaRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
