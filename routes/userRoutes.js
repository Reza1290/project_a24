const express = require("express");
const router = express.Router();
const modelUser = require("../model/modelUser");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");





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
    const result = await modelUser.getAllUsers(); // Ambil data admin
    res.render("user/dashboard", {user: req.user, admins: result }); // Kirim data admins ke view
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});






// Halaman input admin baru
router.get("/input", async (req, res) => {
  try {
    const bidang = await modelUser.getAllBidang(); // Ambil data bidang
    res.render('user/inputuser', {user: req.user, bidang }); // Kirim data bidang ke view
  } catch (error) {
    console.error("Error fetching bidang data:", error);
    res.status(500).json({ message: "Gagal mengambil data bidang", error });
  }
});


// Tambah admin baru
router.post("/input", upload.single("foto_profil_user"), async (req, res) => {
  const {
    nama_user,
    nip_user,
    jabatan_user,
    alamat_user,
    no_telp_user,
    email_user,
    username_user,
    password_user,
    bidang_id
  } = req.body;

  console.log(password_user)
  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password_user, 10);
    // Siapkan data untuk ditambahkan ke database
    const data = {
      nama_user,
      nip_user,
      jabatan_user,
      alamat_user,
      no_telp_user,
      email_user,
      username_user,
      password_user: hashedPassword,
      foto_profil_user: req.file ? req.file.filename : null, // Simpan nama file gambar
      bidang_id
    };

    // Panggil model untuk tambah admin
    const result = await modelUser.tambahUser(data);
    
    // Ambil ID admin yang baru saja ditambahkan
    const userId = result.insertId;  // ID yang baru dimasukkan

    // Kirim respons sukses ke frontend
    res.redirect('/user/hasilinput');

  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambah user",
      error: error
    });
  }
});







router.get("/edit/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await modelUser.getUserById(userId); // Mengambil admin berdasarkan ID
    const bidang = await modelUser.getAllBidang();
    
    if (user) {
      res.render('user/edituser', {user: req.user, user, bidang });
    } else {
      res.status(404).send("User tidak ditemukan");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});








// Update admin
router.post("/edit/:id", upload.single("foto_profil_user"), async (req, res) => {
  const userId = req.params.id;
  const {
    nama_user,
    nip_user,
    jabatan_user,
    alamat_user,
    no_telp_user,
    email_user,
    username_user,
    password_user,
    bidang_id,
  } = req.body;

  try {
    let hashedPassword = password_user;
    if (password_user) {
      hashedPassword = await bcrypt.hash(password_user, 10);
    }

    const data = {
      nama_user,
      nip_user,
      jabatan_user,
      alamat_user,
      no_telp_user,
      email_user,
      username_user,
      password_user: hashedPassword,
      foto_profil_user: req.file ? req.file.filename : null,
      bidang_id,
    };

    await modelUser.updateUser(userId, data);
    console.log("Update User ID:", userId); // Debugging ID
    res.redirect('/user/hasilinput');
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate admin", error });
  }
});







// Hapus admin berdasarkan ID
router.post("/delete/:id", async (req, res) => {
  const userId = req.params.id; // Mendapatkan ID dari parameter URL
  try {
    const result = await modelUser.deleteAdmin(userId); // Panggil model untuk menghapus admin
    
    if (result.affectedRows > 0) {
      // Jika admin berhasil dihapus
      res.redirect('/user/hasilinput');
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
    const result = await modelUser.getAllUsers(); // Ambil data admin
    res.render("user/hasilinput", {user: req.user, users: result }); // Kirim data admins ke view
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

module.exports = router;
