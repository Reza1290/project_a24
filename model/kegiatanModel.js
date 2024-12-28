const connection = require("../database/database");

class modelKegiatan {
  // Menambahkan kegiatan baru
  static async tambahKegiatan(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO kegiatan (id_program, nama_kegiatan, indikator_kegiatan, target, satuan_kegiatan) VALUES (?, ?, ?, ?, ?)",
        [data.id_program, data.nama_kegiatan, data.indikator_kegiatan, data.target, data.satuan_kegiatan],
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

  // Mendapatkan semua data kegiatan
  static async getAllKegiatan() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT kegiatan.*, program.nama_program 
         FROM kegiatan 
         LEFT JOIN program ON kegiatan.id_program = program.id_program`,
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

  // Mendapatkan data kegiatan berdasarkan ID
  static async getKegiatanById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT kegiatan.*, program.nama_program 
         FROM kegiatan 
         LEFT JOIN program ON kegiatan.id_program = program.id_program
         WHERE id_kegiatan = ?`,
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

  // Update kegiatan berdasarkan ID
  static async updateKegiatan(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE kegiatan SET id_program = ?, nama_kegiatan = ?, indikator_kegiatan = ?, target = ?, satuan_kegiatan = ? WHERE id_kegiatan = ?",
        [data.id_program, data.nama_kegiatan, data.indikator_kegiatan, data.target, data.satuan_kegiatan, id],
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

  // Menghapus kegiatan berdasarkan ID
  static async deleteKegiatan(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM kegiatan WHERE id_kegiatan = ?", [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = modelKegiatan;
