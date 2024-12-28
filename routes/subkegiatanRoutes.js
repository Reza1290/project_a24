const express = require("express");
const router = express.Router();
const modelSubKegiatan = require("../model/subkegiatanModel"); // Model untuk sub_kegiatan
const modelKegiatan = require("../model/kegiatanModel"); // Model untuk kegiatan
const verifyUserType = require("../middleware/verifyUserType");

// Daftar nilai ENUM yang valid untuk 'satuan_sub_kegiatan'
const validSatuanSubKegiatan = [
  'Unit', 'Liter', 'Persentase', 'Dokumen', 'Berita Acara', 'Masukan', 'Paket', 
  'Orang', 'Jam', 'Bulan', 'Tahun', 'Lembar'
];

// Menampilkan daftar sub-kegiatan
router.get('/dashboard', async (req, res) => {
  try {
    // Ambil data kegiatan dan sub-kegiatan
    const kegiatanList = await modelKegiatan.getAllKegiatan(); // Ambil data kegiatan
    const subKegiatanList = await modelSubKegiatan.getAllSubKegiatan(); // Ambil data sub-kegiatan
    
    // Kirim data kegiatan dan sub-kegiatan ke template
    res.render('sub_kegiatan/dashboard', { user:req.user, kegiatan: kegiatanList, sub_kegiatan: subKegiatanList });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data", error });
  }
});

// Menampilkan form tambah sub-kegiatan
router.get('/tambah',verifyUserType(['super_admin','user']),  async (req, res) => {
  try {
    const kegiatanList = await modelKegiatan.getAllKegiatan(); // Mengambil semua kegiatan untuk dropdown
    res.render('sub_kegiatan/tambah', { user:req.user, kegiatan: kegiatanList });
  } catch (error) {
    console.error("Gagal memuat data kegiatan:", error);
    res.status(500).json({ message: "Gagal memuat data kegiatan", error });
  }
});

// Tambah sub-kegiatan baru
router.post('/tambah',verifyUserType(['super_admin','user']), async (req, res) => {
  const { id_kegiatan, nama_sub_kegiatan, indikator_sub_kegiatan, target, satuan_sub_kegiatan, anggaran_sub_kegiatan } = req.body;

  // Validasi satuan_sub_kegiatan harus sesuai dengan nilai ENUM
  if (!validSatuanSubKegiatan.includes(satuan_sub_kegiatan)) {
    return res.status(400).json({ message: 'Satuan Sub Kegiatan tidak valid' });
  }

  try {
    await modelSubKegiatan.tambahSubKegiatan({ 
      id_kegiatan, 
      nama_sub_kegiatan, 
      indikator_sub_kegiatan, 
      target, 
      satuan_sub_kegiatan, 
      anggaran_sub_kegiatan 
    });
    res.redirect('/sub_kegiatan/dashboard');
  } catch (error) {
    console.error("Gagal menambah sub-kegiatan:", error);
    res.status(500).json({ message: "Gagal menambah sub-kegiatan", error });
  }
});

// Menampilkan form edit sub-kegiatan
router.get('/edit/:id',verifyUserType(['super_admin','user']), async (req, res) => {
  const { id } = req.params;
  try {
    const subKegiatan = await modelSubKegiatan.getSubKegiatanById(id); // Mendapatkan data sub-kegiatan berdasarkan ID
    const kegiatanList = await modelKegiatan.getAllKegiatan(); // Mengambil semua kegiatan untuk dropdown
    res.render('sub_kegiatan/edit', {user:req.user, sub_kegiatan: subKegiatan[0], kegiatan: kegiatanList });
  } catch (error) {
    console.error("Gagal memuat data sub-kegiatan:", error);
    res.status(500).json({ message: "Gagal memuat data sub-kegiatan", error });
  }
});

// Edit sub-kegiatan
router.post('/edit/:id',verifyUserType(['super_admin','user']), async (req, res) => {
  const { id } = req.params;
  const { id_kegiatan, nama_sub_kegiatan, indikator_sub_kegiatan, target, satuan_sub_kegiatan, anggaran_sub_kegiatan } = req.body;

  // Validasi satuan_sub_kegiatan harus sesuai dengan nilai ENUM
  if (!validSatuanSubKegiatan.includes(satuan_sub_kegiatan)) {
    return res.status(400).json({ message: 'Satuan Sub Kegiatan tidak valid' });
  }

  try {
    await modelSubKegiatan.updateSubKegiatan(id, { 
      id_kegiatan, 
      nama_sub_kegiatan, 
      indikator_sub_kegiatan, 
      target, 
      satuan_sub_kegiatan, 
      anggaran_sub_kegiatan 
    });
    res.redirect('/sub_kegiatan/dashboard');
  } catch (error) {
    console.error("Gagal mengupdate sub-kegiatan:", error);
    res.status(500).json({ message: "Gagal mengupdate sub-kegiatan", error });
  }
});

// Hapus sub-kegiatan
router.get('/delete/:id',verifyUserType(['super_admin','user']), async (req, res) => {
  const { id } = req.params;
  try {
    await modelSubKegiatan.deleteSubKegiatan(id);
    res.redirect('/sub_kegiatan/dashboard');
  } catch (error) {
    console.error("Gagal menghapus sub-kegiatan:", error);
    res.status(500).json({ message: "Gagal menghapus sub-kegiatan", error });
  }
});

module.exports = router;
