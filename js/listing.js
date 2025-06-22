
document.addEventListener("DOMContentLoaded", function() {
    // בדיקה אם המשתמש מחובר
    const currentUser = loadFromStorage("currentUser");
    let usernameDisplay = document.getElementById("usernameDisplay");

    if (!currentUser) {
    window.location.href = "login.html";
    return;
    } 
    if (usernameDisplay){
    usernameDisplay.textContent = `Welcome, ${currentUser.username}`;
    }

    if (!window.amsterdam || !Array.isArray(window.amsterdam)) {
        console.error("Amsterdam data not found!");
        return;
    } 
    displayListings(window.amsterdam);
    
    // הצגת הדירות בדף
    function displayListings(listings) {
        const listingsContainer = document.getElementById('listings');

        listingsContainer.innerHTML = "";

        for (let i =0; i < listings.length; i++) {
        let apartment = listings[i];

        let card = document.createElement("div");
        card.className="Card-listings";

        card.innerHTML = 
            `<img src="${apartment.picture_url}" alt="apartmentImage">` +
            `<h3>${apartment.name}</h3>` +
            `<p><b>Id:</b> ${apartment.listing_id}</p>` +
            `<p><b>Description:</b> <br> ${apartment.description}</p>` +
            `<a href="${apartment.listing_url}" target="_blank" class="card_link" >View apartment details</a>` +
            `<button class="favoriteBtn" onclick="addToFavorites('${apartment.listing_id}')">Add to favorites <i class="fa-solid fa-heart"></i></button>` +
            `<button class="rentBtn" onclick="RentClick(${apartment.listing_id})">Rent <i class="fa-solid fa-house"></i></button>`;

            listingsContainer.appendChild(card);
        }    
    }
 displayListings(amsterdam);

    const filterBtn = document.getElementById("filterBtn");
    filterBtn.addEventListener("click" , function(event){
        event.preventDefault();
        
        let minRating = parseFloat(document.getElementById("rating").value.trim());
        if(isNaN(minRating)){
            minRating = 0;
        }
        let minPrice = parseFloat(document.getElementById("minPrice").value.trim());
        if(isNaN(minPrice)){
            minPrice = 0;
        }
        let maxPrice = parseFloat(document.getElementById("maxPrice").value.trim());
        if(isNaN(maxPrice)){
            maxPrice =Infinity;
        }
        let rooms = Number(document.getElementById("rooms").value);
        if (isNaN(rooms)){
            rooms = 1; 
        }

        const filtered = [];

        for (let i = 0; i <amsterdam.length; i++)
        {
            const apartment = amsterdam[i];
            const cleanPrice = parseFloat(apartment.price.replace(/[^0-9.]/g, ""));

            if(parseFloat(apartment.review_scores_rating) >= minRating &&
            cleanPrice >= minPrice && 
            cleanPrice <= maxPrice &&
            Number(apartment.bedrooms) === Number(rooms))
            {
                filtered.push(apartment);
            }
        }
        displayListings(filtered);

        if (filtered.length === 0) {
        document.getElementById("listings").innerHTML = `<p>No apartments match your search criteria.</p>`;
        }

    })


    const roomsSelect = document.getElementById("rooms");
    const minRooms = 1;
    const maxRooms = 10;

    for (let i = minRooms; i <= maxRooms; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        roomsSelect.appendChild(option);
    }

    if (window.amsterdam && Array.isArray(window.amsterdam)) {
        const totalElement = document.createElement("div");
        totalElement.innerHTML = `<i class="fa-solid fa-house-chimney"></i><h3>${window.amsterdam.length} Apartments</h3>`;
        totalElement.classList.add("total-info");

       const section = document.querySelector("section");
       section.insertBefore(totalElement , section.firstChild);
    }
})

function addToFavorites(listing_id){
    const currentUser = loadFromStorage("currentUser");
    if (!currentUser){
    window.location.href = 'login.html';
    return;
    }

    const key = `${currentUser.username}_favorites`;
    let favorites = loadFromStorage(key);

    if (!favorites.includes(listing_id)){
        favorites.push(listing_id);
        saveToStorage(key, favorites);
        alert("Added to favorites!");
    }
    else{
        alert("Already in favorites.");
    }
}

//מעבר לעמוד ההשכרה
function RentClick(listingId){
    saveToStorage("selectListing", listingId);
    window.location.href = "rent.html";
}