// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Accessing the updates list
    const updatesList = document.getElementById('updates');

    // Function to add updates dynamically
    function addUpdate(text) {
        const newItem = document.createElement('li');
        newItem.textContent = text;
        updatesList.appendChild(newItem);
    }

    // Example usage of the function
    addUpdate('Website launched!');

    // You can add more JavaScript functionality as needed
});
