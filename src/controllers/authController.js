const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;


// Fungsi Login
exports.login = async (req, res) => {
    const { username, password, role } = req.body;
  
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }
  
    if (!['admin', 'pengguna'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either "admin" or "pengguna".' });
    }
  
    try {
      const results = await User.getByUsername(username, role);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = results[0];
  
      // Verifikasi password menggunakan bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Buat token JWT
      const token = jwt.sign({ id: user.id, username: user.username, role }, SECRET_KEY);
  
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          nama: user.nama,
          username: user.username,
          email: user.email,
          role,
          ...(role === 'pengguna' && {
            nomor_telepon: user.nomor_telepon,
            nama_toko: user.nama_toko,
            alamat_toko: user.alamat_toko,
            gambar_qris: user.gambar_qris,
            status_akun: user.status_akun,
          }),
        },
      });
    } catch (err) {
      console.error("[ERROR] Kesalahan saat login:", err);
      res.status(500).send({ message: 'Internal server error' });
    }
  };

// Fungsi Registrasi Pengguna
exports.registerPengguna = async (req, res) => {
    const { nama, username, email, password, nomor_telepon, nama_toko, alamat_toko, gambar_qris } = req.body;

    if (!nama || !username || !email || !password || !nomor_telepon || !nama_toko || !alamat_toko) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.getByUsername(username, 'pengguna');
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.getByEmail(email, 'pengguna');
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPengguna = {
            nama,
            username,
            email,
            password: hashedPassword,
            nomor_telepon,
            nama_toko,
            alamat_toko,
            gambar_qris,
        };

        const result = await User.createPengguna(newPengguna);
        res.status(201).json({ message: 'Pengguna registered successfully', id: result.insertId });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Fungsi Registrasi Admin
exports.registerAdmin = async (req, res) => {
    const { nama, username, email, password } = req.body;

    if (!nama || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.getByUsername(username, 'admin');
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.getByEmail(email, 'admin');
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = { nama, username, email, password: hashedPassword };
        const result = await User.createAdmin(newAdmin);
        res.status(201).json({ message: 'Admin registered successfully', id: result.insertId });
    } catch (err) {
        res.status(500).send(err);
    }
};
