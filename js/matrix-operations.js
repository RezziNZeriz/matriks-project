// Matrix Operations JavaScript - js/matrix-operations.js

// Matrix operation functions
function calculateOperation() {
    try {
        // Get matrices from inputs
        const matrixA = getMatrixFromInputs('matrixA');
        const matrixB = getMatrixFromInputs('matrixB');
        
        // Validate matrices
        if (!validateMatrices(matrixA, matrixB)) {
            return;
        }
        
        // Show loading
        showCalculationLoading();
        
        // Perform calculation after a short delay for smooth UX
        setTimeout(() => {
            let result;
            let steps = [];
            
            try {
                switch (currentOperation) {
                    case 'add':
                        result = addMatrices(matrixA, matrixB);
                        steps = generateAdditionSteps(matrixA, matrixB, result);
                        break;
                    case 'subtract':
                        result = subtractMatrices(matrixA, matrixB);
                        steps = generateSubtractionSteps(matrixA, matrixB, result);
                        break;
                    case 'multiply':
                        result = multiplyMatrices(matrixA, matrixB);
                        steps = generateMultiplicationSteps(matrixA, matrixB, result);
                        break;
                    case 'divide':
                        result = divideMatrices(matrixA, matrixB);
                        steps = generateDivisionSteps(matrixA, matrixB, result);
                        break;
                    default:
                        throw new Error('Unknown operation');
                }
                
                // Display results
                displayResults(matrixA, matrixB, result, steps);
                hideCalculationLoading();
                
            } catch (error) {
                hideCalculationLoading();
                showErrorMessage(error.message);
            }
        }, 500);
        
    } catch (error) {
        showErrorMessage('Error reading matrix inputs: ' + error.message);
    }
}

// Get matrix from input elements
function getMatrixFromInputs(matrixId) {
    const matrixElement = document.getElementById(matrixId);
    const inputs = matrixElement.querySelectorAll('input');
    const matrix = [];
    
    for (let i = 0; i < matrixRows; i++) {
        matrix[i] = [];
        for (let j = 0; j < matrixCols; j++) {
            const input = document.getElementById(`${matrixId}_${i}_${j}`);
            const value = parseFloat(input.value) || 0;
            matrix[i][j] = value;
        }
    }
    
    return matrix;
}

// Validate matrices for operations
function validateMatrices(matrixA, matrixB) {
    if (!matrixA || !matrixB) {
        showErrorMessage('Matrices are required');
        return false;
    }
    
    switch (currentOperation) {
        case 'add':
        case 'subtract':
            if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                showErrorMessage('For addition and subtraction, matrices must have the same dimensions');
                return false;
            }
            break;
        case 'multiply':
            if (matrixA[0].length !== matrixB.length) {
                showErrorMessage('For multiplication, the number of columns in Matrix A must equal the number of rows in Matrix B');
                return false;
            }
            break;
        case 'divide':
            if (matrixA[0].length !== matrixB.length || matrixB.length !== matrixB[0].length) {
                showErrorMessage('For division, Matrix B must be square and compatible with Matrix A');
                return false;
            }
            break;
    }
    
    return true;
}

// Matrix addition
function addMatrices(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixA[0].length; j++) {
            result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
    }
    return result;
}

// Matrix subtraction
function subtractMatrices(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixA[0].length; j++) {
            result[i][j] = matrixA[i][j] - matrixB[i][j];
        }
    }
    return result;
}

// Matrix multiplication
function multiplyMatrices(matrixA, matrixB) {
    const result = [];
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const colsB = matrixB[0].length;
    
    for (let i = 0; i < rowsA; i++) {
        result[i] = [];
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            result[i][j] = sum;
        }
    }
    
    return result;
}

// Matrix division (A * B^-1)
function divideMatrices(matrixA, matrixB) {
    try {
        const inverseB = calculateMatrixInverse(matrixB);
        return multiplyMatrices(matrixA, inverseB);
    } catch (error) {
        throw new Error('Cannot divide matrices: ' + error.message);
    }
}

// Calculate matrix inverse using Gaussian elimination
function calculateMatrixInverse(matrix) {
    const n = matrix.length;
    
    // Check if matrix is square
    if (matrix.some(row => row.length !== n)) {
        throw new Error('Matrix must be square for inversion');
    }
    
    // Create augmented matrix [A|I]
    const augmented = [];
    for (let i = 0; i < n; i++) {
        augmented[i] = [...matrix[i]];
        for (let j = 0; j < n; j++) {
            augmented[i][n + j] = i === j ? 1 : 0;
        }
    }
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Swap rows
        if (maxRow !== i) {
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        }
        
        // Check for singular matrix
        if (Math.abs(augmented[i][i]) < 1e-10) {
            throw new Error('Matrix is singular and cannot be inverted');
        }
        
        // Scale pivot row
        const pivot = augmented[i][i];
        for (let j = 0; j < 2 * n; j++) {
            augmented[i][j] /= pivot;
        }
        
        // Eliminate column
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = augmented[k][i];
                for (let j = 0; j < 2 * n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }
    }
    
    // Extract inverse matrix
    const inverse = [];
    for (let i = 0; i < n; i++) {
        inverse[i] = augmented[i].slice(n);
    }
    
    return inverse;
}

// Generate addition steps
function generateAdditionSteps(matrixA, matrixB, result) {
    const steps = [];
    steps.push('Langkah-langkah penjumlahan matriks:');
    steps.push('Untuk penjumlahan matriks, kita menjumlahkan elemen-elemen yang berada pada posisi yang sama.');
    steps.push('');
    
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[0].length; j++) {
            steps.push(`Elemen (${i+1},${j+1}): ${matrixA[i][j]} + ${matrixB[i][j]} = ${result[i][j]}`);
        }
    }
    
    return steps;
}

// Generate subtraction steps
function generateSubtractionSteps(matrixA, matrixB, result) {
    const steps = [];
    steps.push('Langkah-langkah pengurangan matriks:');
    steps.push('Untuk pengurangan matriks, kita mengurangkan elemen-elemen yang berada pada posisi yang sama.');
    steps.push('');
    
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[0].length; j++) {
            steps.push(`Elemen (${i+1},${j+1}): ${matrixA[i][j]} - ${matrixB[i][j]} = ${result[i][j]}`);
        }
    }
    
    return steps;
}

// Generate multiplication steps
function generateMultiplicationSteps(matrixA, matrixB, result) {
    const steps = [];
    steps.push('Langkah-langkah perkalian matriks:');
    steps.push('Untuk perkalian matriks, elemen (i,j) hasil adalah dot product dari baris i matriks A dengan kolom j matriks B.');
    steps.push('');
    
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const colsB = matrixB[0].length;
    
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let calculation = `Elemen (${i+1},${j+1}): `;
            let terms = [];
            
            for (let k = 0; k < colsA; k++) {
                terms.push(`${matrixA[i][k]} × ${matrixB[k][j]}`);
            }
            
            calculation += terms.join(' + ');
            calculation += ` = ${result[i][j]}`;
            steps.push(calculation);
        }
    }
    
    return steps;
}

// Generate division steps
function generateDivisionSteps(matrixA, matrixB, result) {
    const steps = [];
    steps.push('Langkah-langkah pembagian matriks:');
    steps.push('Pembagian matriks A ÷ B = A × B⁻¹ (A dikali dengan invers B)');
    steps.push('');
    steps.push('1. Menghitung invers matriks B menggunakan eliminasi Gauss-Jordan');
    steps.push('2. Mengalikan matriks A dengan invers B');
    steps.push('');
    steps.push('Hasil akhir diperoleh dari perkalian A × B⁻¹');
    
    return steps;
}

// Display calculation results
function displayResults(matrixA, matrixB, result, steps) {
    // Show result area
    const resultArea = document.getElementById('resultArea');
    resultArea.style.display = 'block';
    resultArea.style.opacity = '0';
    resultArea.style.transform = 'translateY(20px)';
    
    // Display matrices
    displayMatrixInResult('resultMatrixA', matrixA);
    displayMatrixInResult('resultMatrixB', matrixB);
    displayMatrixInResult('resultMatrixC', result);
    
    // Display calculation steps
    const stepsElement = document.getElementById('calculationSteps');
    stepsElement.innerHTML = '';
    
    const stepsTitle = document.createElement('h4');
    stepsTitle.textContent = '📋 Langkah-langkah Perhitungan:';
    stepsTitle.style.marginBottom = '15px';
    stepsElement.appendChild(stepsTitle);
    
    steps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.textContent = step;
        stepElement.style.marginBottom = '8px';
        stepElement.style.fontFamily = 'monospace';
        stepElement.style.fontSize = '14px';
        
        if (step === '' || step.includes('Langkah-langkah') || step.includes('Untuk')) {
            stepElement.style.fontWeight = 'bold';
            stepElement.style.color = '#2c3e50';
        } else if (step.includes('Elemen')) {
            stepElement.style.paddingLeft = '20px';
            stepElement.style.color = '#34495e';
        }
        
        stepsElement.appendChild(stepElement);
    });
    
    // Animate result area
    setTimeout(() => {
        resultArea.style.opacity = '1';
        resultArea.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to results
    setTimeout(() => {
        smoothScrollTo(resultArea);
    }, 300);
    
    showSuccessMessage('Calculation completed successfully!');
}

// Display matrix in result area
function displayMatrixInResult(elementId, matrix) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    // Create matrix table
    const table = document.createElement('table');
    table.className = 'matrix-table';
    
    matrix.forEach((row, i) => {
        const tr = document.createElement('tr');
        row.forEach((cell, j) => {
            const td = document.createElement('td');
            td.textContent = Number.isInteger(cell) ? cell : cell.toFixed(2);
            td.style.textAlign = 'center';
            td.style.padding = '8px 12px';
            td.style.border = '1px solid #e9ecef';
            td.style.backgroundColor = '#f8f9fa';
            td.style.minWidth = '60px';
            
            // Add hover effect
            td.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e9ecef';
                this.style.transform = 'scale(1.05)';
            });
            
            td.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#f8f9fa';
                this.style.transform = 'scale(1)';
            });
            
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
    element.appendChild(table);
}

// Show calculation loading
function showCalculationLoading() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.disabled = true;
        calculateBtn.innerHTML = `
            <div class="spinner" style="display: inline-block; width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></div>
            Menghitung...
        `;
    }
}

// Hide calculation loading
function hideCalculationLoading() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.disabled = false;
        calculateBtn.innerHTML = 'Hitung Hasil';
    }
}

// Add keyboard shortcuts for matrix operations
document.addEventListener('keydown', function(event) {
    if (currentSection === 'operations') {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'Enter':
                    event.preventDefault();
                    calculateOperation();
                    break;
                case 'r':
                    event.preventDefault();
                    randomFillMatrix('A');
                    randomFillMatrix('B');
                    break;
                case 'c':
                    event.preventDefault();
                    clearMatrix('A');
                    clearMatrix('B');
                    break;
            }
        }
    }
});

// Add matrix validation with visual feedback
function validateMatrixInputs() {
    const matrixA = document.getElementById('matrixA');
    const matrixB = document.getElementById('matrixB');
    
    if (!matrixA || !matrixB) return false;
    
    const inputsA = matrixA.querySelectorAll('input');
    const inputsB = matrixB.querySelectorAll('input');
    
    let isValid = true;
    
    // Check for empty or invalid inputs
    [...inputsA, ...inputsB].forEach(input => {
        if (input.value === '' || isNaN(parseFloat(input.value))) {
            input.style.borderColor = '#dc3545';
            input.style.backgroundColor = '#f8d7da';
            isValid = false;
        } else {
            input.style.borderColor = '#28a745';
            input.style.backgroundColor = '#d4edda';
        }
    });
    
    // Reset colors after validation
    setTimeout(() => {
        [...inputsA, ...inputsB].forEach(input => {
            input.style.borderColor = '#e9ecef';
            input.style.backgroundColor = 'white';
        });
    }, 2000);
    
    return isValid;
}

// Format number for display
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    // Round to 6 decimal places and remove trailing zeros
    return parseFloat(num.toFixed(6)).toString();
}

// Matrix utilities
const MatrixUtils = {
    // Check if matrix is square
    isSquare: function(matrix) {
        return matrix.length === matrix[0].length;
    },
    
    // Get matrix dimensions
    getDimensions: function(matrix) {
        return {
            rows: matrix.length,
            cols: matrix[0].length
        };
    },
    
    // Create identity matrix
    createIdentity: function(size) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                matrix[i][j] = i === j ? 1 : 0;
            }
        }
        return matrix;
    },
    
    // Create zero matrix
    createZero: function(rows, cols) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = 0;
            }
        }
        return matrix;
    },
    
    // Transpose matrix
    transpose: function(matrix) {
        const result = [];
        const rows = matrix.length;
        const cols = matrix[0].length;
        
        for (let j = 0; j < cols; j++) {
            result[j] = [];
            for (let i = 0; i < rows; i++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    },
    
    // Copy matrix
    copy: function(matrix) {
        return matrix.map(row => [...row]);
    }
};

console.log('Matrix Operations module loaded successfully');