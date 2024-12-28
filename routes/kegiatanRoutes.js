const express = require("express");
const router = express.Router();
const modelKegiatan = require("../model/kegiatanModel");
const modelProgram = require("../model/programModel");

// Daftar nilai ENUM yang valid untuk 'satuan_kegiatan'
const validSatuanKegiatan = [
  'Unit', 'Liter', 'Persentase', 'Dokumen', 'Berita Acara', 'Masukan', 'Paket', 
  'Orang', 'Jam', 'Bulan', 'Tahun', 'Lembar'
];

// Menampilkan daftar kegiatan dan program
router.get('/dashboard', async (req, res) => {
  try {
    const kegiatanList = await modelKegiatan.getAllKegiatan(); // Mengambil semua data kegiatan
    const programList = await modelProgram.getAllProgram(); // Mengambil semua data program
    res.render('kegiatan/dashboard', {user:req.user, kegiatan: kegiatanList, program: programList }); // Mengirimkan data kegiatan dan program
  } catch (error) {
    console.error("Error getting kegiatan data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data kegiatan", error });
  }
});

// Menampilkan form tambah kegiatan
router.get('/tambah', async (req, res) => {
  try {
    const programList = await modelProgram.getAllProgram(); // Mengambil semua program untuk dropdown
    res.render('kegiatan/tambah', {user:req.user, program: programList }); // Path harus sesuai dengan file tambah.ejs
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data program", error });
  }
});

// Tambah kegiatan baru
router.post('/tambah', async (req, res) => {
  const { id_program, nama_kegiatan, indikator_kegiatan, target, satuan_kegiatan } = req.body;

  // Validasi satuan_kegiatan harus sesuai dengan nilai ENUM
  if (!validSatuanKegiatan.includes(satuan_kegiatan)) {
    return res.status(400).json({ message: 'Satuan Kegiatan tidak valid' });
  }

  try {
    await modelKegiatan.tambahKegiatan({ id_program, nama_kegiatan, indikator_kegiatan, target, satuan_kegiatan });
    res.redirect('/kegiatan/dashboard');
  } catch (error) {
    console.error("Gagal menambah kegiatan:", error);
    res.status(500).json({ message: "Gagal menambah kegiatan", error });
  }
});

// Menampilkan form edit kegiatan
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const kegiatan = await modelKegiatan.getKegiatanById(id); // Mendapatkan data kegiatan berdasarkan ID
    const programList = await modelProgram.getAllProgram(); // Mengambil semua program untuk dropdown
    res.render('kegiatan/edit', {user:req.user, kegiatan: kegiatan[0], program: programList }); // Pastikan path dan struktur sesuai
  } catch (error) {
    console.error("Gagal memuat data kegiatan:", error);
    res.status(500).json({ message: "Gagal memuat data kegiatan", error });
  }
});

// Edit kegiatan
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { id_program, nama_kegiatan, indikator_kegiatan, target, satuan_kegiatan } = req.body;

  // Validasi satuan_kegiatan harus sesuai dengan nilai ENUM
  if (!validSatuanKegiatan.includes(satuan_kegiatan)) {
    return res.status(400).json({ message: 'Satuan Kegiatan tidak valid' });
  }

  try {
    await modelKegiatan.updateKegiatan(id, { id_program, nama_kegiatan, indikator_kegiatan, target, satuan_kegiatan });
    res.redirect('/kegiatan/dashboard');
  } catch (error) {
    console.error("Gagal mengupdate kegiatan:", error);
    res.status(500).json({ message: "Gagal mengupdate kegiatan", error });
  }
});

// Hapus kegiatan
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await modelKegiatan.deleteKegiatan(id);
    res.redirect('/kegiatan/dashboard');
  } catch (error) {
    console.error("Gagal menghapus kegiatan:", error);
    res.status(500).json({ message: "Gagal menghapus kegiatan", error });
  }
});

module.exports = router;
