// Main JavaScript - js/main.js

// Global variables
let currentSection = 'home';
let currentOperation = 'add';
let matrixRows = 2;
let matrixCols = 2;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    showSection('home');
});

// Initialize application
function initializeApp() {
    console.log('Matrix Calculator Pro initialized');
    
    // Set default operation
    setActiveOperation('add');
    
    // Add smooth transitions
    document.body.style.transition = 'all 0.3s ease';
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });
    
    // Operation buttons
    const opBtns = document.querySelectorAll('.op-btn');
    opBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const operation = this.getAttribute('data-op');
            setActiveOperation(operation);
        });
    });
    
    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });
    
    // Remove active class from all nav buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show target section with animation
    setTimeout(() => {
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            
            // Animate section entrance
            setTimeout(() => {
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
            
            // Update nav button
            const activeNavBtn = document.querySelector(`[onclick*="${sectionName}"]`);
            if (activeNavBtn) {
                activeNavBtn.classList.add('active');
            }
            
            currentSection = sectionName;
            
            // Section-specific initialization
            if (sectionName === 'operations') {
                initializeOperationsSection();
            } else if (sectionName === 'determinant') {
                initializeDeterminantSection();
            }
        }
    }, 150);
}

// Set active operation
function setActiveOperation(operation) {
    currentOperation = operation;
    
    // Update operation buttons
    const opBtns = document.querySelectorAll('.op-btn');
    opBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-op') === operation) {
            btn.classList.add('active');
        }
    });
    
    // Update operation symbol
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷'
    };
    
    const opSymbol = document.getElementById('opSymbol');
    if (opSymbol) {
        opSymbol.textContent = symbols[operation];
        opSymbol.style.transform = 'scale(1.2)';
        setTimeout(() => {
            opSymbol.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Update result operation symbol
    const resultOpSymbol = document.getElementById('resultOpSymbol');
    if (resultOpSymbol) {
        resultOpSymbol.textContent = symbols[operation];
    }
}

// Initialize operations section
function initializeOperationsSection() {
    console.log('Operations section initialized');
    
    // Hide matrix input area initially
    const matrixInputArea = document.getElementById('matrixInputArea');
    if (matrixInputArea) {
        matrixInputArea.style.display = 'none';
    }
    
    // Hide result area initially
    const resultArea = document.getElementById('resultArea');
    if (resultArea) {
        resultArea.style.display = 'none';
    }
}

// Initialize determinant section
function initializeDeterminantSection() {
    console.log('Determinant section initialized');
    
    // Create 4x4 matrix inputs
    createDeterminantMatrix();
    
    // Hide visual section initially
    const visualSection = document.getElementById('detVisualSection');
    if (visualSection) {
        visualSection.classList.remove('show');
    }
}

// Set matrix size
function setMatrixSize(rows, cols) {
    matrixRows = rows;
    matrixCols = cols;
    
    // Update size button states
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === `${rows}×${cols}`) {
            btn.classList.add('active');
        }
    });
    
    // Show matrix input area
    const matrixInputArea = document.getElementById('matrixInputArea');
    if (matrixInputArea) {
        matrixInputArea.style.display = 'block';
        matrixInputArea.style.opacity = '0';
        matrixInputArea.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            matrixInputArea.style.opacity = '1';
            matrixInputArea.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Create matrix grids
    createMatrixGrid('matrixA', rows, cols);
    createMatrixGrid('matrixB', rows, cols);
    
    // Hide result area
    const resultArea = document.getElementById('resultArea');
    if (resultArea) {
        resultArea.style.display = 'none';
    }
    
    console.log(`Matrix size set to ${rows}×${cols}`);
}

// Set custom matrix size
function setCustomSize() {
    const customRows = document.getElementById('customRows');
    const customCols = document.getElementById('customCols');
    
    const rows = parseInt(customRows.value);
    const cols = parseInt(customCols.value);
    
    if (rows && cols && rows > 0 && rows <= 10 && cols > 0 && cols <= 10) {
        setMatrixSize(rows, cols);
        
        // Clear custom inputs
        customRows.value = '';
        customCols.value = '';
        
        // Remove active from preset buttons
        const sizeBtns = document.querySelectorAll('.size-btn');
        sizeBtns.forEach(btn => btn.classList.remove('active'));
        
        showSuccessMessage('Custom matrix size applied successfully!');
    } else {
        showErrorMessage('Please enter valid dimensions (1-10)');
    }
}

// Create matrix grid
function createMatrixGrid(matrixId, rows, cols) {
    const matrixElement = document.getElementById(matrixId);
    if (!matrixElement) return;
    
    matrixElement.innerHTML = '';
    matrixElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.placeholder = '0';
            input.id = `${matrixId}_${i}_${j}`;
            input.addEventListener('input', handleMatrixInput);
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
            matrixElement.appendChild(input);
        }
    }
}

// Handle matrix input
function handleMatrixInput(event) {
    const input = event.target;
    
    // Add visual feedback
    input.style.transform = 'scale(1.05)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 150);
    
    // Validate input
    if (input.value && isNaN(parseFloat(input.value))) {
        input.style.borderColor = '#dc3545';
        setTimeout(() => {
            input.style.borderColor = '#e9ecef';
        }, 1000);
    }
}

// Handle input focus
function handleInputFocus(event) {
    const input = event.target;
    input.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
    input.style.borderColor = '#667eea';
}

// Handle input blur
function handleInputBlur(event) {
    const input = event.target;
    input.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    input.style.borderColor = '#e9ecef';
}

// Random fill matrix
function randomFillMatrix(matrixName) {
    const matrixElement = document.getElementById(`matrix${matrixName}`);
    if (!matrixElement) return;
    
    const inputs = matrixElement.querySelectorAll('input');
    inputs.forEach(input => {
        const randomValue = Math.floor(Math.random() * 21) - 10; // -10 to 10
        input.value = randomValue;
        
        // Add animation
        input.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        input.style.color = 'white';
        input.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            input.style.background = 'white';
            input.style.color = '#2c3e50';
            input.style.transform = 'scale(1)';
        }, 300);
    });
    
    showSuccessMessage(`Matrix ${matrixName} filled with random values`);
}

// Clear matrix
function clearMatrix(matrixName) {
    const matrixElement = document.getElementById(`matrix${matrixName}`);
    if (!matrixElement) return;
    
    const inputs = matrixElement.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
        
        // Add animation
        input.style.background = '#f8d7da';
        input.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            input.style.background = 'white';
            input.style.transform = 'scale(1)';
        }, 200);
    });
    
    showSuccessMessage(`Matrix ${matrixName} cleared`);
}

// Create determinant matrix
function createDeterminantMatrix() {
    const matrixInputs = document.getElementById('det-matrixInputs');
    if (!matrixInputs) return;
    
    matrixInputs.innerHTML = '';
    
    for (let i = 0; i < 16; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.placeholder = '0';
        input.id = `det_${Math.floor(i/4)}_${i%4}`;
        input.addEventListener('input', handleDeterminantInput);
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        matrixInputs.appendChild(input);
    }
}

// Handle determinant input
function handleDeterminantInput(event) {
    const input = event.target;
    
    // Add visual feedback
    input.style.transform = 'scale(1.05)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 150);
    
    // Validate input
    if (input.value && isNaN(parseFloat(input.value))) {
        input.style.borderColor = '#dc3545';
        setTimeout(() => {
            input.style.borderColor = '#e9ecef';
        }, 1000);
    }
}

// Generate random determinant matrix
function generateRandomDetMatrix() {
    const inputs = document.querySelectorAll('#det-matrixInputs input');
    inputs.forEach(input => {
        const randomValue = Math.floor(Math.random() * 21) - 10; // -10 to 10
        input.value = randomValue;
        
        // Add animation
        input.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        input.style.color = 'white';
        input.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            input.style.background = 'white';
            input.style.color = '#2c3e50';
            input.style.transform = 'scale(1)';
        }, 300);
    });
    
    showSuccessMessage('Random 4×4 matrix generated');
}

// Clear determinant matrix
function clearDetMatrix() {
    const inputs = document.querySelectorAll('#det-matrixInputs input');
    inputs.forEach(input => {
        input.value = '';
        
        // Add animation
        input.style.background = '#f8d7da';
        input.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            input.style.background = 'white';
            input.style.transform = 'scale(1)';
        }, 200);
    });
    
    showSuccessMessage('Matrix cleared');
}

// Show success message
function showSuccessMessage(message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '100px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1001';
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateX(100%)';
    messageDiv.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '100px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1001';
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateX(100%)';
    messageDiv.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Show loading animation
function showLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.classList.add('show');
    }
}

// Hide loading animation
function hideLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.classList.remove('show');
    }
}

// Add smooth scroll behavior
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Add ripple effect to buttons
function addRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Initialize ripple effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', addRippleEffect);
    });
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    background-color: rgba(255, 255, 255, 0.6);
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;
document.head.appendChild(rippleStyle);