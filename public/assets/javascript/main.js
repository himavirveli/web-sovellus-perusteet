let userBudget = 1000; //Starting budget
let carStats = {
    power: 0,
    emissions: 0,
    handling: 0
};
let installedParts = [];

//Available parts are soted in SQLite database and thus not handled in localStorage, this is just for learning purposes


// Update the installed car parts list right after page reload
document.addEventListener('DOMContentLoaded', () => {
    // Load saved parts from localStorage if available
    const savedParts = localStorage.getItem('installedParts');
    if (savedParts) {
        installedParts = JSON.parse(savedParts);  // Load from storage
    } else {
        installedParts = [];  // Initialize as empty
    }
    // Load saved budget from localStorage if available
    const savedBudget = localStorage.getItem('userBudget');
    if (savedBudget) {
        userBudget = parseInt(savedBudget);  // Load from storage
    }

    // Update the UI
    updateInstalledPartsList();  // Update the installed parts UI
    updateUI();  // Update the UI to show correct budget

    // Add event listener for the reset button
    const resetButton = document.getElementById('resetBudgetButton');
    resetButton.addEventListener('click', () => {
        // Reset user budget and installed parts
        userBudget = 1000;  // Reset to default budget
        installedParts = [];  // Clear installed parts

        // Clear from localStorage
        localStorage.removeItem('installedParts');
        localStorage.removeItem('userBudget');

        // Update the UI
        updateInstalledPartsList();
        updateUI();

        console.log("Game reset: budget and installed parts cleared");
    });
});


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

    fetch('/api/parts', {
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
        const partsResponse = await fetch('/api/parts');
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
    // Check if the exact same part is already installed
    const existingPart = installedParts.find(p => p.name === part.name);
    
    if (existingPart) {
        alert(`You already have the ${part.name} part installed. You cannot install the same part twice.`);
        return; // Exit the function, preventing the same part from being installed
    }

    installedParts.push(part);  // Add part to the installed parts array

    // Save updated parts to localStorage
    localStorage.setItem('installedParts', JSON.stringify(installedParts));

    // Save updated budget to localStorage
    localStorage.setItem('userBudget', userBudget);

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

// Function to update the list of installed parts
function updateInstalledPartsList() {
    const installedPartsBody = document.getElementById('installedPartsBody');
    installedPartsBody.innerHTML = '';  // Clear the table body before updating

    if (installedParts.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'No parts installed yet.';
        emptyRow.appendChild(emptyCell);
        installedPartsBody.appendChild(emptyRow);
    } else {
        installedParts.forEach(part => {
            const row = document.createElement('tr');
            
            // Create cells for each part attribute
            const nameCell = document.createElement('td');
            nameCell.textContent = part.name;
            row.appendChild(nameCell);
            
            const powerCell = document.createElement('td');
            powerCell.textContent = part.power;
            row.appendChild(powerCell);
            
            const emissionsCell = document.createElement('td');
            emissionsCell.textContent = part.emissions;
            row.appendChild(emissionsCell);
            
            const handlingCell = document.createElement('td');
            handlingCell.textContent = part.handling;
            row.appendChild(handlingCell);
            
            const priceCell = document.createElement('td');
            priceCell.textContent = `$${part.price}`;
            row.appendChild(priceCell);
            
            // Create an "Uninstall" button cell
            const actionCell = document.createElement('td');
            const uninstallButton = document.createElement('button');
            uninstallButton.textContent = 'Uninstall';
            uninstallButton.classList.add('btn', 'btn-danger');
            uninstallButton.onclick = () => uninstallPart(part.name);
            actionCell.appendChild(uninstallButton);
            row.appendChild(actionCell);

            // Append the row to the table body
            installedPartsBody.appendChild(row);
        });
    }
}


// Uninstall a part from the car
function uninstallPart(partName) {
    // Find the part that is being uninstalled
    const partToRemove = installedParts.find(part => part.name === partName);

    if (partToRemove) {
        // Add the part's price back to the user's budget
        userBudget += partToRemove.price;

        // Remove the part from installed parts
        installedParts = installedParts.filter(part => part.name !== partName);
        
        // Recalculate car specs after removing the part
        updateCarSpecs(); 

        // Update the list of installed parts
        updateInstalledPartsList(); 

        // Update the UI with new values (including the new budget)
        updateUI();

        // Save the updated installedParts and userBudget to localStorage
        localStorage.setItem('installedParts', JSON.stringify(installedParts));
        localStorage.setItem('userBudget', userBudget);

          // Update the UI with new values (including the new budget)
          updateUI();
    }
}



// Function to update the UI
function updateUI() {
    document.getElementById('user-budget').textContent = `Budget: $${userBudget}`;
}


// Load data when the page loads
window.onload = fetchParts;
