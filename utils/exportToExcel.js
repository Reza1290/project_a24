const ExcelJS = require('exceljs');
const path = require('path');

async function exportToExcel(data, fileName) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Laporan Bulanan');

  // Merging cells for headers
  sheet.mergeCells('A1:A2'); // Sasaran
  sheet.mergeCells('B1:B2'); // Indikator Kinerja
  sheet.mergeCells('C1:C2'); // Program/Kegiatan/Sub Kegiatan
  sheet.mergeCells('D1:D2'); // Indikator Kinerja Program
  sheet.mergeCells('E1:G1'); // Anggaran Header
  sheet.mergeCells('H1:J1'); // Kinerja Header
  sheet.mergeCells('K1:K2'); // Permasalahan
  sheet.mergeCells('L1:N1'); // Tindak Lanjut
  // sheet.mergeCells('L2:L2'); // Waktu

  // Set header values row by row
  sheet.getCell('A1').value = 'Sasaran';
  sheet.getCell('B1').value = 'Indikator Kinerja';
  sheet.getCell('C1').value = 'Program/Kegiatan/Sub Kegiatan';
  sheet.getCell('D1').value = 'Indikator Kinerja Program';
  sheet.getCell('E1').value = 'Anggaran';
  sheet.getCell('H1').value = 'Kinerja';
  sheet.getCell('K1').value = 'Permasalahan';
  sheet.getCell('L1').value = 'Tindak Lanjut';

  // Second-row headers
  sheet.getCell('E2').value = 'Target';
  sheet.getCell('F2').value = 'Realisasi';
  sheet.getCell('G2').value = 'Capaian';
  sheet.getCell('H2').value = 'Target';
  sheet.getCell('I2').value = 'Realisasi';
  sheet.getCell('J2').value = 'Capaian';
  sheet.getCell('L2').value = 'Langkah Kerja';
  sheet.getCell('M2').value = 'Output';
  sheet.getCell('N2').value = 'Waktu';

  // Style headers
  for (let i = 1; i <= 13; i++) {
    const cell = sheet.getCell(1, i); // First row
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }
  for (let i = 5; i <= 14; i++) {
    const cell = sheet.getCell(2, i); // Second row for subheaders
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  // Set column widths
  sheet.columns = [
    { key: 'sasaran', width: 20 },
    { key: 'indikator_kinerja', width: 25 },
    { key: 'program_kegiatan', width: 35 },
    { key: 'indikator_program', width: 30 },
    { key: 'target_anggaran', width: 15 },
    { key: 'realisasi_anggaran', width: 15 },
    { key: 'capaian_anggaran', width: 15 },
    { key: 'target_kinerja', width: 15 },
    { key: 'realisasi_kinerja', width: 15 },
    { key: 'capaian_kinerja', width: 15 },
    { key: 'permasalahan', width: 30 },
    { key: 'langkah_kerja', width: 15 },
    { key: 'output', width: 15 },
    { key: 'waktu', width: 15 },
  ];

  let bufferSasaran = '';
let bufferIndikatorKinerja = '';
let startRowSasaran = 2;
let startRowIndikator = 2;

data.forEach((row, index) => {
  const capaianAnggaran = row.k_target > 0 
    ? ((row.realisasi_anggaran / row.k_target) * 100).toFixed(2) + ' %' 
    : '0 %';

  const capaianKinerja = row.sk_target > 0 
    ? ((row.realisasi_kinerja / row.sk_target) * 100).toFixed(2) + ' %' 
    : '0 %';

  const currentRow = sheet.addRow({
    sasaran: row.nama_sasaran,
    indikator_kinerja: row.indikator_sasaran,
    program_kegiatan: row.nama_program + ',' + row.nama_kegiatan + ', ' + row.nama_sub_kegiatan,
    indikator_program: row.indikator_program,
    target_anggaran: row.k_target,
    realisasi_anggaran: row.realisasi_anggaran,
    capaian_anggaran: capaianAnggaran,
    target_kinerja: row.realisasi_kinerja,
    realisasi_kinerja: row.sk_target,
    capaian_kinerja: capaianKinerja,
    permasalahan: row.permasalahan,
    langkah_kerja: row.langkah_kerja,
    output: row.output,
    waktu: row.waktu,
  });

  // Merge "Sasaran" column
  if (row.nama_sasaran === bufferSasaran) {
    // Do nothing, keep tracking
  } else {
    if (bufferSasaran && startRowSasaran < currentRow.number - 1) {
      sheet.mergeCells(`A${startRowSasaran}:A${currentRow.number - 1}`);
    }
    bufferSasaran = row.nama_sasaran;
    startRowSasaran = currentRow.number;
  }

  // Merge "Indikator Kinerja" column
  if (row.indikator_sasaran === bufferIndikatorKinerja) {
    // Do nothing, keep tracking
  } else {
    if (bufferIndikatorKinerja && startRowIndikator < currentRow.number - 1) {
      sheet.mergeCells(`B${startRowIndikator}:B${currentRow.number - 1}`);
    }
    bufferIndikatorKinerja = row.indikator_sasaran;
    startRowIndikator = currentRow.number;
  }
});

// Finalize merging for the last groups
if (startRowSasaran < sheet.lastRow.number) {
  sheet.mergeCells(`A${startRowSasaran}:A${sheet.lastRow.number}`);
}
if (startRowIndikator < sheet.lastRow.number) {
  sheet.mergeCells(`B${startRowIndikator}:B${sheet.lastRow.number}`);
}



  // Save file
  const filePath = path.join(__dirname, `../downloads/${fileName}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = exportToExcel;
