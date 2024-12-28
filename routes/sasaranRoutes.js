const express = require("express");
const router = express.Router();
const modelSasaran = require("../model/sasaranModel");

// Menampilkan daftar sasaran
router.get('/dashboard', async (req, res) => {
  try {
    const result = await modelSasaran.getAllSasaran(); // Mengambil semua data sasaran dari database
    res.render('sasaran/dashboard', { user:req.user,sasaran: result });
  } catch (error) {
    console.error("Error getting sasaran data:", error); // Log error lebih detail
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

// Tambah sasaran baru
router.post('/tambah', async (req, res) => {
  const { nama_sasaran, indikator_sasaran } = req.body;
  try {
    await modelSasaran.tambahSasaran({ nama_sasaran, indikator_sasaran });
    res.redirect('/sasaran/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah sasaran", error });
  }
});

// Edit sasaran
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await modelSasaran.getSasaranById(id);
    res.render('sasaran/edit', { user:req.user, sasaran: result[0] });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data sasaran", error });
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_sasaran, indikator_sasaran } = req.body;
  try {
    await modelSasaran.updateSasaran(id, { nama_sasaran, indikator_sasaran });
    res.redirect('/sasaran/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate sasaran", error });
  }
});

// Hapus sasaran
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await modelSasaran.deleteSasaran(id);
    res.redirect('/sasaran/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus sasaran", error });
  }
});

// Halaman Dashboard Sasaran
router.get('/dashboard', (req, res) => {
  res.render('sasaran/dashboard'); // Pastikan path ini sesuai dengan lokasi file dashboard.ejs
});

module.exports = router;
