const connection = require("../database/database");

class modelProgram {
  // Menambahkan program baru
  static async tambahProgram(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO program (id_sasaran, nama_program, indikator_program, satuan_program) VALUES (?, ?, ?, ?)",
        [data.id_sasaran, data.nama_program, data.indikator_program, data.satuan_program],
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

  // Mendapatkan semua data program
  static async getAllProgram() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT program.*, sasaran.nama_sasaran 
         FROM program 
         LEFT JOIN sasaran ON program.id_sasaran = sasaran.id_sasaran`,
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

  // Mendapatkan data program berdasarkan ID
  static async getProgramById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT program.*, sasaran.nama_sasaran 
         FROM program 
         LEFT JOIN sasaran ON program.id_sasaran = sasaran.id_sasaran
         WHERE id_program = ?`,
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

  // Update program berdasarkan ID
  static async updateProgram(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE program SET id_sasaran = ?, nama_program = ?, indikator_program = ?, satuan_program = ? WHERE id_program = ?",
        [data.id_sasaran, data.nama_program, data.indikator_program, data.satuan_program, id],
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

  // Menghapus program berdasarkan ID
  static async deleteProgram(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM program WHERE id_program = ?", [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = modelProgram;
