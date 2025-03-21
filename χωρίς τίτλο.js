let rooms = [];
let chart;

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

function addRoom() {
  const roomName = document.getElementById('roomName').value.trim();
  const type = document.getElementById('constructionType').value;
  const height = parseFloat(document.getElementById('heightInput').value) || 0;
  const length = parseFloat(document.getElementById('lengthInput').value) || 0;
  const doorsArea = parseFloat(document.getElementById('doorsArea').value) || 0;
  const windowsArea = parseFloat(document.getElementById('windowsArea').value) || 0;
  const netArea = (height * length) - doorsArea - windowsArea;

  if (!roomName || netArea <= 0) {
    alert("Συμπλήρωσε σωστά τα στοιχεία του χώρου!");
    return;
  }

  rooms.push({ roomName, type, netArea });
  updateRoomsList();
}

function updateRoomsList() {
  const list = document.getElementById('roomsList');
  list.innerHTML = rooms.map((r, i) => `<div>${i + 1}. ${r.roomName} (${r.type}): ${r.netArea.toFixed(2)} m²</div>`).join('');
}

function saveClientData() {
  const clientName = document.getElementById('clientName').value.trim();
  if (!clientName) return alert("Συμπλήρωσε το όνομα πελάτη!");
  localStorage.setItem('client_' + clientName, JSON.stringify(rooms));
  alert('Ο πελάτης αποθηκεύτηκε.');
}

function calculate() {
  const boardLength = parseFloat(document.getElementById('boardLength').value);
  const studSpacing = parseFloat(document.getElementById('studSpacing').value);
  const structureType = document.getElementById('structureType').value;

  const gypsumWaste = parseFloat(document.getElementById('gypsumWaste').value) / 100;
  const cWaste = parseFloat(document.getElementById('cWaste').value) / 100;
  const uWaste = parseFloat(document.getElementById('uWaste').value) / 100;
  const cornerWaste = parseFloat(document.getElementById('cornerWaste').value) / 100;
  const insulationWaste = parseFloat(document.getElementById('insulationWaste').value) / 100;

  const prices = {
    gypsum: parseFloat(document.getElementById('gypsumPrice').value),
    c: parseFloat(document.getElementById('cPrice').value),
    u: parseFloat(document.getElementById('uPrice').value),
    corner: parseFloat(document.getElementById('cornerPrice').value),
    insulation: parseFloat(document.getElementById('insulationPrice').value),
    screws: parseFloat(document.getElementById('screwsBoxPrice').value),
    tape: parseFloat(document.getElementById('tapePrice').value),
    putty: parseFloat(document.getElementById('puttyPrice').value),
    hanger: parseFloat(document.getElementById('hangerPrice').value)
  };

  let totalArea = rooms.reduce((sum, r) => sum + r.netArea, 0);

  let skeletonFactor = 1;
  if (structureType === 'double') skeletonFactor = 1.5;
  if (structureType === 'heavy') skeletonFactor = 2;

  let gypsumBoards = (totalArea / (1.2 * boardLength)) * (1 + gypsumWaste);
  let cProfiles = (totalArea / boardLength) * (1 / studSpacing) * boardLength * skeletonFactor * (1 + cWaste);
  let uProfiles = (totalArea / boardLength) * 2 * boardLength * (1 + uWaste);
  let cornerBeads = totalArea * 0.8 * (1 + cornerWaste);
  let insulation = totalArea * (1 + insulationWaste);
  let screws = totalArea * 25 * skeletonFactor;
  let tapeRolls = (totalArea * 1.2) / 90;
  let puttySacks = (totalArea * 0.35) / 28;
  let hangers = rooms.filter(r => r.type === 'ceiling').reduce((sum, r) => sum + (r.netArea * 0.8), 0);

  let materialsCost =
    gypsumBoards * prices.gypsum +
    cProfiles * prices.c +
    uProfiles * prices.u +
    cornerBeads * prices.corner +
    insulation * prices.insulation +
    (screws / 1000) * prices.screws +
    tapeRolls * prices.tape +
    puttySacks * prices.putty +
    hangers * prices.hanger;

  const labour = totalArea * parseFloat(document.getElementById('labourCost').value);
  const subtotal = materialsCost + labour;
  const profit = subtotal * (parseFloat(document.getElementById('profitMargin').value) / 100);
  const vat = (subtotal + profit) * (parseFloat(document.getElementById('vatRate').value) / 100);
  const total = subtotal + profit + vat;

  document.getElementById('results').textContent = `
Συνολικό Εμβαδόν: ${totalArea.toFixed(2)} m²
Γυψοσανίδες: ${gypsumBoards.toFixed(2)} τεμ
Προφίλ C: ${cProfiles.toFixed(2)} m
Προφίλ U: ${uProfiles.toFixed(2)} m
Γωνιόκρανα: ${cornerBeads.toFixed(2)} m
Μονωτικό: ${insulation.toFixed(2)} m²
Βίδες: ${screws.toFixed(0)} τμχ
Ταινία: ${tapeRolls.toFixed(2)} ρολά
Στόκος: ${puttySacks.toFixed(2)} σακιά
Αναρτήσεις: ${hangers.toFixed(0)} τεμ

Κόστος Υλικών: ${materialsCost.toFixed(2)} €
Εργατικά: ${labour.toFixed(2)} €
Κέρδος: ${profit.toFixed(2)} €
ΦΠΑ: ${vat.toFixed(2)} €
Συνολικό Κόστος: ${total.toFixed(2)} €
`;

  drawChart(materialsCost, labour, profit, vat);
}

function drawChart(materials, labour, profit, vat) {
  const ctx = document.getElementById('costChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Υλικά', 'Εργατικά', 'Κέρδος', 'ΦΠΑ'],
      datasets: [{
        data: [materials, labour, profit, vat],
        backgroundColor: ['#d4af37', '#333', '#888', '#555']
      }]
    },
    options: { responsive: true }
  });
}

function exportTxt() {
  const blob = new Blob([document.getElementById('results').textContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Υπολογισμός_Γυψοσανίδας.txt';
  link.click();
}

function exportCsv() {
  const csv = document.getElementById('results').textContent.replace(/\n/g, ',');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Υπολογισμός_Γυψοσανίδας.csv';
  link.click();
}

function exportPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const content = document.getElementById('results').textContent;
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);
  doc.save('Υπολογισμός_Γυψοσανίδας.pdf');
}

function printResults() {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<pre>' + document.getElementById('results').textContent + '</pre>');
  printWindow.document.close();
  printWindow.print();
}

function clearAll() {
  rooms = [];
  document.getElementById('roomsList').innerHTML = '';
  document.getElementById('results').textContent = '';
}