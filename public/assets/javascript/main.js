let userBudget = 1000; //Starting budget
let carStats = {
    power: 0,
    emissions: 0,
    handling: 0
};
let installedParts = [];

//Add parts to database

document.getElementById('partForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const partData = {
        category: document.getElementById('category').value,
        name: document.getElementById('name').value,
        price: parseInt(document.getElementById('price').value),
        power: parseInt(document.getElementById('power').value),
        emissions: parseInt(document.getElementById('emissions').value),
        handling: parseInt(document.getElementById('handling').value)
    };

    fetch('http://localhost:3000/api/parts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(partData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Part added successfully!');
        document.getElementById('partForm').reset(); // Reset the form
        fetchParts(); // Refresh the list of parts after adding a new one
    })
    .catch(error => console.error('Error adding part:', error));
});


// Fetch Parts List and create cards for each part
async function fetchParts() {
    try {
        const partsResponse = await fetch('http://localhost:3000/api/parts');
        if (!partsResponse.ok) throw new Error('Failed to fetch parts');
        
        const partsData = await partsResponse.json();
        const partsList = document.getElementById('parts');
        partsList.innerHTML = '';  // Clear the list before adding parts

        partsData.data.forEach(part => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4'; // Each card will take up 1/3rd of the row on medium screens

            // Card structure for each part
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header bg-primary text-white">
                        ${part.name} - ${part.category}
                    </div>
                    <div class="card-body">
                        <p class="card-text">Price: $${part.price}</p>
                        <p class="card-text">Power: ${part.power} HP</p>
                        <p class="card-text">Emissions: ${part.emissions} CO2</p>
                        <p class="card-text">Handling: ${part.handling}</p>
                        <button class="btn btn-success buy-btn" data-price="${part.price}" data-power="${part.power}" data-emissions="${part.emissions}" data-handling="${part.handling}">Buy</button>
                    </div>
                </div>
            `;
            partsList.appendChild(card);
        });

        // Attach event listeners after the parts are added to the DOM
        const buyButtons = document.querySelectorAll('.buy-btn');
        buyButtons.forEach(button => {
            button.addEventListener('click', handleBuy);  // Attach handleBuy to Buy buttons
        });

    } catch (error) {
        console.error('Error fetching parts:', error);
    }
}

// Handle the Buy action when a button is clicked
function handleBuy(event) {
    const cardElement = event.target.closest('.card');  // Select the entire card
    const part = {
        name: cardElement.querySelector('.card-header').textContent.split(' - ')[0], // Get part name from card header
        price: parseInt(event.target.dataset.price),
        power: parseInt(event.target.dataset.power),
        emissions: parseInt(event.target.dataset.emissions),
        handling: parseInt(event.target.dataset.handling)
    };

    // Check if the user has enough budget to buy the part
    if (userBudget >= part.price) {
        userBudget -= part.price; // Subtract price from the budget
        buyPart(part); // Add part to installed parts and update car specs
    } else {
        alert('Not enough budget to buy this part!');
    }
}


// Buying a part adds it to the installedParts-array and updates the car specs.
function buyPart(part) {
    installedParts.push(part);  // Add part to the installed parts array
    updateCarSpecs(); // Recalculate car specs after adding a new part
    updateInstalledPartsList(); // Update the installed parts list
    updateUI(); // Update the UI with new values (budget, car specs)
}

// Recalculate car specs based on installed parts
function updateCarSpecs() {
    let totalPower = 0;
    let totalEmissions = 0;
    let totalHandling = 0;

    installedParts.forEach(part => {
        totalPower += part.power;
        totalEmissions += part.emissions;
        totalHandling += part.handling;
    });

    // Update the car specs in the UI
    document.getElementById('car-power').textContent = totalPower;
    document.getElementById('car-emissions').textContent = totalEmissions;
    document.getElementById('car-handling').textContent = totalHandling;
}

// Update the list of installed parts
function updateInstalledPartsList() {
    const installedPartsList = document.getElementById('installedPartsList');
    installedPartsList.innerHTML = '';  // Clear the list before updating

    if (installedParts.length === 0) {
        installedPartsList.textContent = 'No parts installed yet.';  // Show this if no parts are installed
    } else {
        installedParts.forEach(part => {
            const partElement = document.createElement('li');
            partElement.textContent = `${part.name} (Power: ${part.power}, Emissions: ${part.emissions}, Handling: ${part.handling})`;
            
            // Add an "Uninstall" button next to each part
            const uninstallButton = document.createElement('button');
            uninstallButton.textContent = 'Uninstall';
            uninstallButton.onclick = () => uninstallPart(part.name);
            
            partElement.appendChild(uninstallButton);
            installedPartsList.appendChild(partElement);
        });
    }
}

// Uninstall a part from the car
function uninstallPart(partName) {
    installedParts = installedParts.filter(part => part.name !== partName);
    updateCarSpecs(); // Recalculate car specs after removing the part
    updateInstalledPartsList(); // Update the list of installed parts
    updateUI(); // Update the UI with new values
}

// Function to update the UI
function updateUI() {
    document.getElementById('user-budget').textContent = `Budget: $${userBudget}`;
}


// Load data when the page loads
window.onload = fetchParts;
