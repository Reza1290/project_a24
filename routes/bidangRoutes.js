const express = require("express");
const router = express.Router();
const modelBidang = require("../model/bidangModel");

// router.use()
// Menampilkan daftar bidang
router.get('/dashboard', async (req, res) => {
  try {
    const result = await modelBidang.getAllBidang(); // Mengambil semua data bidang dari database
    // console.log(req)
    res.render('bidang/dashboard', {user: req.user, bidang: result });
  } catch (error) {
    console.error("Error getting bidang data:", error); // Log error lebih detail
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});



// Tambah bidang baru
router.post('/tambah', async (req, res) => {
  const { nama_bidang } = req.body;
  try {
    await modelBidang.tambahBidang({ nama_bidang });
    res.redirect('/bidang/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah bidang", error });
  }
});

// Edit bidang
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await modelBidang.getBidangById(id); // Perbaiki dengan getBidangById
    res.render('bidang/edit', {user: req.user, bidang: result[0] });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data bidang", error });
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_bidang } = req.body;
  try {
    await modelBidang.updateBidang(id, { nama_bidang });
    res.redirect('/bidang/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate bidang", error });
  }
});

// Hapus bidang
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await modelBidang.deleteBidang(id);
    res.redirect('/bidang/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus bidang", error });
  }
});

// Halaman Dashboard Bidang
router.get('/dashboard', (req, res) => {
  res.render('bidang/dashboard', {user: req.user});  // Pastikan path ini sesuai dengan lokasi file dashboard.ejs
});

module.exports = router;
