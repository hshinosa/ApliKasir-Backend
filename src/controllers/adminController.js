const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');

exports.getAllAdmin = async (req, res) => {
    try {
        const results = await Admin.getAll();  // Await the promise returned by getAll
        res.json(results);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).send('Failed to fetch admin data');
    }
};

exports.getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await Admin.getById(id);  // Await the promise returned by getById
        if (results.length === 0) {
            return res.status(404).send('Admin not found');
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching admin by ID:', err);
        res.status(500).send('Failed to fetch admin data');
    }
};

exports.createAdmin = async (req, res) => {
    const { nama, username, email, password } = req.body;

    if (!nama || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const data = {
        nama,
        username,
        email,
        password: hashedPassword,
        created_at: new Date() // Set current timestamp
    };

    try {
        const results = await Admin.create(data);  // Await the promise returned by create
        res.status(201).json({ id: results.insertId, ...data });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ message: 'Failed to create admin' });
    }
};

exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const results = await Admin.update(id, data);  // Await the promise returned by update
        res.json({ message: 'Admin updated successfully' });
    } catch (err) {
        console.error('Error updating admin:', err);
        res.status(500).send('Failed to update admin');
    }
};

exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await Admin.delete(id);  // Await the promise returned by delete
        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).send('Failed to delete admin');
    }
};
