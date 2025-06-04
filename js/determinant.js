// js/determinant.js

/**
 * Mengambil nilai dari input field matriks determinan.
 * Input ID diharapkan berformat "det_ROW_COL" (misalnya, "det_0_1").
 * @param {number} row Indeks baris matriks.
 * @param {number} col Indeks kolom matriks.
 * @returns {number} Nilai numerik dari sel matriks.
 */
function getDetVal(row, col) {
    const inputId = `det_${row}_${col}`;
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
        console.error(`Input element not found: ${inputId}`);
        return 0;
    }
    const value = inputElement.value;
    return value === '' ? 0 : parseFloat(value);
}

/**
 * Menghitung determinan matriks 4x4 menggunakan metode "Sarrus Mode"
 * yang Anda definisikan.
 * @param {number[][]} matrix Matriks 4x4 sebagai array 2D.
 * @returns {object} Objek berisi determinan (det) dan komponen A1, A2, A3.
 */
function calculateSarrus4x4Det(matrix) {
    // Pastikan matriksnya 4x4
    if (matrix.length !== 4 || matrix.some(row => row.length !== 4)) {
        console.error("Matrix must be 4x4 for this Sarrus mode calculation.");
        return { det: NaN, A1: NaN, A2: NaN, A3: NaN };
    }

    const [a,b,c,d] = matrix[0];
    const [e,f,g,h] = matrix[1];
    const [i_,j_val,k_val,l_val] = matrix[2];
    const [m_,n_val,o_val,p_val] = matrix[3];


    // Menggunakan nama variabel elemen matriks untuk formula
    const elem_i = matrix[2][0]; const elem_j = matrix[2][1]; const elem_k = matrix[2][2]; const elem_l = matrix[2][3];
    const elem_m = matrix[3][0]; const elem_n = matrix[3][1]; const elem_o = matrix[3][2]; const elem_p = matrix[3][3];


    const A1 = a*f*elem_k*elem_p - b*g*elem_l*elem_m + c*h*elem_i*elem_n - d*e*elem_j*elem_o
             - a*h*elem_k*elem_n + b*e*elem_l*elem_o - c*f*elem_i*elem_p + d*g*elem_j*elem_m;

    const A2 = -a*f*elem_l*elem_o + b*g*elem_i*elem_p - c*h*elem_j*elem_m + d*e*elem_k*elem_n
              + a*h*elem_j*elem_o - b*e*elem_k*elem_p + c*f*elem_l*elem_m - d*g*elem_i*elem_n;

    const A3 = a*g*elem_l*elem_n - b*h*elem_i*elem_o + c*e*elem_j*elem_p - d*f*elem_k*elem_m
              - a*g*elem_j*elem_p + b*h*elem_k*elem_m - c*e*elem_l*elem_n + d*f*elem_i*elem_o;

    const det = A1 + A2 + A3;
    return { det, A1, A2, A3, a,b,c,d, e,f,g,h, i:elem_i,j:elem_j,k:elem_k,l:elem_l, m:elem_m,n:elem_n,o:elem_o,p:elem_p };
}

/**
 * Fungsi utama yang dipanggil oleh tombol "Hitung Determinan" di index.html.
 * Mengumpulkan data matriks, menghitung determinan, dan menampilkan hasil serta visualisasi.
 */
function calculateDeterminant() {
    const detLoadingElement = document.getElementById('detLoading');
    const detResultElement = document.getElementById('detResult');
    const detVisualSectionElement = document.getElementById('detVisualSection');

    if (detLoadingElement) detLoadingElement.style.display = 'block';
    if (detResultElement) detResultElement.textContent = 'Menghitung...';
    if (detVisualSectionElement) detVisualSectionElement.style.display = 'none';

    // Memberi sedikit jeda agar animasi loading terlihat (opsional)
    setTimeout(() => {
        const matrixData = Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => getDetVal(i, j))
        );

        const results = calculateSarrus4x4Det(matrixData);
        const { det, A1, A2, A3, a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p } = results;


        if (isNaN(det)) {
             if (detResultElement) detResultElement.textContent = "Gagal menghitung. Pastikan semua input adalah angka.";
             if (detLoadingElement) detLoadingElement.style.display = 'none';
             return;
        }
        
        // Format string untuk ditampilkan (mirip dengan ayam.html)
        // Menggunakan padStart untuk merapikan tampilan teks matriks
        const formatNum = (num) => num.toString().padStart(7);

        const steps = `🎯 MATRIKS INPUT:
┌ ${formatNum(a)} ${formatNum(b)} ${formatNum(c)} ${formatNum(d)} ┐
│ ${formatNum(e)} ${formatNum(f)} ${formatNum(g)} ${formatNum(h)} │
│ ${formatNum(i)} ${formatNum(j)} ${formatNum(k)} ${formatNum(l)} │
│ ${formatNum(m)} ${formatNum(n)} ${formatNum(o)} ${formatNum(p)} │
└ ${''.padStart(7)} ${''.padStart(7)} ${''.padStart(7)} ${''.padStart(7)} ┘

📊 PERHITUNGAN DETERMINAN MENGGUNAKAN SARRUS MODE:

🔸 A1 = ${a}×${f}×${k}×${p} - ${b}×${g}×${l}×${m} + ${c}×${h}×${i}×${n} - ${d}×${e}×${j}×${o}
        - ${a}×${h}×${k}×${n} + ${b}×${e}×${l}×${o} - ${c}×${f}×${i}×${p} + ${d}×${g}×${j}×${m}
   A1 = ${A1}

🔸 A2 = -${a}×${f}×${l}×${o} + ${b}×${g}×${i}×${p} - ${c}×${h}×${j}×${m} + ${d}×${e}×${k}×${n}
        + ${a}×${h}×${j}×${o} - ${b}×${e}×${k}×${p} + ${c}×${f}×${l}×${m} - ${d}×${g}×${i}×${n}
   A2 = ${A2}

🔸 A3 = ${a}×${g}×${l}×${n} - ${b}×${h}×${i}×${o} + ${c}×${e}×${j}×${p} - ${d}×${f}×${k}×${m}
        - ${a}×${g}×${j}×${p} + ${b}×${h}×${k}×${m} - ${c}×${e}×${l}×${n} + ${d}×${f}×${i}×${o}
   A3 = ${A3}

🎊 HASIL AKHIR:
Det(A) = A1 + A2 + A3 = ${A1} + ${A2} + ${A3} = ${det}`;

        if (detResultElement) detResultElement.textContent = steps;
        if (detLoadingElement) detLoadingElement.style.display = 'none';

        // Tampilkan bagian visualisasi dan buat diagramnya
        if (detVisualSectionElement) detVisualSectionElement.style.display = 'block';
        createVisualDiagramsDet(matrixData); // Menggunakan nama fungsi yang berbeda untuk visualisasi determinan

    }, 500); // Jeda 0.5 detik
}

// --- FUNGSI VISUALISASI ---
// Diadaptasi dari ayam.html untuk digunakan di index.html
// Pastikan class CSS yang digunakan (.matrix-grid, .matrix-cell, .diagonal-line, dll.)
// tersedia di file CSS Anda (misalnya, styles/determinant.css).

// /**
//  * Membuat visualisasi matriks tunggal dengan diagonal.
//  * @param {string} containerId ID dari elemen div untuk menampung visualisasi.
//  * @param {number[][]} matrix Matriks 4x4 asli.
//  * @param {object[]} diagonals Array objek yang mendefinisikan garis diagonal.
//  */
// function createMatrixVisualDet(containerId, matrix, diagonals) {
//     const container = document.getElementById(containerId);
//     if (!container) {
//         console.error(`Elemen visual #${containerId} tidak ditemukan.`);
//         return;
//     }
//     container.innerHTML = ''; // Bersihkan visualisasi sebelumnya

//     const matrixGrid = document.createElement('div');
//     matrixGrid.className = 'matrix-grid'; // Pastikan class ini ada di CSS Anda

//     // Buat matriks yang diperluas (4x7) untuk visualisasi metode Sarrus
//     for (let i = 0; i < 4; i++) {
//         for (let j = 0; j < 7; j++) {
//             const cell = document.createElement('div');
//             cell.className = 'matrix-cell'; // Pastikan class ini ada di CSS Anda
            
//             const colIndex = j < 4 ? j : j - 4; // Ulangi 3 kolom pertama
//             const value = matrix[i][colIndex];
//             cell.textContent = value.toString();
//             cell.id = `${containerId}-cell-${i}-${j}`; // ID unik untuk sel
            
//             matrixGrid.appendChild(cell);
//         }
//     }
//     container.appendChild(matrixGrid);
    
//     // Tambahkan garis diagonal setelah elemen sel dirender
//     setTimeout(() => {
//         diagonals.forEach(diagonal => {
//             drawDiagonalLineDet(containerId, diagonal);
//         });
//     }, 100); // Sedikit delay untuk memastikan rendering DOM
// }

// /**
//  * Menggambar satu garis diagonal pada visualisasi matriks.
//  * @param {string} containerId ID dari elemen div kontainer visualisasi.
//  * @param {object} diagonal Objek yang mendefinisikan titik awal, akhir, dan tipe diagonal.
//  */
// function drawDiagonalLineDet(containerId, diagonal) {
//     const container = document.getElementById(containerId);
//     if (!container) return;

//     const { start, end, isPositive } = diagonal;
    
//     const startCell = document.getElementById(`${containerId}-cell-${start.row}-${start.col}`);
//     const endCell = document.getElementById(`${containerId}-cell-${end.row}-${end.col}`);
    
//     if (!startCell || !endCell) {
//         // console.warn(`Sel diagonal tidak ditemukan untuk ${containerId}:`, start, end);
//         return;
//     }

//     // Pastikan sel sudah memiliki dimensi (sudah dirender dan terlihat)
//     if (startCell.offsetWidth === 0 || endCell.offsetWidth === 0 || startCell.offsetHeight === 0 || endCell.offsetHeight === 0) {
//         // console.warn("Sel diagonal belum dirender sepenuhnya, tidak bisa menggambar garis untuk", containerId);
//         // Ini bisa terjadi jika section 'determinant' atau 'detVisualSection' masih display:none
//         // atau elemennya belum selesai di-layout oleh browser.
//         // Pemanggilan createVisualDiagramsDet sudah diatur setelah detVisualSectionElement.style.display = 'block';
//         // jadi seharusnya ini jarang terjadi, tetapi periksa CSS jika masalah berlanjut.
//         return;
//     }
    
//     const startRect = startCell.getBoundingClientRect();
//     const endRect = endCell.getBoundingClientRect();
//     const containerRect = container.getBoundingClientRect();
    
//     // Kalkulasi posisi relatif terhadap kontainer visual
//     const startX = startRect.left + startRect.width / 2 - containerRect.left;
//     const startY = startRect.top + startRect.height / 2 - containerRect.top;
//     const endX = endRect.left + endRect.width / 2 - containerRect.left;
//     const endY = endRect.top + endRect.height / 2 - containerRect.top;
    
//     const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
//     const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    
//     const line = document.createElement('div');
//     line.className = `diagonal-line ${isPositive ? 'positive' : 'negative'}`; // Class dari CSS
//     line.style.width = `${length}px`;
//     line.style.left = `${startX}px`;
//     line.style.top = `${startY}px`;
//     line.style.transform = `rotate(${angle}deg)`;
    
//     container.appendChild(line);
// }

// /**
//  * Membuat ketiga diagram visualisasi (A1, A2, A3).
//  * @param {number[][]} matrix Matriks 4x4 asli.
//  */
// function createVisualDiagramsDet(matrix) {
//     // Pola diagonal (sama seperti di ayam.html)
//     // Harap diperhatikan bahwa metode Sarrus umumnya untuk matriks 3x3.
//     // Pola diagonal ini adalah interpretasi spesifik untuk "Sarrus Mode 4x4" Anda.
//     const diagonalsA1 = [
//         { start: {row: 0, col: 0}, end: {row: 3, col: 3}, isPositive: true }, { start: {row: 0, col: 2}, end: {row: 3, col: 5}, isPositive: true },
//         { start: {row: 1, col: 1}, end: {row: 3, col: 3}, isPositive: true }, { start: {row: 1, col: 5}, end: {row: 3, col: 3}, isPositive: true },
//         { start: {row: 0, col: 1}, end: {row: 3, col: 4}, isPositive: false }, { start: {row: 0, col: 3}, end: {row: 3, col: 6}, isPositive: false },
//         { start: {row: 1, col: 0}, end: {row: 3, col: 2}, isPositive: false }, { start: {row: 1, col: 2}, end: {row: 3, col: 4}, isPositive: false }
//     ];
//     const diagonalsA2 = [
//         { start: {row: 0, col: 1}, end: {row: 3, col: 4}, isPositive: true }, { start: {row: 0, col: 3}, end: {row: 3, col: 0}, isPositive: true },
//         { start: {row: 1, col: 0}, end: {row: 2, col: 1}, isPositive: true }, { start: {row: 1, col: 2}, end: {row: 2, col: 3}, isPositive: true },
//         { start: {row: 0, col: 0}, end: {row: 3, col: 3}, isPositive: false }, { start: {row: 0, col: 2}, end: {row: 3, col: 5}, isPositive: false },
//         { start: {row: 1, col: 1}, end: {row: 3, col: 3}, isPositive: false }, { start: {row: 1, col: 3}, end: {row: 3, col: 5}, isPositive: false }
//     ];
//     const diagonalsA3 = [
//         { start: {row: 0, col: 1}, end: {row: 3, col: 4}, isPositive: true }, { start: {row: 0, col: 2}, end: {row: 3, col: 5}, isPositive: true },
//         { start: {row: 1, col: 0}, end: {row: 2, col: 1}, isPositive: true }, { start: {row: 1, col: 3}, end: {row: 2, col: 4}, isPositive: true },
//         { start: {row: 0, col: 0}, end: {row: 3, col: 3}, isPositive: false }, { start: {row: 0, col: 3}, end: {row: 3, col: 6}, isPositive: false },
//         { start: {row: 1, col: 1}, end: {row: 2, col: 2}, isPositive: false }, { start: {row: 1, col: 2}, end: {row: 2, col: 3}, isPositive: false }
//     ];

//     // ID kontainer visual di index.html: 'visualA1', 'visualA2', 'visualA3'
//     createMatrixVisualDet('visualA1', matrix, diagonalsA1);
//     createMatrixVisualDet('visualA2', matrix, diagonalsA2);
//     createMatrixVisualDet('visualA3', matrix, diagonalsA3);
// }

// // Fungsi-fungsi seperti generateRandomDetMatrix() dan clearDetMatrix() sudah ada di js/main.js
// // dan dipanggil langsung dari HTML, jadi tidak perlu didefinisikan ulang di sini.
// // Pastikan `calculateDeterminant` dapat diakses secara global karena dipanggil via onclick.