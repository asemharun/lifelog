let currentYear = 2025; // Default year
let peopleLimit = 12; // Initial limit for people data
let placesLimit = 12; // Initial limit for places data

// Global data arrays for people and places
let peopleData = [];
let placesData = [];

// Function to fetch data for the selected year
function fetchDataForYear(year) {
    // Update the year in the dropdown
    document.getElementById('yearDropdown').innerHTML = `${year} <span><i class="bi bi-caret-down-fill"></i>`;
    
    // Google Sheets API URLs for the selected year
    const peopleUrl = `https://sheets.googleapis.com/v4/spreadsheets/1vud3tHw3S4KdYiGsv5JJGDxdwEISqtYi8TnXMBw3ExA/values/${year}!A4:B120?key=AIzaSyA38L2S7j6e9WokKVlrTnoJUXnmRWhUnTY`;
    const placesUrl = `https://sheets.googleapis.com/v4/spreadsheets/1vud3tHw3S4KdYiGsv5JJGDxdwEISqtYi8TnXMBw3ExA/values/${year}!D4:E218?key=AIzaSyA38L2S7j6e9WokKVlrTnoJUXnmRWhUnTY`;

    // Fetch data for people
    fetch(peopleUrl)
        .then(response => response.json())
        .then(data => {
            peopleData = data.values.map(row => ({
                name: row[0],
                amount: parseInt(row[1]) || 0
            }));
            populateTable('peopleData', peopleData, peopleLimit); // Populate People Table
            toggleShowButtons('people');
        })
        .catch(error => console.error(`Error fetching people data for ${year}:`, error));

    // Fetch data for places
    fetch(placesUrl)
        .then(response => response.json())
        .then(data => {
            placesData = data.values.map(row => ({
                place: row[0],
                amount: parseInt(row[1]) || 0
            }));
            populateTable('placesData', placesData, placesLimit); // Populate Places Table
            toggleShowButtons('places');
        })
        .catch(error => console.error(`Error fetching places data for ${year}:`, error));
}

// Function to update dropdown menu dynamically
function updateDropdownMenu(currentYear) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]; // List of available years
    dropdownMenu.innerHTML = ''; // Clear existing dropdown items

    // Generate dropdown items, excluding the current year
    years
        .filter(year => year !== currentYear)
        .forEach(year => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a class="dropdown-item" href="#" data-year="${year}">${year}</a>`;
            dropdownMenu.appendChild(listItem);
        });

    // Reattach event listeners to the new dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            const selectedYear = this.getAttribute('data-year');
            if (selectedYear !== currentYear.toString()) {
                currentYear = parseInt(selectedYear); // Update current year
                fetchDataForYear(currentYear); // Fetch data for the selected year
                updateDropdownMenu(currentYear); // Update dropdown menu
            }
        });
    });
}

// Populate table with data
function populateTable(tableId, data, limit) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ''; // Clear existing data
    const limitedData = data.slice(0, limit); // Limit data to the specified rows
    limitedData.forEach(item => {
        let row = tableBody.insertRow();
        if (tableId === 'peopleData') {
            row.innerHTML = `<td>${item.name}</td><td>${item.amount}</td>`;
        } else if (tableId === 'placesData') {
            row.innerHTML = `<td>${item.place}</td><td>${item.amount}</td>`;
        }
    });

    // Add click listeners
    if (tableId === 'peopleData') {
        setupNameClickListeners();
    } else if (tableId === 'placesData') {
        setupPlaceClickListeners();
    }
}

// Setup show more/less button functionality
function setupShowButtons() {
    document.getElementById('showMorePeople').addEventListener('click', function() {
        peopleLimit += 5;
        populateTable('peopleData', peopleData, peopleLimit);
        toggleShowButtons('people');
    });

    document.getElementById('showLessPeople').addEventListener('click', function() {
        peopleLimit -= 5;
        populateTable('peopleData', peopleData, peopleLimit);
        toggleShowButtons('people');
    });

    document.getElementById('showMorePlaces').addEventListener('click', function() {
        placesLimit += 5;
        populateTable('placesData', placesData, placesLimit);
        toggleShowButtons('places');
    });

    document.getElementById('showLessPlaces').addEventListener('click', function() {
        placesLimit -= 5;
        populateTable('placesData', placesData, placesLimit);
        toggleShowButtons('places');
    });
}

// Toggle the visibility of show more/less buttons
function toggleShowButtons(section) {
    if (section === 'people') {
        const moreButton = document.getElementById('showMorePeople');
        const lessButton = document.getElementById('showLessPeople');
        moreButton.style.display = peopleLimit < peopleData.length ? 'inline-block' : 'none';
        lessButton.style.display = peopleLimit > 12 ? 'inline-block' : 'none';
    } else if (section === 'places') {
        const moreButton = document.getElementById('showMorePlaces');
        const lessButton = document.getElementById('showLessPlaces');
        moreButton.style.display = placesLimit < placesData.length ? 'inline-block' : 'none';
        lessButton.style.display = placesLimit > 12 ? 'inline-block' : 'none';
    }
}

// Setup click listeners for names
function setupNameClickListeners() {
    document.querySelectorAll('#peopleData tbody tr td:first-child').forEach(cell => {
        cell.addEventListener('click', function () {
            const name = this.textContent;
            showDetailedView(name);
        });
    });
}

// Show detailed view for a person
function showDetailedView(name) {
    // Hide main tables
    document.getElementById('mainTables').classList.add('d-none');

    // Show detailed view
    const detailedView = document.getElementById('detailedView');
    detailedView.classList.remove('d-none');

    // Set the person's name in the table header
    document.getElementById('personNameHeader').textContent = name;

    // Fetch detailed data for the person
    fetchPersonData(name);
}

// Fetch data for the person across all years
function fetchPersonData(name) {
    const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]; // Add more years as needed
    const detailedTableBody = document.querySelector('#detailedTable tbody');
    detailedTableBody.innerHTML = ''; // Clear previous data

    let personData = [];

    const fetchPromises = years.map(year => {
        const peopleUrl = `https://sheets.googleapis.com/v4/spreadsheets/1vud3tHw3S4KdYiGsv5JJGDxdwEISqtYi8TnXMBw3ExA/values/${year}!A4:B120?key=AIzaSyA38L2S7j6e9WokKVlrTnoJUXnmRWhUnTY`;

        return fetch(peopleUrl)
            .then(response => response.json())
            .then(data => {
                const row = data.values.find(row => row[0] === name);
                if (row) {
                    personData.push({ year, amount: parseInt(row[1]) || 0 });
                }
            });
    });

    Promise.all(fetchPromises).then(() => {
        // Sort data by year descending
        personData.sort((a, b) => b.year - a.year);

        // Populate the detailed table
        personData.forEach(item => {
            const row = detailedTableBody.insertRow();
            row.innerHTML = `<td>${item.year}</td><td>${item.amount}</td>`;
        });
    });
}

// Return to main view
document.getElementById('returnButton').addEventListener('click', function () {
    // Hide detailed view
    document.getElementById('detailedView').classList.add('d-none');

    // Show main tables
    document.getElementById('mainTables').classList.remove('d-none');
});



// Setup click listeners for places
function setupPlaceClickListeners() {
    document.querySelectorAll('#placesData tbody tr td:first-child').forEach(cell => {
        cell.addEventListener('click', function () {
            const placeName = this.textContent;
            showPlacesDetailedView(placeName);
        });
    });
}

// Show detailed view for a place
function showPlacesDetailedView(placeName) {
    // Hide main tables
    document.getElementById('mainTables').classList.add('d-none');

    // Show detailed view for Places
    const placesDetailedView = document.getElementById('placesDetailedView');
    placesDetailedView.classList.remove('d-none');

    // Set the place name in the table header
    document.getElementById('placeNameHeader').textContent = placeName;

    // Fetch detailed data for the place
    fetchPlaceData(placeName);
}

// Fetch data for the place across all years
function fetchPlaceData(placeName) {
    const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]; // Available years
    const placesTableBody = document.querySelector('#placesDetailedTable tbody');
    placesTableBody.innerHTML = ''; // Clear previous data

    let placeDataArray = []; // Store place data to sort later

    years.forEach(year => {
        const placesUrl = `https://sheets.googleapis.com/v4/spreadsheets/1vud3tHw3S4KdYiGsv5JJGDxdwEISqtYi8TnXMBw3ExA/values/${year}!D4:E171?key=AIzaSyA38L2S7j6e9WokKVlrTnoJUXnmRWhUnTY`;

        fetch(placesUrl)
        .then(response => response.json())
        .then(data => {
            const placeData = data.values.find(row => row[0] === placeName);

            if (placeData) {
                placeDataArray.push({ year: year, amount: placeData[1] });

                // Sort data so latest year appears first
                placeDataArray.sort((a, b) => b.year - a.year);

                // Clear and re-populate the table
                placesTableBody.innerHTML = '';
                placeDataArray.forEach((item, index) => {
                    let row = placesTableBody.insertRow();
                    row.innerHTML = `<td>${item.year}</td><td>${item.amount}</td>`;
                });
            }
        })
        .catch(error => console.error(`Error fetching data for ${year}:`, error));
});
}

// Return to main view (Places)
document.getElementById('returnToLifelogPlaces').addEventListener('click', function () {
    // Hide Places Detailed View
    document.getElementById('placesDetailedView').classList.add('d-none');

    // Show main tables
    document.getElementById('mainTables').classList.remove('d-none');
});




// Initial fetch for the default year (2024)
fetchDataForYear(currentYear);
updateDropdownMenu(currentYear);
setupShowButtons();

