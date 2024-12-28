const connection = require("../database/database");

class modelBidang {
  // Menambahkan bidang baru
  static async tambahBidang(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO bidang (nama_bidang) VALUES (?)", [data.nama_bidang], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Mendapatkan semua data bidang
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

  // Mendapatkan data bidang berdasarkan ID
  static async getBidangById(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM bidang WHERE id_bidang = ?", [id], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Update nama bidang
  static async updateBidang(id, data) {
    return new Promise((resolve, reject) => {
      connection.query("UPDATE bidang SET nama_bidang = ? WHERE id_bidang = ?", [data.nama_bidang, id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Menghapus bidang
  static async deleteBidang(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM bidang WHERE id_bidang = ?", [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}



module.exports = modelBidang;
