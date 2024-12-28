const express = require("express");
const router = express.Router();
const modelProgram = require("../model/programModel");
const modelSasaran = require("../model/sasaranModel");

// Daftar nilai ENUM yang valid untuk 'satuan_program'
const validSatuanProgram = [
  'Unit', 'Liter', 'Persentase', 'Dokumen', 'Berita Acara', 'Masukan', 'Paket', 
  'Orang', 'Jam', 'Bulan', 'Tahun', 'Lembar'
];

// Menampilkan daftar program dan sasaran
router.get('/dashboard', async (req, res) => {
  try {
    const programs = await modelProgram.getAllProgram(); // Mengambil semua data program
    const sasaranList = await modelSasaran.getAllSasaran(); // Mengambil semua sasaran
    res.render('program/dashboard', { user:req.user, programs, sasaran: sasaranList }); // Mengirimkan data program dan sasaran
  } catch (error) {
    console.error("Error getting program data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data program", error });
  }
});

// Menampilkan form tambah program
router.get('/tambah', async (req, res) => {
  try {
    const sasaranList = await modelSasaran.getAllSasaran(); // Mengambil semua sasaran untuk dropdown
    res.render('program/tambah', {user:req.user, sasaran: sasaranList }); // Path harus sesuai dengan file tambah.ejs
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data sasaran", error });
  }
});

// Tambah program baru
router.post('/tambah', async (req, res) => {
  const { id_sasaran, nama_program, indikator_program, satuan_program } = req.body;

  // Validasi satuan_program harus sesuai dengan nilai ENUM
  if (!validSatuanProgram.includes(satuan_program)) {
    return res.status(400).json({ message: 'Satuan Program tidak valid' });
  }

  try {
    await modelProgram.tambahProgram({ id_sasaran, nama_program, indikator_program, satuan_program });
    res.redirect('/program/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah program", error });
  }
});

// Menampilkan form edit program
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const program = await modelProgram.getProgramById(id); // Mendapatkan data program berdasarkan ID
    const sasaranList = await modelSasaran.getAllSasaran(); // Mengambil semua sasaran untuk dropdown
    res.render('program/edit', { user:req.user, program: program[0], sasaran: sasaranList }); // Pastikan path dan struktur sesuai
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data program", error });
  }
});

// Edit program
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { id_sasaran, nama_program, indikator_program, satuan_program } = req.body;

  // Validasi satuan_program harus sesuai dengan nilai ENUM
  if (!validSatuanProgram.includes(satuan_program)) {
    return res.status(400).json({ message: 'Satuan Program tidak valid' });
  }

  try {
    await modelProgram.updateProgram(id, { id_sasaran, nama_program, indikator_program, satuan_program });
    res.redirect('/program/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate program", error });
  }
});

// Hapus program
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await modelProgram.deleteProgram(id);
    res.redirect('/program/dashboard');
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus program", error });
  }
});

module.exports = router;
