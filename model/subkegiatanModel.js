const connection = require("../database/database");

class modelSubKegiatan {
  // Menambahkan sub_kegiatan baru
  static async tambahSubKegiatan(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO sub_kegiatan 
        (id_kegiatan, nama_sub_kegiatan, indikator_sub_kegiatan, target, satuan_sub_kegiatan, anggaran_sub_kegiatan) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.id_kegiatan,
          data.nama_sub_kegiatan,
          data.indikator_sub_kegiatan,
          data.target,
          data.satuan_sub_kegiatan,
          data.anggaran_sub_kegiatan,
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

  // Mendapatkan semua data sub_kegiatan
  static async getAllSubKegiatan() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT sub_kegiatan.*, kegiatan.nama_kegiatan 
         FROM sub_kegiatan 
         LEFT JOIN kegiatan ON sub_kegiatan.id_kegiatan = kegiatan.id_kegiatan`,
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

  // Mendapatkan data sub_kegiatan berdasarkan ID
  static async getSubKegiatanById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT sub_kegiatan.*, kegiatan.nama_kegiatan 
         FROM sub_kegiatan 
         LEFT JOIN kegiatan ON sub_kegiatan.id_kegiatan = kegiatan.id_kegiatan
         WHERE id_sub_kegiatan = ?`,
        [id],
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

  // Update sub_kegiatan berdasarkan ID
  static async updateSubKegiatan(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE sub_kegiatan 
         SET id_kegiatan = ?, 
             nama_sub_kegiatan = ?, 
             indikator_sub_kegiatan = ?, 
             target = ?, 
             satuan_sub_kegiatan = ?, 
             anggaran_sub_kegiatan = ? 
         WHERE id_sub_kegiatan = ?`,
        [
          data.id_kegiatan,
          data.nama_sub_kegiatan,
          data.indikator_sub_kegiatan,
          data.target,
          data.satuan_sub_kegiatan,
          data.anggaran_sub_kegiatan,
          id,
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

  // Menghapus sub_kegiatan berdasarkan ID
  static async deleteSubKegiatan(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM sub_kegiatan WHERE id_sub_kegiatan = ?",
        [id],
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

module.exports = modelSubKegiatan;
