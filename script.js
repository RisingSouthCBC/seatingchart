// State management
let seatingData = {
    rows: 5,
    cols: 5,
    seats: {},
    unassigned: []
};

// DOM elements
const nameInput = document.getElementById('name-input');
const addSeatBtn = document.getElementById('add-seat-btn');
const rowsInput = document.getElementById('rows-input');
const colsInput = document.getElementById('cols-input');
const updateGridBtn = document.getElementById('update-grid-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const saveChartBtn = document.getElementById('save-chart-btn');
const loadChartBtn = document.getElementById('load-chart-btn');
const seatingChart = document.getElementById('seating-chart');
const unassignedList = document.getElementById('unassigned-list');

// Initialize
function init() {
    loadFromLocalStorage();
    renderSeatingChart();
    renderUnassignedList();
    attachEventListeners();
}

// Event listeners
function attachEventListeners() {
    addSeatBtn.addEventListener('click', addPerson);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPerson();
    });
    updateGridBtn.addEventListener('click', updateGrid);
    clearAllBtn.addEventListener('click', clearAll);
    saveChartBtn.addEventListener('click', saveChart);
    loadChartBtn.addEventListener('click', loadChart);
}

// Add person
function addPerson() {
    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a name');
        return;
    }
    
    if (seatingData.unassigned.includes(name)) {
        alert('This person is already in the list');
        return;
    }
    
    seatingData.unassigned.push(name);
    nameInput.value = '';
    renderUnassignedList();
    saveToLocalStorage();
    nameInput.focus();
}

// Update grid size
function updateGrid() {
    const newRows = parseInt(rowsInput.value);
    const newCols = parseInt(colsInput.value);
    
    if (newRows < 1 || newCols < 1 || newRows > 20 || newCols > 20) {
        alert('Please enter valid grid dimensions (1-20)');
        return;
    }
    
    // Check if reducing grid size will lose data
    let willLoseData = false;
    for (let key in seatingData.seats) {
        const [row, col] = key.split('-').map(Number);
        if (row >= newRows || col >= newCols) {
            willLoseData = true;
            break;
        }
    }
    
    if (willLoseData) {
        if (!confirm('Reducing grid size will move some people to unassigned. Continue?')) {
            return;
        }
        
        // Move people from removed seats to unassigned
        const newSeats = {};
        for (let key in seatingData.seats) {
            const [row, col] = key.split('-').map(Number);
            if (row < newRows && col < newCols) {
                newSeats[key] = seatingData.seats[key];
            } else {
                seatingData.unassigned.push(seatingData.seats[key]);
            }
        }
        seatingData.seats = newSeats;
    }
    
    seatingData.rows = newRows;
    seatingData.cols = newCols;
    renderSeatingChart();
    renderUnassignedList();
    saveToLocalStorage();
}

// Clear all
function clearAll() {
    if (!confirm('Are you sure you want to clear all seating assignments?')) {
        return;
    }
    
    // Move all seated people to unassigned
    for (let key in seatingData.seats) {
        seatingData.unassigned.push(seatingData.seats[key]);
    }
    seatingData.seats = {};
    
    renderSeatingChart();
    renderUnassignedList();
    saveToLocalStorage();
}

// Save chart
function saveChart() {
    const dataStr = JSON.stringify(seatingData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seating-chart-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Load chart
function loadChart() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                seatingData = data;
                rowsInput.value = data.rows;
                colsInput.value = data.cols;
                renderSeatingChart();
                renderUnassignedList();
                saveToLocalStorage();
                alert('Chart loaded successfully!');
            } catch (error) {
                alert('Error loading chart file');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Render seating chart
function renderSeatingChart() {
    seatingChart.innerHTML = '';
    seatingChart.style.gridTemplateColumns = `repeat(${seatingData.cols}, 1fr)`;
    seatingChart.style.gridTemplateRows = `repeat(${seatingData.rows}, 1fr)`;
    
    for (let row = 0; row < seatingData.rows; row++) {
        for (let col = 0; col < seatingData.cols; col++) {
            const seatKey = `${row}-${col}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.row = row;
            seat.dataset.col = col;
            
            const person = seatingData.seats[seatKey];
            if (person) {
                seat.classList.add('occupied');
                seat.textContent = person;
                seat.draggable = true;
                
                // Drag from seat
                seat.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', person);
                    e.dataTransfer.setData('source', 'seat');
                    e.dataTransfer.setData('sourceKey', seatKey);
                    seat.classList.add('dragging');
                });
                
                seat.addEventListener('dragend', () => {
                    seat.classList.remove('dragging');
                });
                
                // Double-click to remove
                seat.addEventListener('dblclick', () => {
                    seatingData.unassigned.push(person);
                    delete seatingData.seats[seatKey];
                    renderSeatingChart();
                    renderUnassignedList();
                    saveToLocalStorage();
                });
            } else {
                const label = document.createElement('span');
                label.className = 'seat-label';
                label.textContent = `R${row + 1} C${col + 1}`;
                seat.appendChild(label);
            }
            
            // Drop on seat
            seat.addEventListener('dragover', (e) => {
                e.preventDefault();
                seat.classList.add('drag-over');
            });
            
            seat.addEventListener('dragleave', () => {
                seat.classList.remove('drag-over');
            });
            
            seat.addEventListener('drop', (e) => {
                e.preventDefault();
                seat.classList.remove('drag-over');
                
                const person = e.dataTransfer.getData('text/plain');
                const source = e.dataTransfer.getData('source');
                const sourceKey = e.dataTransfer.getData('sourceKey');
                
                // If seat is occupied, swap or reject
                if (seatingData.seats[seatKey]) {
                    if (source === 'seat' && sourceKey !== seatKey) {
                        // Swap seats
                        const temp = seatingData.seats[seatKey];
                        seatingData.seats[seatKey] = person;
                        seatingData.seats[sourceKey] = temp;
                    }
                } else {
                    // Assign to empty seat
                    seatingData.seats[seatKey] = person;
                    
                    if (source === 'unassigned') {
                        seatingData.unassigned = seatingData.unassigned.filter(p => p !== person);
                    } else if (source === 'seat') {
                        delete seatingData.seats[sourceKey];
                    }
                }
                
                renderSeatingChart();
                renderUnassignedList();
                saveToLocalStorage();
            });
            
            seatingChart.appendChild(seat);
        }
    }
}

// Render unassigned list
function renderUnassignedList() {
    unassignedList.innerHTML = '';
    
    if (seatingData.unassigned.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No unassigned people';
        unassignedList.appendChild(emptyMsg);
        return;
    }
    
    seatingData.unassigned.forEach(person => {
        const personEl = document.createElement('div');
        personEl.className = 'person';
        personEl.textContent = person;
        personEl.draggable = true;
        
        personEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', person);
            e.dataTransfer.setData('source', 'unassigned');
            personEl.classList.add('dragging');
        });
        
        personEl.addEventListener('dragend', () => {
            personEl.classList.remove('dragging');
        });
        
        unassignedList.appendChild(personEl);
    });
}

// Local storage
function saveToLocalStorage() {
    localStorage.setItem('seatingChart', JSON.stringify(seatingData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('seatingChart');
    if (saved) {
        try {
            seatingData = JSON.parse(saved);
            rowsInput.value = seatingData.rows;
            colsInput.value = seatingData.cols;
        } catch (error) {
            console.error('Error loading from localStorage', error);
        }
    }
}

// Initialize app
init();
