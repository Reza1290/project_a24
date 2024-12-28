const connection = require("../database/database");
const bcrypt = require("bcrypt");

class modelUser {

  // Menambahkan super admin baru
  static async register(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", data, function (err, result) {
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
      connection.query("SELECT * FROM user WHERE username_user = ?", [username], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async verifyPassword(storedPassword, enteredPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(enteredPassword, storedPassword, function (err, isMatch) {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  }

  static async tambahUser(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO user (nama_user, nip_user, jabatan_user, alamat_user, no_telp_user, email_user, username_user, password_user, foto_profil_user, bidang_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.nama_user,
          data.nip_user,
          data.jabatan_user,
          data.alamat_user,
          data.no_telp_user,
          data.email_user,
          data.username_user,
          data.password_user,
          data.foto_profil_user,
          data.bidang_id,
        ],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async toggleAdmin(userId) {
    try {
      const user = await this.getUserById(userId);

      if (user) {
        const user_type = user.user_type === 'admin_kabid' ? 'user' : 'admin_kabid';

        return new Promise((resolve, reject) => {
          connection.query(
            `UPDATE user SET user_type = ?
                    WHERE id_user = ?`, [
            user_type,
            userId
          ],
            function (err, rows) {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
        });
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  }


  // Mendapatkan semua admin dengan data bidang terkait
  static async getAllAdmins() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.*, bidang.nama_bidang 
         FROM user 
         LEFT JOIN bidang ON user.bidang_id = bidang.id_bidang
         WHERE user.user_type LIKE '%admin_kabid%'
         `,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getAllUsersAndAdmins() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.*, bidang.nama_bidang 
        FROM user 
        LEFT JOIN bidang ON user.bidang_id = bidang.id_bidang
        WHERE user.user_type = 'user' OR user.user_type = 'admin_kabid'
        `,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.*, bidang.nama_bidang 
         FROM user 
         LEFT JOIN bidang ON user.bidang_id = bidang.id_bidang
         WHERE user.user_type LIKE '%user%'
         `,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Mendapatkan bidang
  static async getAllBidang() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM bidang", function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Mendapatkan admin berdasarkan ID
  static async getUserById(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.*, bidang.nama_bidang 
         FROM user 
         LEFT JOIN bidang ON user.bidang_id = bidang.id_bidang
         WHERE user.id_user = ?`,
        [userId],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length > 0) {
              resolve(rows[0]); // Mengambil data admin pertama
            } else {
              resolve(null); // Jika tidak ada data admin
            }
          }
        }
      );
    });
  }



  // Mengupdate data admin berdasarkan ID
  static async updateUser(userId, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET 
         nama_user = ?, 
         nip_user = ?, 
         jabatan_user = ?, 
         alamat_user = ?, 
         no_telp_user = ?, 
         email_user = ?, 
         username_user = ?, 
         password_user = ?, 
         foto_profil_user = ?, 
         bidang_id = ? 
         WHERE id_user = ?`,
        [
          data.nama_user,
          data.nip_user,
          data.jabatan_user,
          data.alamat_user,
          data.no_telp_user,
          data.email_user,
          data.username_user,
          data.password_user, // Jika password diubah, jangan lupa untuk hash lagi
          data.foto_profil_user,
          data.bidang_id,
          userId,
        ],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Menghapus admin berdasarkan ID
  static async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM user WHERE id_user = ?`,
        [userId],
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}


module.exports = modelUser;
