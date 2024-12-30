const Produk = require("../models/produkModel");
const Pengguna = require("../models/penggunaModel"); // Import model Pengguna untuk validasi
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const firebaseConfig = require("../config/firebase.config");
const path = require("path");

// Helper: Validasi pengguna berdasarkan ID
const getPenggunaById = (id_pengguna) => {
  return new Promise((resolve, reject) => {
    Pengguna.getById(id_pengguna, (err, pengguna) => {
      if (err) return reject(err);
      if (pengguna.length === 0) return resolve(null);
      resolve(pengguna[0]);
    });
  });
};

// Helper: Validasi produk berdasarkan ID
const getByID = (id) => {
  return new Promise((resolve, reject) => {
    Produk.getById(id, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Helper: Upload gambar produk baru
const uploadNewPoductPicture = async (produkPict) => {
  if (!produkPict) {
    throw new Error("File tidak valid");
  }

  const produkPictFileExtension = path.extname(produkPict.originalname);
  const produkPictFileOriginalName = path.basename(
    produkPict.originalname,
    produkPictFileExtension
  );
  const newProdukPictfileName = `${Date.now()}_${produkPictFileOriginalName}${produkPictFileExtension}`;

  const { firebaseStorage } = await firebaseConfig();
  const storageRef = ref(
    firebaseStorage,
    `foto-produk/${newProdukPictfileName}`
  );

  const produkPictBuffer = produkPict.buffer;

  const resultProdukPict = await uploadBytes(storageRef, produkPictBuffer, {
    contentType: produkPict.mimetype,
  });

  return await getDownloadURL(resultProdukPict.ref);
};

// Get semua produk
exports.getAllProduk = async (req, res) => {
  try {
      const results = await Produk.getAll();
      res.json(results);
  } catch (err) {
      res.status(500).send(err);
  }
};

// Get produk berdasarkan ID
exports.getProdukById = async (req, res) => {
  const { id } = req.params;
  try {
      const results = await Produk.getById(id);
      if (results.length === 0) return res.status(404).send("Produk not found");
      res.json(results[0]);
  } catch (err) {
      res.status(500).send(err);
  }
};

exports.getProdukByUser = async (req, res) => {
  const { id } = req.params;
  try {
      const results = await Produk.getByUserId(id);
      res.status(200).json(results);
  } catch (err) {
      console.error(`Error fetching produk for User ID ${id}:`, err.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};

// Create produk baru dengan respons berkali-kali
exports.createProduk = async (req, res) => {
  const {
    id_pengguna,
    nama_produk,
    kode_produk,
    jumlah_produk,
    harga_modal,
    harga_jual,
  } = req.body;
  const gambar_produk = req.file;

  // Atur header untuk streaming data
  res.setHeader("Content-Type", "application/json");

  try {
    // Validasi input
    res.write(JSON.stringify({ step: 1, message: "Validating input..." }) + "\n");
    if (
      !id_pengguna ||
      !nama_produk ||
      !kode_produk ||
      !jumlah_produk ||
      !harga_modal ||
      !harga_jual
    ) {
      res.write(
        JSON.stringify({ step: 1, message: "Validation failed: Missing fields" }) + "\n"
      );
      return res.end();
    }

    // Validasi pengguna
    res.write(JSON.stringify({ step: 2, message: "Validating pengguna..." }) + "\n");
    const pengguna = await getPenggunaById(id_pengguna);
    if (!pengguna) {
      res.write(
        JSON.stringify({ step: 2, message: "Validation failed: Invalid id_pengguna" }) + "\n"
      );
      return res.end();
    }

    // Upload gambar jika ada
    res.write(JSON.stringify({ step: 3, message: "Uploading gambar produk..." }) + "\n");
    const produkPICT = gambar_produk
      ? await uploadNewPoductPicture(gambar_produk)
      : null;

    res.write(
      JSON.stringify({ step: 3, message: "Upload successful", url: produkPICT }) + "\n"
    );

    // Simpan data ke database
    res.write(JSON.stringify({ step: 4, message: "Saving produk to database..." }) + "\n");
    const data = {
      id_pengguna,
      gambar_produk: produkPICT,
      nama_produk,
      kode_produk,
      jumlah_produk,
      harga_modal,
      harga_jual,
      created_at: new Date(),
      updated_at: new Date(),
    };

    Produk.create(data, (err, results) => {
      if (err) {
        res.write(JSON.stringify({ step: 4, message: "Database error", error: err }) + "\n");
        return res.end();
      }

      res.write(
        JSON.stringify({
          step: 4,
          message: "Produk created successfully",
          produk: { id: results.insertId, ...data },
        }) + "\n"
      );
      return res.end(); // Akhiri respons setelah selesai
    });
  } catch (error) {
    console.error(error);
    res.write(JSON.stringify({ step: "error", message: error.message }) + "\n");
    res.end(); // Pastikan tetap ditutup
  }
};

// Update product
exports.updateProduk = async (req, res) => {
  const { id } = req.params;
  const { id_pengguna, nama_produk, kode_produk, jumlah_produk, harga_modal, harga_jual } = req.body;

  if (!id_pengguna || !nama_produk || !kode_produk || jumlah_produk == null || harga_jual == null) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      const penggunaExists = await Pengguna.getById(id_pengguna);
      if (!penggunaExists) {
          return res.status(400).json({ error: 'Pengguna tidak ditemukan' });
      }

      const data = { id_pengguna, nama_produk, kode_produk, jumlah_produk, harga_modal, harga_jual };

      await Produk.update(id, data);
      res.json({ message: 'Produk berhasil diperbarui' });
  } catch (err) {
      console.error(`Error updating produk with ID ${id}:`, err.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product
exports.deleteProduk = async (req, res) => {
  const { id } = req.params;

  try {
      const produk = await Produk.getById(id);
      if (!produk) {
          return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      await Produk.delete(id);
      res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
      console.error(`Error deleting produk with ID ${id}:`, err.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};


// const Produk = require("../models/produkModel");
// const Pengguna = require("../models/penggunaModel"); // Import model Pengguna untuk validasi
// const {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } = require("firebase/storage");
// const firebaseConfig = require("../config/firebase.config");
// const path = require("path");
// const { console } = require("inspector");

// exports.getAllProduk = (req, res) => {
//   Produk.getAll((err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// };

// exports.getProdukById = (req, res) => {
//   const { id } = req.params;
//   Produk.getById(id, (err, results) => {
//     if (err) return res.status(500).send(err);
//     if (results.length === 0) return res.status(404).send("Produk not found");
//     res.json(results[0]);
//   });
// };

// exports.createProduk = async (req, res) => {
//   const {
//     id_pengguna,
//     nama_produk,
//     kode_produk,
//     jumlah_produk,
//     harga_modal,
//     harga_jual,
//   } = req.body;
//   const gambar_produk = req.file;

//   try {
//     // Validasi input
//     if (
//       !id_pengguna ||
//       !nama_produk ||
//       !kode_produk ||
//       !jumlah_produk ||
//       !harga_modal ||
//       !harga_jual
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All fields are required except gambar_produk" });
//     }

//     Pengguna.getById(id_pengguna, (err, pengguna) => {
//       if (err) return res.status(500).send(err);
//       if (pengguna.length === 0)
//         return res.status(404).json({ message: "Invalid id_pengguna" });
//     });

//     const produkPICT = gambar_produk
//       ? await uploadNewPoductPicture(gambar_produk)
//       : null;

//     const data = {
//       id_pengguna,
//       gambar_produk: produkPICT,
//       nama_produk,
//       kode_produk,
//       jumlah_produk,
//       harga_modal,
//       harga_jual,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };

//     Produk.create(data, (err, results) => {
//       if (err) return res.status(500).send(err);
//       res.status(201).json({ id: results.insertId, ...data });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getByID = (id) => {
//   return new Promise((resolve, reject) => {
//     Produk.getById(id, (err, results) => {
//       if (err) {
//         return reject(err); // Jika ada error, reject Promise
//       }
//       resolve(results); // Jika sukses, resolve Promise dengan data
//     });
//   });
// };

// const uploadNewPoductPicture = async (produkPict) => {
//   if (!produkPict) {
//     throw new Error("File tidak valid");
//   }

//   const produkPictFileExtension = path.extname(produkPict.originalname);
//   const produkPictFileOriginalName = path.basename(
//     produkPict.originalname,
//     produkPictFileExtension
//   );
//   const newProdukPictfileName = `${Date.now()}_${produkPictFileOriginalName}${produkPictFileExtension}`;

//   const { firebaseStorage } = await firebaseConfig();
//   const storageRef = ref(
//     firebaseStorage,
//     `foto-produk/${newProdukPictfileName}`
//   );

//   const produkPictBuffer = produkPict.buffer;

//   const resultProdukPict = await uploadBytes(storageRef, produkPictBuffer, {
//     contentType: produkPict.mimetype,
//   });

//   return await getDownloadURL(resultProdukPict.ref);
// };