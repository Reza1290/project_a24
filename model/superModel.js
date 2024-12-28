const connection = require("../database/database");
const bcrypt = require("bcrypt");

class modelSuperAdmin {
  // Menambahkan super admin baru
  static async register(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO super_admin SET ?", data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Mendapatkan data super admin berdasarkan username
  static async getByUsername(username) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM super_admin WHERE username_superadmin = ?", [username], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Verifikasi password
  static async verifyPassword(storedPassword, enteredPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(enteredPassword, storedPassword, function(err, isMatch) {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  }
}

module.exports = modelSuperAdmin;
