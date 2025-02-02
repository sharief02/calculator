const DEFAULT_MAX_WEIGHTS = 40;

// DOM Elements
const countInput = document.getElementById('count');
const warning = document.getElementById('warning');
const weightsContainer = document.getElementById('weights-container');
const addRowButton = document.getElementById('add-row');
const numberResult = document.getElementById('number-result');
const totalWeightResult = document.getElementById('total-weight');
const netWeightResult = document.getElementById('net-weight');
const finalWeightResult = document.getElementById('final-weight');

let countModified = false;

// Initialize default weights
function initializeWeights() {
  for (let i = 1; i <= DEFAULT_MAX_WEIGHTS; i++) {
    addWeightRow(i);
  }
}

// Add a new weight row
function addWeightRow(number) {
  const row = document.createElement('div');
  row.className = 'weight-row';
  row.innerHTML = `
    <span>${number}</span>
    <input type="number" class="weight-input" value="0" min="0">
    <select class="tray-type">
      <option value="2">Double Tray</option>
      <option value="1">Single Tray</option>
    </select>
  `;
  weightsContainer.appendChild(row);

  // Add event listeners for dynamic updates
  row.querySelector('.weight-input').addEventListener('input', updateCalculations);
  row.querySelector('.tray-type').addEventListener('change', updateCalculations);
}

// Add extra row
addRowButton.addEventListener('click', () => {
  const newNumber = weightsContainer.children.length + 1;
  addWeightRow(newNumber);
});

// Update calculations
function updateCalculations() {
  const count = parseInt(countInput.value);
  const weightRows = weightsContainer.querySelectorAll('.weight-row');

  let totalWeight = 0;
  let netWeight = 0;

  weightRows.forEach(row => {
    const weight = parseFloat(row.querySelector('.weight-input').value);
    const trayFactor = parseFloat(row.querySelector('.tray-type').value);

    if (!isNaN(weight) && weight > 0) {
      totalWeight += weight;
      netWeight += trayFactor * 1.8;
    }
  });

  const finalWeight = totalWeight - netWeight;
  const numberValue = isNaN(count) || count <= 0 ? 0 : finalWeight * count;

  // Update results
  totalWeightResult.value = totalWeight.toFixed(2);
  netWeightResult.value = netWeight.toFixed(2);
  finalWeightResult.value = finalWeight.toFixed(2);
  numberResult.value = numberValue.toFixed(2);

  // Show/hide warning
  if (count <= 0 && !countModified) {
    warning.style.display = 'block';
  } else {
    warning.style.display = 'none';
  }
}

// Track count input changes
countInput.addEventListener('input', () => {
  countModified = true;
  updateCalculations();
});

// Initialize
initializeWeights();
updateCalculations();
