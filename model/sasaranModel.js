const connection = require("../database/database");

class modelSasaran {
  // Menambahkan sasaran baru
  static async tambahSasaran(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO sasaran (nama_sasaran, indikator_sasaran) VALUES (?, ?)",
        [data.nama_sasaran, data.indikator_sasaran],
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

  // Mendapatkan semua data sasaran
  static async getAllSasaran() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM sasaran", function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Mendapatkan data sasaran berdasarkan ID
  static async getSasaranById(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM sasaran WHERE id_sasaran = ?", [id], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Update sasaran berdasarkan ID
  static async updateSasaran(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE sasaran SET nama_sasaran = ?, indikator_sasaran = ? WHERE id_sasaran = ?",
        [data.nama_sasaran, data.indikator_sasaran, id],
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

  // Menghapus sasaran berdasarkan ID
  static async deleteSasaran(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM sasaran WHERE id_sasaran = ?", [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = modelSasaran;
