const express = require("express");
const router = express.Router();
const modelLaporan = require("../model/modelLaporan");
const modelSubKegiatan = require("../model/subkegiatanModel");
const modelKegiatan = require("../model/kegiatanModel");
const connection = require("../database/database");
const exportToExcel = require("../utils/exportToExcel");
const fs = require('fs')
const path = require('path');
const modelSasaran = require("../model/sasaranModel");
const verifyUserType = require("../middleware/verifyUserType");

// Daftar nilai ENUM yang valid untuk 'satuan_realisasi_kinerja'
const validSatuanRealisasiKinerja = [
    'Unit', 'Liter', 'Persentase', 'Dokumen', 'Berita Acara', 'Masukan', 'Paket',
    'Orang', 'Jam', 'Bulan', 'Tahun', 'Lembar'
];

// Daftar nilai ENUM yang valid untuk 'bulan'
const validBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Menampilkan daftar laporan bulanan
router.get('/dashboard', async (req, res) => {
    try {
        const kegiatan = await modelKegiatan.getAllKegiatan()
        const sub_kegiatan = await modelSubKegiatan.getAllSubKegiatan()
        const sasaran = await modelSasaran.getAllSasaran()
        const laporanList = await modelLaporan.getAllLaporan(); // Mengambil semua data laporan
        res.render('laporan/dashboard', { user: req.user, kegiatan: kegiatan, sasaran: sasaran, sub_kegiatan: sub_kegiatan, laporan: laporanList }); // Mengirimkan data laporan ke dashboard
    } catch (error) {
        console.error("Error getting laporan data:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data laporan", error });
    }
});

router.get('/triwulan', async (req, res) => {

    try {

        // Render laporan page
        res.render('laporan/triwulan', {
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching triwulan report:', error);
        res.status(500).json({ error: 'Failed to fetch triwulan report' });
    }
});
router.get('/triwulan/download', async (req, res) => {
    const { triwulan } = req.query; // Correctly destructure from req.query

    try {
        const laporanData = await modelLaporan.getLaporanByTriwulan(triwulan);

        // Assuming laporanData is being used elsewhere or logged
        console.log(laporanData);
        const excelFilePath = await exportToExcel(laporanData, `Laporan_Triwulan_${triwulan}`);

        // Set the headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_Triwulan_${triwulan}.xlsx`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(excelFilePath);
        fileStream.pipe(res);  // Send the file in chunks

        // Optionally, delete the file after sending it
        fileStream.on('end', () => {
            fs.unlinkSync(excelFilePath); // Clean up the file after sending
        });


        // Render laporan page
        // res.redirect('/laporan/triwulan');
    } catch (error) {
        console.error('Error fetching triwulan report:', error);
        res.status(500).json({ error: 'Failed to fetch triwulan report' });
    }
});



router.get('/bulanan', async (req, res) => {
    const { filterBulan } = req.query;

    try {
        const kegiatan = await modelKegiatan.getAllKegiatan()
        const sub_kegiatan = await modelSubKegiatan.getAllSubKegiatan()

        // Fetch filtered data based on the query
        let laporanData = []
        if (!filterBulan) {
            console.log(filterBulan)
            laporanData = await modelLaporan.getAllLaporan();
        } else {
            laporanData = await modelLaporan.getLaporanByFilter(filterBulan);
        }

        if (!laporanData || laporanData.length === 0) {
            res.render('laporan/bulanan', { user: req.user, kegiatan: kegiatan, sub_kegiatan: sub_kegiatan, laporan: [] });
        }

        // Check if user requested a download
        if (req.query.download === 'true') {
            const filePath = await exportToExcel(laporanData, `Laporan_Bulanan_${filter}`);
            return res.download(filePath); // Download the generated file
        }

        // Return JSON data if no download requested
        res.render('laporan/bulanan', { user: req.user, kegiatan: kegiatan, sub_kegiatan: sub_kegiatan, laporan: laporanData }); // Mengirimkan data laporan ke dashboard
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        res.status(500).json({ error: 'Failed to fetch monthly report' });
    }
});

// Route for downloading the filtered report
router.get('/bulanan/download', async (req, res) => {
    const filterBulan = req.query.filterBulan;

    if (!filterBulan) {
        return res.status(400).json({ error: 'Filter bulan is required.' });
    }
    const laporanData = await modelLaporan.getLaporanByFilter(filterBulan);

    try {
        // Call a utility function to generate the Excel file for the selected month
        const excelFilePath = await exportToExcel(laporanData, `Laporan_Bulanan_${filterBulan}`);

        // Set the headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_Bulanan_${filterBulan}.xlsx`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(excelFilePath);
        fileStream.pipe(res);  // Send the file in chunks

        // Optionally, delete the file after sending it
        fileStream.on('end', () => {
            fs.unlinkSync(excelFilePath); // Clean up the file after sending
        });

    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: 'Failed to generate report.' });
    }
});


router.post('/tambah', verifyUserType(['user']), async (req, res) => {
    const {
        bulan, id_kegiatan, id_sasaran, id_sub_kegiatan, realisasi_kinerja, satuan_realisasi_kinerja,
        realisasi_anggaran, permasalahan, langkah_kerja, output, waktu, status
    } = req.body;

    // Validasi ENUM untuk bulan dan satuan_realisasi_kinerja
    if (!validBulan.includes(bulan) || !validSatuanRealisasiKinerja.includes(satuan_realisasi_kinerja)) {
        return res.status(400).json({ message: 'Bulan atau Satuan Realisasi Kinerja tidak valid' });
    }

    try {
        await modelLaporan.tambahLaporan({
            bulan, id_kegiatan, id_sasaran, id_sub_kegiatan, realisasi_kinerja, satuan_realisasi_kinerja,
            realisasi_anggaran, permasalahan, langkah_kerja, output, waktu, status
        });
        res.redirect('/laporan/dashboard');
    } catch (error) {
        console.error("Error adding laporan:", error);
        res.status(500).json({ message: "Gagal menambah laporan", error });
    }
});

// Menampilkan form edit laporan
router.get('/edit/:id', verifyUserType(['user']), async (req, res) => {
    const { id } = req.params;
    try {
        const laporan = await modelLaporan.getLaporanById(id); // Mendapatkan data laporan berdasarkan ID
        if (!laporan.length) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }
        res.render('laporan/edit', { user: req.user, laporan: laporan[0], validBulan, validSatuanRealisasiKinerja }); // Pastikan path sesuai
    } catch (error) {
        console.error("Error getting laporan:", error);
        res.status(500).json({ message: "Gagal memuat data laporan", error });
    }
});

// Edit laporan
router.post('/edit/:id', verifyUserType(['user']), async (req, res) => {
    const { id } = req.params;
    const {
        bulan, id_kegiatan, id_sub_kegiatan, realisasi_kinerja, satuan_realisasi_kinerja,
        realisasi_anggaran, permasalahan, langkah_kerja, output, waktu, status
    } = req.body;

    // Validasi ENUM untuk bulan dan satuan_realisasi_kinerja
    if (!validBulan.includes(bulan) || !validSatuanRealisasiKinerja.includes(satuan_realisasi_kinerja)) {
        return res.status(400).json({ message: 'Bulan atau Satuan Realisasi Kinerja tidak valid' });
    }

    try {
        await modelLaporan.updateLaporan(id, {
            bulan, id_kegiatan, id_sub_kegiatan, realisasi_kinerja, satuan_realisasi_kinerja,
            realisasi_anggaran, permasalahan, langkah_kerja, output, waktu, status
        });
        res.redirect('/laporan/dashboard');
    } catch (error) {
        console.error("Error updating laporan:", error);
        res.status(500).json({ message: "Gagal mengupdate laporan", error });
    }
});

// Hapus laporan
router.get('/delete/:id', verifyUserType(['user']), async (req, res) => {
    const { id } = req.params;
    try {
        await modelLaporan.deleteLaporan(id);
        res.redirect('/laporan/dashboard');
    } catch (error) {
        console.error("Error deleting laporan:", error);
        res.status(500).json({ message: "Gagal menghapus laporan", error });
    }
});

router.get('/komentar/:id_laporan', async (req, res) => {
    const id_laporan = req.params.id_laporan;

    try {
        const rows = await modelLaporan.getAllKomentarByIdLaporan(id_laporan)
        res.json(rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

router.post('/hapus-komentar', async (req, res) => {
    const { id_user, id_komentar_laporan } = req.body;

    try {
        const komentar = await modelLaporan.getKomentarById(id_komentar_laporan);

        if (komentar && komentar.id_user == id_user) {
            await modelLaporan.deleteKomentar(id_komentar_laporan);
            res.status(200).json({ message: 'Comment deleted successfully' });
        } else {
            res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});


// Route to add a comment
router.post('/komentar', async (req, res) => {
    const { id_laporan_bulanan, komentar, id_user } = req.body;

    try {
        await modelLaporan.addKomentar(id_laporan_bulanan, komentar, id_user);
        res.redirect('/laporan/dashboard')
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Route to change the status of a report
router.post('/change-status', async (req, res) => {
    const { id_laporan_bulanan, status } = req.body;

    try {
        await modelLaporan.changeStatus(id_laporan_bulanan, status);
        // res.status(200).json({ message: 'Status changed successfully' });
        res.redirect('/laporan/dashboard')
    } catch (error) {
        console.error('Error changing status:', error);
        res.status(500).json({ error: 'Failed to change status' });
    }
});


module.exports = router;
