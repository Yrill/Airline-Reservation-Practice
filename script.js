
let seatTaken = [];
let userName = "N/A";
let selectedSeats = [];
let selectedCancelSeats = [];
let selectedOldSeat = null;
let selectedNewSeat = null;
let seatPrices = { 1: 1500, 2: 1500, 3: 1500, 4: 1500, 5: 1500, 6: 2000, 7: 2000, 8: 2000, 9: 2000, 10: 2000 };
let totalPrice = 0;

function showPage(pageId) {
    document.querySelectorAll('div[id$="Seat"], #showTicket').forEach(div => div.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';

    // Hide main menu if not on main menu page
    const mainMenu = document.getElementById('mainMenu');
    mainMenu.style.display = (pageId === 'mainMenu') ? 'block' : 'none';

    if (pageId === 'reserveSeat') renderSeats();
    if (pageId === 'changeSeat') renderChangeSeat();
    if (pageId === 'cancelSeat') renderCancelSeats();
    if (pageId === 'showTicket') renderTicket();
}

function saveUsername() {
    const nameInput = document.getElementById('usernameInput');
    const name = nameInput.value.trim();
    if (name) {
        userName = name;
        nameInput.value = '';
    }
}

function calculateTotalPrice() {
 return seatTaken.reduce((sum, seat) => sum + seatPrices[seat], 0);
}

function renderSeats() {
  document.getElementById('economySeats').innerHTML = renderSeatButtons(1, 5);
  document.getElementById('deluxeSeats').innerHTML = renderSeatButtons(6, 10);
  document.getElementById('totalPrice').textContent = calculateTotalPrice();
}

function renderSeatButtons(start, end) {
  let buttons = '';
  for (let i = start; i <= end; i++) {
    buttons += `<button class="seat ${seatTaken.includes(i) ? 'taken' : ''}" data-seat="${i}" onclick="toggleSeat(${i})" ${seatTaken.includes(i) ? 'disabled' : ''}>${i}</button>`;
  }
  return buttons;
}

function toggleSeat(num) {
  const seatButton = document.querySelector(`button[data-seat="${num}"]`);

  if (selectedSeats.includes(num)) {
    selectedSeats = selectedSeats.filter(seat => seat !== num);
    seatButton.classList.remove('selected');
  } else {
    selectedSeats.push(num);
    seatButton.classList.add('selected');
  }
}

function confirmReservation() {
  seatTaken = Array.from(new Set([...seatTaken, ...selectedSeats])); // Ensures no duplicates
  selectedSeats = [];
  renderSeats();
}

function renderCancelSeats() {
  const cancelSeatsContainer = document.getElementById('cancelSeats');
  if (seatTaken.length === 0) {
    cancelSeatsContainer.innerHTML = '<p>NO APPOINTMENT MADE</p>';
  } else {
    cancelSeatsContainer.innerHTML = seatTaken.map(seat => 
      `<button class="seat ${selectedCancelSeats.includes(seat) ? 'selected' : ''}" 
        onclick="toggleCancelSeat(${seat})">${seat}</button>`
    ).join('');
  }
}

function toggleCancelSeat(seat) {
  if (selectedCancelSeats.includes(seat)) {
    selectedCancelSeats = selectedCancelSeats.filter(s => s !== seat); // Deselect
  } else {
    selectedCancelSeats.push(seat); // Select
  }
  renderCancelSeats();
}

function confirmCancellation() {
  seatTaken = seatTaken.filter(seat => !selectedCancelSeats.includes(seat)); // Remove selected seats
  selectedCancelSeats = []; // Clear selection
  renderSeats(); // Refresh seat layout
  showPage('cancelSeat');
}

function renderTicket() {
  document.getElementById('userName').textContent = userName;
  document.getElementById('economyCount').textContent = seatTaken.filter(seat => seat >= 1 && seat <= 5).length;
  document.getElementById('deluxeCount').textContent = seatTaken.filter(seat => seat >= 6 && seat <= 10).length;
  document.getElementById('seatNumbers').textContent = JSON.stringify(seatTaken);
  document.getElementById('ticketTotalPrice').textContent = calculateTotalPrice();
}

showPage('mainMenu');

function renderChangeSeat() {
  let takenSeats = seatTaken.map(seat => 
    `<button class="seat selected" data-seat="${seat}" onclick="selectOldSeat(${seat})">${seat}</button>`
  ).join('');

  if (seatTaken.length === 0) {
    takenSeats = '<p>NO APPOINTMENT MADE</p>';
  }

  let availableSeats = '';
  let economySeats = '';
  let deluxeSeats = '';

  for (let i = 1; i <= 10; i++) {
    let isTaken = seatTaken.includes(i);
    let seatClass = isTaken ? 'taken' : '';
    let seatType = i <= 5 ? 'economy' : 'deluxe';
    let onClick = isTaken ? '' : `onclick="selectNewSeat(${i})"`;

    let seatButton = `<button class="seat ${seatClass}" data-seat="${i}" ${onClick}>${i}</button>`;
    if (seatType === 'economy') {
      economySeats += seatButton;
    } else {
      deluxeSeats += seatButton;
    }
  }

  availableSeats = seatTaken.length === 10 
    ? '<p>FULLY BOOKED</p>' 
    : `<h3>Economy Seats (Php 1,500)</h3>${economySeats}
      <h3>Deluxe Seats (Php 2,000)</h3>${deluxeSeats}`;

  document.getElementById('takenSeats').innerHTML = takenSeats;
  document.getElementById('availableSeats').innerHTML = availableSeats;
}

function selectOldSeat(seatId) {
  selectedOldSeat = seatId; // Store the selected old seat
  document.querySelectorAll('#takenSeats .seat').forEach(btn => btn.classList.remove('selected'));
  const oldSeat = document.querySelector(`#takenSeats .seat[data-seat="${seatId}"]`);
  if (oldSeat) {
    oldSeat.classList.add('selected');
  } else {
    console.error(`Seat with ID ${seatId} not found.`);
  }
}

function selectNewSeat(seatId) {
  selectedNewSeat = seatId;
  document.querySelectorAll('#availableSeats .seat').forEach(btn => btn.classList.remove('selected'));
  const newSeat = document.querySelector(`#availableSeats .seat[data-seat="${seatId}"]`);
  if (newSeat) {
    newSeat.classList.add('selected');
  }
}

function confirmChange() {
  if (selectedOldSeat && selectedNewSeat && selectedOldSeat !== selectedNewSeat) {
    seatTaken = seatTaken.map(seat => seat === selectedOldSeat ? selectedNewSeat : seat);
    selectedOldSeat = null;
    selectedNewSeat = null;
    renderChangeSeat();
  }
}