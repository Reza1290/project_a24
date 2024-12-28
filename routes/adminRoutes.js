const express = require("express");
const router = express.Router();
const modelAdmin = require("../model/modelUser");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const modelUser = require("../model/modelUser");





// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });






// Halaman Dashboard Admin
router.get("/dashboard", async (req, res) => {
  try {
    const result = await modelAdmin.getAllAdmins(); // Ambil data admin
    res.render("adminkabid/dashboard", {user: req.user, admins: result }); // Kirim data admins ke view
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});



router.post("/toggleadmin/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    console.log(userId)
    const result = await modelUser.toggleAdmin(userId);
    if (result) {
      res.redirect('/adminkabid/input');
    } else {
      res.status(500).json({ message: "error", error: "Toggle admin failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
});





// Halaman input admin baru
router.get("/input", async (req, res) => {
  try {
    const result = await modelUser.getAllUsersAndAdmins(); // Ambil data admin
    res.render("adminkabid/inputadmin", {user: req.user, users: result }); // Kirim data admins ke view
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});






// Tambah admin baru
router.post("/input", upload.single("foto_profil_adminkabid"), async (req, res) => {
  const {
    nama_adminkabid,
    nip_adminkabid,
    jabatan_adminkabid,
    alamat_adminkabid,
    no_telp_adminkabid,
    email_adminkabid,
    username_adminkabid,
    password_adminkabid,
    bidang_id
  } = req.body;

  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password_adminkabid, 10);

    // Siapkan data untuk ditambahkan ke database
    const data = {
      nama_adminkabid,
      nip_adminkabid,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid: hashedPassword,
      foto_profil_adminkabid: req.file ? req.file.filename : null, // Simpan nama file gambar
      bidang_id
    };

    // Panggil model untuk tambah admin
    const result = await modelAdmin.tambahAdmin(data);
    
    // Ambil ID admin yang baru saja ditambahkan
    const adminId = result.insertId;  // ID yang baru dimasukkan

    // Kirim respons sukses ke frontend
    res.redirect('/adminkabid/hasilinput');

  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambah admin",
      error: error
    });
  }
});







router.get("/edit/:id", async (req, res) => {
  const adminId = req.params.id;
  try {
    const admin = await modelAdmin.getUserById(adminId); // Mengambil admin berdasarkan ID
    const bidang = await modelAdmin.getAllBidang();
    
    if (admin) {
      res.render('adminkabid/editadmin', {user: req.user, admin, bidang });
    } else {
      res.status(404).send("Admin tidak ditemukan");
    }
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});








// Update admin
router.post("/edit/:id", upload.single("foto_profil_adminkabid"), async (req, res) => {
  const adminId = req.params.id;
  const {
    nama_adminkabid,
    nip_adminkabid,
    jabatan_adminkabid,
    alamat_adminkabid,
    no_telp_adminkabid,
    email_adminkabid,
    username_adminkabid,
    password_adminkabid,
    bidang_id,
  } = req.body;

  try {
    let hashedPassword = password_adminkabid;
    if (password_adminkabid) {
      hashedPassword = await bcrypt.hash(password_adminkabid, 10);
    }

    const data = {
      nama_adminkabid,
      nip_adminkabid,
      jabatan_adminkabid,
      alamat_adminkabid,
      no_telp_adminkabid,
      email_adminkabid,
      username_adminkabid,
      password_adminkabid: hashedPassword,
      foto_profil_adminkabid: req.file ? req.file.filename : null,
      bidang_id,
    };

    await modelAdmin.updateAdmin(adminId, data);
    console.log("Update Admin ID:", adminId); // Debugging ID
    res.redirect('/adminkabid/hasilinput');
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate admin", error });
  }
});







// Hapus admin berdasarkan ID
router.post("/delete/:id", async (req, res) => {
  const adminId = req.params.id; // Mendapatkan ID dari parameter URL
  try {
    const result = await modelAdmin.deleteAdmin(adminId); // Panggil model untuk menghapus admin
    
    if (result.affectedRows > 0) {
      // Jika admin berhasil dihapus
      res.redirect('/adminkabid/hasilinput');
    } else {
      // Jika admin dengan ID tersebut tidak ditemukan
      res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan',
      });
    }
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus admin",
      error: error,
    });
  }
});







// Halaman Dashboard Admin
router.get("/hasilinput", async (req, res) => {
  try {
    const result = await modelAdmin.getAllAdmins(); // Ambil data admin
    res.render("adminkabid/hasilinput", {user: req.user, admins: result }); // Kirim data admins ke view
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

module.exports = router;
