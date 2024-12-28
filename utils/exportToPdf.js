const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

async function exportToPDF(data, fileName) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page to the PDF document
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  
  // Set up a font (optional, but useful for custom styling)
  const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
  
  // Set the starting Y position
  let yPosition = height - 50;

  // Add a title to the document
  page.drawText('Laporan Bulanan', {
    x: 50,
    y: yPosition,
    size: 18,
    font,
  });
  yPosition -= 40;

  // Add table headers
  const headers = [
    'Sasaran', 'Indikator Kinerja', 'Program/Kegiatan/Sub Kegiatan', 
    'Indikator Kinerja Program', 'Target Anggaran', 'Realisasi Anggaran', 
    'Capaian Anggaran', 'Target Kinerja', 'Realisasi Kinerja', 'Capaian Kinerja', 
    'Permasalahan', 'Tindak Lanjut', 'Waktu'
  ];
  
  page.drawText(headers.join(' | '), {
    x: 50,
    y: yPosition,
    size: 12,
    font,
  });
  yPosition -= 20;

  // Add data rows
  data.forEach(row => {
    const rowData = [
      row.sasaran, row.indikator_kinerja, row.program_kegiatan, row.indikator_program, 
      row.target_anggaran, row.realisasi_anggaran, row.capaian_anggaran, row.target_kinerja, 
      row.realisasi_kinerja, row.capaian_kinerja, row.permasalahan, row.tindak_lanjut, row.waktu
    ];

    page.drawText(rowData.join(' | '), {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });
    yPosition -= 20;
  });

  // Save the PDF to a file
  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(__dirname, `../downloads/${fileName}.pdf`);
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}

module.exports = exportToPDF;
