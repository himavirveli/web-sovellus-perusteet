// --- Initialization ---

// Starting budget and car stats
let userBudget = 1000;
let carStats = {
    power: 0,
    emissions: 0,
    handling: 0
};
let installedParts = [];
let inactivityTimer;  // Inactivity timer variable

// Load saved data and initialize UI on page load
document.addEventListener('DOMContentLoaded', initializeGame);

function initializeGame() {
    loadSavedData();
    updateInstalledPartsList();
    updateUI();
    setupEventListeners();
    fetchParts();  // Ensure this is called to fetch parts on page load
    resetInactivityTimer();
}

// --- Helper Functions for LocalStorage ---
function saveToLocalStorage() {
    localStorage.setItem('installedParts', JSON.stringify(installedParts));
    localStorage.setItem('userBudget', userBudget);
}

function loadSavedData() {
    const savedParts = localStorage.getItem('installedParts');
    const savedBudget = localStorage.getItem('userBudget');
    installedParts = savedParts ? JSON.parse(savedParts) : [];
    userBudget = savedBudget ? parseInt(savedBudget) : 1000;
}

// --- Setup Event Listeners ---
function setupEventListeners() {
    document.getElementById('resetBudgetButton').addEventListener('click', resetGame);
    document.getElementById('partForm').addEventListener('submit', handlePartSubmission);
    document.getElementById('categoryFilter').addEventListener('change', fetchParts);

    // Inactivity timer event listeners
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
}

// --- UI Update Functions ---

function updateUI() {
    document.getElementById('user-budget').textContent = `Budget: $${userBudget}`;
}

function updateCarSpecs() {
    let totalPower = 0, totalEmissions = 0, totalHandling = 0;

    installedParts.forEach(part => {
        totalPower += part.power;
        totalEmissions += part.emissions;
        totalHandling += part.handling;
    });

    document.getElementById('car-power').textContent = totalPower;
    document.getElementById('car-emissions').textContent = totalEmissions;
    document.getElementById('car-handling').textContent = totalHandling;
}

function updateInstalledPartsList() {
    const installedPartsBody = document.getElementById('installedPartsBody');
    installedPartsBody.innerHTML = '';  // Clear the table

    if (installedParts.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="6">No parts installed yet.</td>`;
        installedPartsBody.appendChild(emptyRow);
    } else {
        installedParts.forEach(part => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${part.name}</td>
                <td>${part.power}</td>
                <td>${part.emissions}</td>
                <td>${part.handling}</td>
                <td>$${part.price}</td>
                <td><button class="btn btn-danger" onclick="uninstallPart('${part.name}')">Uninstall</button></td>
            `;
            installedPartsBody.appendChild(row);
        });
    }
}

// --- Game Logic ---

function handleBuy(event) {
    const cardElement = event.target.closest('.card');
    const part = getPartDataFromCard(cardElement);

    if (installedParts.find(p => p.name === part.name)) {
        alert(`You already have the ${part.name} part installed.`);
    } else {
        buyPart(part);
    }
}

function getPartDataFromCard(cardElement) {
    return {
        name: cardElement.querySelector('.card-header').textContent.split(' - ')[0],
        price: parseInt(cardElement.querySelector('.buy-btn').dataset.price),
        power: parseInt(cardElement.querySelector('.buy-btn').dataset.power),
        emissions: parseInt(cardElement.querySelector('.buy-btn').dataset.emissions),
        handling: parseInt(cardElement.querySelector('.buy-btn').dataset.handling)
    };
}

function buyPart(part) {
    if (userBudget < part.price) {
        alert('Not enough budget to buy this part!');
    } else {
        userBudget -= part.price;
        installedParts.push(part);
        saveToLocalStorage();
        updateCarSpecs();
        updateInstalledPartsList();
        updateUI();
        alert(`You bought the ${part.name} part for $${part.price}.`);
    }
}

function uninstallPart(partName) {
    const partToRemove = installedParts.find(part => part.name === partName);
    if (partToRemove) {
        userBudget += partToRemove.price;
        installedParts = installedParts.filter(part => part.name !== partName);
        saveToLocalStorage();
        updateCarSpecs();
        updateInstalledPartsList();
        updateUI();
    }
}

// --- Timer Logic ---

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(resetGameDueToInactivity, 300000);  // 5 minutes inactivity
}

function resetGameDueToInactivity() {
    alert("You've been inactive for 5 minutes. The game will now reset.");
    resetGame();
}

function resetGame() {
    userBudget = 1000;
    installedParts = [];
    saveToLocalStorage();
    updateCarSpecs();
    updateInstalledPartsList();
    updateUI();
    console.log("Game reset: budget and installed parts cleared");
}

// --- Fetch Parts from Server ---

async function fetchParts() {
    try {
        console.log("Fetching parts...");  // Debug log
        const response = await fetch('/api/parts');
        if (!response.ok) throw new Error('Failed to fetch parts');
        const data = await response.json();
        console.log('Fetched Data:', data);  // Log the data to check structure
        displayParts(data);
    } catch (error) {
        console.error('Error fetching parts:', error);
    }
}

function displayParts(partsData) {
    const partsList = document.getElementById('parts');
    partsList.innerHTML = '';  // Clear the list
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filteredParts = selectedCategory === 'all'
        ? partsData.data
        : partsData.data.filter(part => part.category === selectedCategory);

    filteredParts.forEach(part => createPartCard(part, partsList));
}

function createPartCard(part, parentElement) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-header bg-primary text-white">${part.name} - ${part.category}</div>
            <div class="card-body">
                <p class="card-text">Price: $${part.price}</p>
                <p class="card-text">Power: ${part.power} HP</p>
                <p class="card-text">Emissions: ${part.emissions} CO2</p>
                <p class="card-text">Handling: ${part.handling}</p>
                <button class="btn btn-success buy-btn" data-price="${part.price}" data-power="${part.power}" data-emissions="${part.emissions}" data-handling="${part.handling}">Buy</button>
            </div>
        </div>
    `;
    parentElement.appendChild(card);

    // Attach buy event listener to the card
    card.querySelector('.buy-btn').addEventListener('click', handleBuy);
}

// --- Form Submission Logic ---

function handlePartSubmission(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Get the form data
    const form = event.target;
    const name = form.querySelector('[name="name"]').value;
    const price = parseInt(form.querySelector('[name="price"]').value);
    const power = parseInt(form.querySelector('[name="power"]').value);
    const emissions = parseInt(form.querySelector('[name="emissions"]').value);
    const handling = parseInt(form.querySelector('[name="handling"]').value);
    const category = form.querySelector('[name="category"]').value;

    // Create a new part object
    const newPart = {
        name,
        price,
        power,
        emissions,
        handling,
        category
    };

    // Send the new part to the backend (assuming the API endpoint is set up for POST requests)
    fetch('/api/parts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPart)
    })
    .then(response => response.json())
    .then(data => {
        // After successfully adding the part, fetch and display the updated parts list
        console.log('Part added successfully:', data);
        fetchParts();  // Re-fetch and display updated parts
    })
    .catch(error => {
        console.error('Error adding part:', error);
    });

    // Optionally, reset the form fields
    form.reset();
}
