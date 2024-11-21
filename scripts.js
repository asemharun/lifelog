let currentYear = 2024; // Default year
let peopleLimit = 12; // Initial limit for people data
let placesLimit = 12; // Initial limit for places data

// Global data arrays for people and places
let peopleData = [];
let placesData = [];

// Function to fetch data for the selected year
function fetchDataForYear(year) {
    // Update the year in the dropdown
    document.getElementById('yearDropdown').innerHTML = `${year} <span class="chevron-show-more">&#11167;</span>`;
    
    // Google Sheets API URLs for the selected year
    const peopleUrl = `https://sheets.googleapis.com/v4/spreadsheets/1vud3tHw3S4KdYiGsv5JJGDxdwEISqtYi8TnXMBw3ExA/values/${year}!A4:B105?key=AIzaSyA38L2S7j6e9WokKVlrTnoJUXnmRWhUnTY`;
    const placesUrl = `https://sheets.googleapis.com/v4/spreadsheets/1vud3tHw3S4KdYiGsv5JJGDxdwEISqtYi8TnXMBw3ExA/values/${year}!D4:E171?key=AIzaSyA38L2S7j6e9WokKVlrTnoJUXnmRWhUnTY`;

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
    const years = [2024, 2023, 2022, 2021, 2020, 2019]; // List of available years
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

// Initial fetch for the default year (2024)
fetchDataForYear(currentYear);
updateDropdownMenu(currentYear);
setupShowButtons();
