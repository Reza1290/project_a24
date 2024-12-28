const ExcelJS = require('exceljs');
const path = require('path');

async function exportToExcelTriwulan(data, fileName) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Laporan Bulanan');

    // Merging cells for headers
    sheet.mergeCells('A1:A3'); // Sasaran
    sheet.mergeCells('B1:B3'); // Indikator Kinerja
    sheet.mergeCells('C1:C3'); // Program/Kegiatan/Sub Kegiatan
    sheet.mergeCells('D1:D3'); // Indikator Kinerja Program
    sheet.mergeCells('E1:F2'); // Target Kinerja dan Anggaran Renja
    sheet.mergeCells('G1:J1'); // Realisasi Kinerja Pada Triwulan
    sheet.mergeCells('G2:H2'); // TRIWULAN 1
    sheet.mergeCells('I2:J2'); // TRIWULAN 2
    sheet.mergeCells('K1:L3'); // Realisasi Pencapaian Kinerja dan Anggaran Renja
    sheet.mergeCells('M1:N3'); // Tingkat Capainkinerja dan anggaran renja

    // Set header values row by row
    sheet.getCell('A1').value = 'Sasaran';
    sheet.getCell('B1').value = 'Indikator Kinerja';
    sheet.getCell('C1').value = 'Program/Kegiatan/Sub Kegiatan';
    sheet.getCell('D1').value = 'Indikator Kinerja Program (outcome) /Kegiatan/Sub Kegiatan (output)';
    sheet.getCell('E1').value = 'Target Kinerja dan Anggaran Renja';
    sheet.getCell('G1').value = 'Realisasi Kinerja Pada Triwulan';
    sheet.getCell('K1').value = 'Realisasi Pencapaian Kinerja dan Anggaran Renja';
    sheet.getCell('M1').value = 'Tingkat Capaian kinerja dan anggaran renja';
    //triwulan header
    sheet.getCell('G2').value = 'TRIWULAN 1';
    sheet.getCell('I2').value = 'TRIWULAN 2';
    // Second-row headers
    sheet.getCell('E3').value = 'K';
    sheet.getCell('F3').value = 'Rp';
    //   sheet.getCell('G3').value = 'K';
    sheet.getCell('G3').value = 'K';
    sheet.getCell('H3').value = 'Rp';

    sheet.getCell('I3').value = 'K';
    sheet.getCell('J3').value = 'Rp';

    // 3rd row
    sheet.getCell('A4').value = '1';
    sheet.getCell('B4').value = '2';
    sheet.getCell('C4').value = '3';
    sheet.getCell('D4').value = '4';
    sheet.getCell('E4').value = '6';
    sheet.getCell('F4').value = '6';
    sheet.getCell('G4').value = '7';
    sheet.getCell('H4').value = '8';
    sheet.getCell('I4').value = '8';
    sheet.getCell('J4').value = '9';
    sheet.getCell('K4').value = 'K';
    sheet.getCell('L4').value = 'Rp';
    sheet.getCell('M4').value = 'K';
    sheet.getCell('N4').value = 'Rp';


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
        { key: 'nama_sasaran', width: 20 },
        { key: 'indikator_sasaran', width: 25 },
        { key: 'program_kegiatan', width: 35 },
        { key: 'indikator_program', width: 30 },
        { key: 'target_anggaran_satuan', width: 15 },
        { key: 'realisasi_anggaran', width: 15 },
        { key: 'triwulan_1_target_kinerja', width: 15 },
        { key: 'triwulan_1_realisasi_kinerja', width: 15 },
        { key: 'triwulan_2_target_kinerja', width: 15 },
        { key: 'triwulan_2_realisasi_kinerja', width: 15 },
        { key: 'total_capaian_kinerja', width: 15 },
        { key: 'total_capaian_anggaran', width: 15 },
        { key: 'tingkat_capaian_kinerja', width: 15 },
        { key: 'tingkat_capaian_anggaran', width: 15 },

    ];

    // let bufferSasaran = '';
    // let bufferIndikatorKinerja = '';
    // let bufferProgram = '';
    // let startRowSasaran = 2;
    // let startRowIndikator = 2;
    // let startRowProgram = 2;

    // data.forEach((row, index) => {
    //     const aggregatedData = {};

    //     const key = `${row.kegiatan_id}_${row.sub_kegiatan_id}`; // Unique key for each kegiatan and sub_kegiatan

    //     // Initialize the object if it doesn't exist
    //     if (!aggregatedData[key]) {
    //         aggregatedData[key] = {
    //             kegiatan_id: row.kegiatan_id,
    //             sub_kegiatan_id: row.sub_kegiatan_id,
    //             nama_sasaran: row.nama_sasaran,
    //             indikator_sasaran: row.indikator_sasaran,
    //             nama_program: row.nama_program,
    //             nama_kegiatan: row.nama_kegiatan,
    //             nama_sub_kegiatan: row.nama_sub_kegiatan,
    //             indikator_program: row.indikator_program,
    //             satuan_program: row.satuan_program,
    //             target_anggaran: 0,
    //             realisasi_anggaran: 0,
    //             triwulan_1_target_kinerja: 0,
    //             triwulan_1_realisasi_kinerja: 0,
    //             triwulan_2_target_kinerja: 0,
    //             triwulan_2_realisasi_kinerja: 0,
    //             triwulan_3_target_kinerja: 0,
    //             triwulan_3_realisasi_kinerja: 0,
    //             triwulan_4_target_kinerja: 0,
    //             triwulan_4_realisasi_kinerja: 0,
    //             total_capaian_kinerja: 0,
    //             total_capaian_anggaran: 0,
    //             tingkat_capaian_kinerja: '',
    //             tingkat_capaian_anggaran: '',
    //         };
    //     }

    //     // Aggregate values
    //     aggregatedData[key].target_anggaran += row.k_target || 0;
    //     aggregatedData[key].realisasi_anggaran += row.anggaran_sub_kegiatan || 0;


    //     if (['Januari', 'Februari', 'Maret'].includes(row.bulan)) { // Triwulan 1
    //         aggregatedData[key].triwulan_1_target_kinerja += row.realisasi_kinerja || 0;
    //         aggregatedData[key].triwulan_1_realisasi_kinerja += row.realisasi_anggaran || 0;
    //     } else if (['April', 'Mei', 'Juni'].includes(row.bulan)) { // Triwulan 2
    //         aggregatedData[key].triwulan_2_target_kinerja += row.realisasi_kinerja || 0;
    //         aggregatedData[key].triwulan_2_realisasi_kinerja += row.realisasi_anggaran || 0;
    //     } else if (['Juli', 'Agustus', 'September'].includes(row.bulan)) { // Triwulan 3
    //         aggregatedData[key].triwulan_3_target_kinerja += row.realisasi_kinerja || 0;
    //         aggregatedData[key].triwulan_3_realisasi_kinerja += row.realisasi_anggaran || 0;
    //     } else if (['Oktober', 'November', 'Desember'].includes(row.bulan)) { // Triwulan 4
    //         aggregatedData[key].triwulan_4_target_kinerja += row.realisasi_kinerja || 0;
    //         aggregatedData[key].triwulan_4_realisasi_kinerja += row.realisasi_anggaran || 0;
    //     }


    //     const finalData = Object.values(aggregatedData).map(item => {
    //         item.total_capaian_kinerja =
    //             item.triwulan_1_target_kinerja +
    //             item.triwulan_2_target_kinerja +
    //             item.triwulan_3_target_kinerja +
    //             item.triwulan_4_target_kinerja;

    //         item.total_capaian_anggaran =
    //             item.triwulan_1_realisasi_kinerja +
    //             item.triwulan_2_realisasi_kinerja +
    //             item.triwulan_3_realisasi_kinerja +
    //             item.triwulan_4_realisasi_kinerja;

    //         item.tingkat_capaian_kinerja =
    //             item.target_anggaran > 0
    //                 ? ((item.total_capaian_kinerja / item.target_anggaran) * 100).toFixed(2) + ' %'
    //                 : '0 %';

    //         item.tingkat_capaian_anggaran =
    //             item.realisasi_anggaran > 0
    //                 ? ((item.total_capaian_anggaran / item.realisasi_anggaran) * 100).toFixed(2) + ' %'
    //                 : '0 %';

    //         return item;
    //     });

    //     const currentRow = sheet.addRow({
    //         sasaran: row.nama_sasaran,
    //         indikator_kinerja: row.indikator_sasaran,
    //         program_kegiatan: row.nama_program + ',' + row.nama_kegiatan + ', ' + row.nama_sub_kegiatan,
    //         indikator_program: row.indikator_program,
    //         ...aggregatedData[key]
    //     });
    //     // console.log(finalData)
    //     // Merge "Sasaran" column
    //     if (row.nama_sasaran === bufferSasaran) {
    //         // Do nothing, keep tracking
    //     } else {
    //         if (bufferSasaran && startRowSasaran < currentRow.number - 1) {
    //             sheet.mergeCells(`A${startRowSasaran}:A${currentRow.number - 1}`);
    //         }
    //         bufferSasaran = row.nama_sasaran;
    //         startRowSasaran = currentRow.number;
    //     }

    //     // Merge "Indikator Kinerja" column
    //     if (row.indikator_sasaran === bufferIndikatorKinerja) {
    //         // Do nothing, keep tracking
    //     } else {
    //         if (bufferIndikatorKinerja && startRowIndikator < currentRow.number - 1) {
    //             sheet.mergeCells(`B${startRowIndikator}:B${currentRow.number - 1}`);
    //             sheet.mergeCells(`C${startRowIndikator}:C${currentRow.number - 1}`);
    //             sheet.mergeCells(`D${startRowIndikator}:D${currentRow.number - 1}`);
    //             sheet.mergeCells(`E${startRowIndikator}:E${currentRow.number - 1}`);
    //             sheet.mergeCells(`F${startRowIndikator}:E${currentRow.number - 1}`);
    //         }
    //         bufferIndikatorKinerja = row.indikator_sasaran;
    //         startRowIndikator = currentRow.number;
    //     }


    // });

    // // Finalize merging for the last groups
    // if (startRowSasaran < sheet.lastRow.number) {
    //     sheet.mergeCells(`A${startRowSasaran}:A${sheet.lastRow.number}`);
    // }
    // if (startRowIndikator < sheet.lastRow.number) {
    //     sheet.mergeCells(`B${startRowIndikator}:B${sheet.lastRow.number}`);
    //     sheet.mergeCells(`C${startRowIndikator}:C${sheet.lastRow.number}`);
    //     sheet.mergeCells(`D${startRowIndikator}:D${sheet.lastRow.number}`);
    //     sheet.mergeCells(`E${startRowIndikator}:E${sheet.lastRow.number}`);
    //     sheet.mergeCells(`F${startRowIndikator}:F${sheet.lastRow.number}`);
    // }

    const aggregatedData = {}; // To store aggregated data by kegiatan_id and sub_kegiatan_id

    data.forEach(row => {
        const key = `${row.kegiatan_id}_${row.sub_kegiatan_id}`; // Unique key for each kegiatan and sub_kegiatan

        // Initialize the object if it doesn't exist
        if (!aggregatedData[key]) {
            aggregatedData[key] = {
                kegiatan_id: row.kegiatan_id,
                sub_kegiatan_id: row.sub_kegiatan_id,
                nama_sasaran: row.nama_sasaran,
                indikator_sasaran: row.indikator_sasaran,
                nama_program: row.nama_program,
                nama_kegiatan: row.nama_kegiatan,
                nama_sub_kegiatan: row.nama_sub_kegiatan,
                indikator_program: row.indikator_program,
                satuan_program: row.satuan_program,
                target_anggaran: 0,
                realisasi_anggaran: 0,
                triwulan_1_target_kinerja: 0,
                triwulan_1_realisasi_kinerja: 0,
                triwulan_2_target_kinerja: 0,
                triwulan_2_realisasi_kinerja: 0,
                triwulan_3_target_kinerja: 0,
                triwulan_3_realisasi_kinerja: 0,
                triwulan_4_target_kinerja: 0,
                triwulan_4_realisasi_kinerja: 0,
                total_capaian_kinerja: 0,
                total_capaian_anggaran: 0,
                tingkat_capaian_kinerja: '',
                tingkat_capaian_anggaran: '',
            };
        }

        // Aggregate values
        aggregatedData[key].target_anggaran += row.k_target || 0;
        aggregatedData[key].realisasi_anggaran += row.anggaran_sub_kegiatan || 0;

        if (['Januari', 'Februari', 'Maret'].includes(row.bulan)) { // Triwulan 1
            aggregatedData[key].triwulan_1_target_kinerja += row.realisasi_kinerja || 0;
            aggregatedData[key].triwulan_1_realisasi_kinerja += row.realisasi_anggaran || 0;
        } else if (['April', 'Mei', 'Juni'].includes(row.bulan)) { // Triwulan 2
            aggregatedData[key].triwulan_2_target_kinerja += row.realisasi_kinerja || 0;
            aggregatedData[key].triwulan_2_realisasi_kinerja += row.realisasi_anggaran || 0;
        } else if (['Juli', 'Agustus', 'September'].includes(row.bulan)) { // Triwulan 3
            aggregatedData[key].triwulan_3_target_kinerja += row.realisasi_kinerja || 0;
            aggregatedData[key].triwulan_3_realisasi_kinerja += row.realisasi_anggaran || 0;
        } else if (['Oktober', 'November', 'Desember'].includes(row.bulan)) { // Triwulan 4
            aggregatedData[key].triwulan_4_target_kinerja += row.realisasi_kinerja || 0;
            aggregatedData[key].triwulan_4_realisasi_kinerja += row.realisasi_anggaran || 0;
        }
        

        // Adjustments based on new logic
        aggregatedData[key].adjusted_capaian_kinerja = aggregatedData[key].total_capaian_kinerja * 1.1; // Example adjustment
        aggregatedData[key].adjusted_capaian_anggaran = aggregatedData[key].total_capaian_anggaran * 0.9; // Example adjustment
    });

    // Final calculations
    const finalData = Object.values(aggregatedData).map(item => {
        item.total_capaian_kinerja =
            item.triwulan_1_target_kinerja +
            item.triwulan_2_target_kinerja +
            item.triwulan_3_target_kinerja +
            item.triwulan_4_target_kinerja;

        item.total_capaian_anggaran =
            item.triwulan_1_realisasi_kinerja +
            item.triwulan_2_realisasi_kinerja +
            item.triwulan_3_realisasi_kinerja +
            item.triwulan_4_realisasi_kinerja;

        item.tingkat_capaian_kinerja =
            item.target_anggaran > 0
                ? ((item.total_capaian_kinerja / item.target_anggaran) * 100).toFixed(2) + ' %'
                : '0 %';

        item.tingkat_capaian_anggaran =
            item.realisasi_anggaran > 0
                ? ((item.total_capaian_anggaran / item.realisasi_anggaran) * 100).toFixed(2) + ' %'
                : '0 %';

        return item;
    });

    console.log(finalData)

    finalData.forEach(row => {
        sheet.addRow({program_kegiatan: row.nama_program + ', ' + row.nama_kegiatan + ' DAN ' + row.nama_sub_kegiatan,
            target_anggaran_satuan: row.target_anggaran + ' ' + row.satuan_program,
            ...row})
    })
    // Save file
    const filePath = path.join(__dirname, `../downloads/${fileName}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
}

module.exports = exportToExcelTriwulan;

