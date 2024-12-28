const express = require("express");
const bcrypt = require("bcrypt");
const modelUser = require("../model/modelUser"); // Sesuaikan dengan path ke superModel.js
const verifyToken = require('../middleware/verifyToken');
const jwt = require("jsonwebtoken"); // Untuk token autentikasi
const router = express.Router();

// Register Super Admin
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  
  // Menghash password sebelum menyimpannya di database
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing password

    // Menyiapkan data untuk disimpan
    const data = { 
      username_superadmin: username, 
      password_superadmin: hashedPassword, 
      email_superadmin: email // Meskipun tidak digunakan dalam login, tetap disimpan di database
    };

    // Menyimpan data ke database
    await modelUser.register(data);
    res.status(201).json({ message: "Super Admin berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat pendaftaran", error });
  }
});

// Login Super Admin dengan Username dan Password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await modelUser.getByUsername(username);
    
    if (result.length > 0) {
      const user = result[0];
      const isPasswordValid = await modelUser.verifyPassword(user.password_user, password);

      if (isPasswordValid) {
        const token = jwt.sign({ userId: user.id_user, name_user: user.nama_user, username: user.username_user, user_type: user.user_type }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true }); // Kirim token sebagai cookie
        res.redirect('/dashboard'); // Arahkan ke dashboard setelah login berhasil
      } else {
        res.status(400).json({ message: "Password salah" });
      }
    } else {
      res.status(404).json({ message: "Username tidak ditemukan" });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Terjadi kesalahan saat login", error });
  }
});


router.get('/dashboard', verifyToken, (req, res) => {
  res.render('dashboard', { user: req.user });
});


router.get('/login', (req, res) => {
  res.render('login'); // Pastikan path ini sesuai dengan letak file login.ejs
});

module.exports = router;
