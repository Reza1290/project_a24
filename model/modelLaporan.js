const connection = require("../database/database");

class modelLaporan {
    // Menambahkan laporan bulanan baru
    static async tambahLaporan(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                `INSERT INTO laporan_bulanan (
          bulan, kegiatan_id, sub_kegiatan_id, realisasi_kinerja, satuan_realisasi_kinerja, 
          realisasi_anggaran, permasalahan, langkah_kerja, output, waktu, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.bulan,
                    data.id_kegiatan,
                    data.id_sub_kegiatan,
                    data.realisasi_kinerja,
                    data.satuan_realisasi_kinerja,
                    data.realisasi_anggaran,
                    data.permasalahan,
                    data.langkah_kerja,
                    data.output,
                    data.waktu,
                    'PENDING',
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

    static async getAllKomentarByIdLaporan(id_laporan_bulanan) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT 
    kl.id_komentar_laporan, 
    kl.id_laporan_bulanan, 
    kl.komentar, 
    kl.id_user, 
    kl.timestamp, 
    u.nama_user     
        FROM komentar_laporan kl
        LEFT JOIN user u ON kl.id_user = u.id_user
        WHERE kl.id_laporan_bulanan = ?;
        `,
                [id_laporan_bulanan],
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    // Mendapatkan semua data laporan bulanan
    static async getAllLaporan() {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT 
    lb.*, 
    k.*, 
    sk.*, 
    p.*, 
    s.*, 
    k.target AS k_target, 
    sk.target AS sk_target
FROM 
    laporan_bulanan lb 
LEFT JOIN 
    kegiatan k ON lb.kegiatan_id = k.id_kegiatan 
LEFT JOIN 
    sub_kegiatan sk ON lb.sub_kegiatan_id = sk.id_sub_kegiatan 
LEFT JOIN 
    program p ON k.id_program = p.id_program 
LEFT JOIN 
    sasaran s ON p.id_sasaran = s.id_sasaran
WHERE 1`,
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


    // Mendapatkan data laporan berdasarkan ID
    static async getLaporanById(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT * FROM laporan_bulanan WHERE id_laporan_bulanan = ?`,
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

    // Update laporan bulanan berdasarkan ID
    static async updateLaporan(id, data) {
        return new Promise((resolve, reject) => {
            connection.query(
                `UPDATE laporan_bulanan 
         SET bulan = ?, kegiatan_id = ?, sub_kegiatan_id = ?, realisasi_kinerja = ?, satuan_realisasi_kinerja = ?, 
             realisasi_anggaran = ?, permasalahan = ?, langkah_kerja = ?, output = ?, waktu = ?, status = ?
         WHERE id_laporan_bulanan = ?`,
                [
                    data.bulan,
                    data.id_kegiatan,
                    data.id_sub_kegiatan,
                    data.realisasi_kinerja,
                    data.satuan_realisasi_kinerja,
                    data.realisasi_anggaran,
                    data.permasalahan,
                    data.langkah_kerja,
                    data.output,
                    data.waktu,
                    data.status,
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

    // Menghapus laporan berdasarkan ID
    static async deleteLaporan(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                `DELETE FROM laporan_bulanan WHERE id_laporan_bulanan = ?`,
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

    static async getLaporanByFilter(filter) {
        return new Promise((resolve, reject) => {
            const query = `
           SELECT 
    lb.*, 
    k.*, 
    sk.*, 
    p.*, 
    s.*, 
    k.target AS k_target, 
    sk.target AS sk_target
FROM 
    laporan_bulanan lb 
LEFT JOIN 
    kegiatan k ON lb.kegiatan_id = k.id_kegiatan 
LEFT JOIN 
    sub_kegiatan sk ON lb.sub_kegiatan_id = sk.id_sub_kegiatan 
LEFT JOIN 
    program p ON k.id_program = p.id_program 
LEFT JOIN 
    sasaran s ON p.id_sasaran = s.id_sasaran
WHERE 
    lb.bulan = ?

          `;
            connection.query(query, [filter], function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async getLaporanByDashboard() {
        return new Promise((resolve, reject) => {
            const query = `
               SELECT 
                    user.bidang_id, 
                    bidang.nama_bidang AS nama_bidang, 
                    MAX(lb.id_laporan_bulanan) AS id_laporan_bulanan,
                    MAX(k.id_kegiatan) AS id_kegiatan, 
                    MAX(sk.id_sub_kegiatan) AS id_sub_kegiatan, 
                    SUM(sk.target) AS total_sk_target, 
                    SUM(sk.anggaran_sub_kegiatan) AS total_anggaran_sub_kegiatan,
                    SUM(realisasi_kinerja) AS total_realisasi_kinerja,
                    SUM(realisasi_anggaran) AS total_realisasi_anggaran
                FROM 
                    laporan_bulanan lb
                LEFT JOIN 
                    kegiatan k ON lb.kegiatan_id = k.id_kegiatan
                LEFT JOIN 
                    sub_kegiatan sk ON lb.sub_kegiatan_id = sk.id_sub_kegiatan
                LEFT JOIN 
                    program p ON k.id_program = p.id_program
                LEFT JOIN 
                    sasaran s ON p.id_sasaran = s.id_sasaran
                LEFT JOIN 
                    user ON lb.id_user = user.id_user
                LEFT JOIN 
                    bidang ON user.bidang_id = bidang.id_bidang
                GROUP BY 
                    user.bidang_id, 
                    bidang.nama_bidang

            `;

            connection.query(query, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }


    static async getLaporanByTriwulan(triwulan) {
        return new Promise((resolve, reject) => {
            const triwulanMapping = {
                1: ['Januari', 'Februari', 'Maret'],      // Triwulan 1
                2: ['April', 'Mei', 'Juni'],              // Triwulan 2
                3: ['Juli', 'Agustus', 'September'],      // Triwulan 3
                4: ['Oktober', 'November', 'Desember']    // Triwulan 4
            };


            const months = triwulanMapping[triwulan]; // Ensure this is an array of months
            const placeholders = months.map((val) => `'${val}'`).join(', '); // Create placeholders for parameterized query
            const query = `
                SELECT 
                    lb.*, 
                    k.*, 
                    sk.*, 
                    p.*, 
                    s.*, 
                    k.target AS k_target, 
                    sk.target AS sk_target
                FROM 
                    laporan_bulanan lb 
                LEFT JOIN 
                    kegiatan k ON lb.kegiatan_id = k.id_kegiatan 
                LEFT JOIN 
                    sub_kegiatan sk ON lb.sub_kegiatan_id = sk.id_sub_kegiatan 
                LEFT JOIN 
                    program p ON k.id_program = p.id_program 
                LEFT JOIN 
                    sasaran s ON p.id_sasaran = s.id_sasaran
                WHERE 
                    lb.bulan IN (${placeholders})
            `;

            // Mapping triwulan (quarter) to months

            console.log(triwulan)
            if (!months) {
                return reject(new Error('Invalid triwulan'));
            }

            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Method to add a comment
    static async addKomentar(id_laporan_bulanan, komentar, id_user) {
        return new Promise((resolve, reject) => {
            connection.query(
                `INSERT INTO komentar_laporan (id_laporan_bulanan, komentar, id_user, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
                [id_laporan_bulanan, komentar, id_user],
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    // Method to change the status of a report
    static async changeStatus(id_laporan_bulanan, status) {
        return new Promise((resolve, reject) => {
            connection.query(
                `UPDATE laporan_bulanan SET status = ? WHERE id_laporan_bulanan = ?`,
                [status, id_laporan_bulanan],
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    // Method to get a comment by its ID
    static async getKomentarById(id_komentar_laporan) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT * FROM komentar_laporan WHERE id_komentar_laporan = ?`,
                [id_komentar_laporan],
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                }
            );
        });
    }

    // Method to delete a comment
    static async deleteKomentar(id_komentar_laporan) {
        return new Promise((resolve, reject) => {
            connection.query(
                `DELETE FROM komentar_laporan WHERE id_komentar_laporan = ?`,
                [id_komentar_laporan],
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }




}

module.exports = modelLaporan;
