const DEFAULT_MAX_WEIGHTS = 40;
let countModified = false;

// DOM Elements
const tankNameInput = document.getElementById('tank-name');
const countInput = document.getElementById('count');
const warning = document.getElementById('warning');
const weightsContainer = document.getElementById('weights-container');
const addRowButton = document.getElementById('add-row');
const numberResult = document.getElementById('number-result');
const totalWeightResult = document.getElementById('total-weight');
const netWeightResult = document.getElementById('net-weight');
const finalWeightResult = document.getElementById('final-weight');
const printBtn = document.getElementById('print-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');
const whatsappModal = document.getElementById('whatsapp-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalContent = document.getElementById('modal-content');
const sendWhatsappBtn = document.getElementById('send-whatsapp');

// Initialize default weight rows
function initializeWeights() {
  for (let i = 0; i < DEFAULT_MAX_WEIGHTS; i++) {
    addWeightRow();
  }
}

// Add a new weight row (with delete button)
function addWeightRow() {
  const row = document.createElement('div');
  row.className = 'weight-row';
  // Mark the row as not filled initially
  row.setAttribute('data-filled', 'false');
  row.innerHTML = `
    <span>${weightsContainer.children.length + 1}</span>
    <input type="number" class="weight-input" value="0" min="0" step="0.1">
    <select class="tray-type">
      <option value="2">Double Tray</option>
      <option value="1">Single Tray</option>
    </select>
    <button class="delete-btn">×</button>
  `;
  weightsContainer.appendChild(row);
  // Add listeners for dynamic updates
  row.querySelector('.weight-input').addEventListener('input', () => {
    updateCalculations();
    updateRowDataFilled(row);
  });
  row.querySelector('.tray-type').addEventListener('change', updateCalculations);
  row.querySelector('.delete-btn').addEventListener('click', () => {
    row.remove();
    updateRowNumbers();
    updateCalculations();
  });
}

// Update row numbers after deletion
function updateRowNumbers() {
  Array.from(weightsContainer.children).forEach((row, index) => {
    row.querySelector('span').textContent = index + 1;
  });
}

// Update data-filled attribute based on weight value
function updateRowDataFilled(row) {
  const weightInput = row.querySelector('.weight-input');
  const weight = parseFloat(weightInput.value);
  row.setAttribute('data-filled', (!isNaN(weight) && weight > 0) ? 'true' : 'false');
}

// Recalculate totals and update result fields
function updateCalculations() {
  const count = parseInt(countInput.value);
  const weightRows = weightsContainer.querySelectorAll('.weight-row');
  let totalWeight = 0;
  let totalTrays = 0;
  weightRows.forEach(row => {
    const weightInput = row.querySelector('.weight-input');
    const trayFactor = parseFloat(row.querySelector('.tray-type').value);
    const weight = parseFloat(weightInput.value);
    updateRowDataFilled(row);
    if (!isNaN(weight) && weight > 0) {
      totalWeight += weight;
      totalTrays += trayFactor;
      weightInput.classList.remove('invalid');
    } else {
      weightInput.classList.add('invalid');
    }
  });
  const netWeight = totalTrays * 1.8;
  const finalWeight = totalWeight - netWeight;
  const numberValue = (isNaN(count) || count <= 0) ? 0 : finalWeight * count;
  totalWeightResult.value = totalWeight.toFixed(2);
  netWeightResult.value = netWeight.toFixed(2);
  finalWeightResult.value = finalWeight.toFixed(2);
  numberResult.value = numberValue.toFixed(2);
  warning.style.display = (count <= 0 && !countModified) ? 'block' : 'none';
}

addRowButton.addEventListener('click', () => {
  addWeightRow();
  updateCalculations();
});
countInput.addEventListener('input', () => {
  countModified = true;
  updateCalculations();
});

// Print functionality: open browser print dialog
printBtn.addEventListener('click', () => {
  window.print();
});

// WhatsApp sharing modal functionality
whatsappBtn.addEventListener('click', () => {
  // Prepare formatted report with icons/emojis and only filled details
  const tankName = tankNameInput.value || 'N/A';
  const harvestCount = countInput.value || '0';
  const totalWeight = totalWeightResult.value;
  const netWeight = netWeightResult.value;
  const finalWeight = finalWeightResult.value;
  const totalNumber = numberResult.value;
  let report = "🐟 *Aquaculture Harvest Report* 🐟\n";
  report += `🏷️ Tank Name: ${tankName}\n`;
  report += `🔢 Harvest Count: ${harvestCount}\n`;
  report += `⚖️ Total Weight: ${totalWeight} kg\n`;
  report += `📏 Net Weight: ${netWeight} kg\n`;
  report += `📊 Final Weight: ${finalWeight} kg\n`;
  report += `🔢 Total Number: ${totalNumber}\n\n`;
  report += "📋 *Batch Details:*\n";
  const weightRows = weightsContainer.querySelectorAll('.weight-row');
  weightRows.forEach((row, index) => {
    const weight = parseFloat(row.querySelector('.weight-input').value);
    if (!isNaN(weight) && weight > 0) {
      const trayType = row.querySelector('.tray-type').selectedOptions[0].text;
      report += `${index + 1}. ${weight} kg (${trayType})\n`;
    }
  });
  modalContent.textContent = report;
  whatsappModal.style.display = 'flex';
});
closeModalBtn.addEventListener('click', () => {
  whatsappModal.style.display = 'none';
});
sendWhatsappBtn.addEventListener('click', () => {
  const report = modalContent.textContent;
  // Use the wa.me endpoint for WhatsApp sharing (for both desktop and mobile)
  const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(report);
  window.open(whatsappUrl, '_blank');
});

// Initialize the calculator
initializeWeights();
updateCalculations();
