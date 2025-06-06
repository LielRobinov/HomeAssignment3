// שליפת דירות, סינון, חיפוש

function toggelMenu(){
    const hamburgerBtn = document.querySelector("#hamburgerBtn");
    const icon = hamburgerBtn.querySelector("i");
    const navLinks = document.querySelector(".navLinks");

    navLinks.classList.toggle("show");

    if (icon.classList.contains("fa-bars")){
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    }
    else{
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const signOutBtn = document.getElementById("signOutBtn");
    const filterBtn = document.getElementById("filterBtn");
    const listingsContainer = document.getElementById("listings");

    // בדיקה אם המשתמש מחובר
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
        window.location.href = "login.html";
    } else {
        const currentUser = JSON.parse(currentUserStr);
        usernameDisplay.textContent = `Hello, ${currentUser.username}`;
    }

    // יציאה מהחשבון
    signOutBtn.addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });


    // נתוני הדירות לדוגמה (יש להחליף עם amsterdam.js)
    const apartments = [
        { id: 1, name: "Luxury Apartment", price: 100, rating: 5, rooms: 2, img: "apartment1.jpg" },
        { id: 2, name: "Cozy Studio", price: 50, rating: 4, rooms: 1, img: "apartment2.jpg" }
    ];

    // הצגת הדירות בדף
    function displayListings(filteredListings) {
        listingsContainer.innerHTML = "";
        filteredListings.forEach(apartment => {
            const listing = document.createElement("div");
            listing.classList.add("listing");
            listing.innerHTML = `
                <img src="${apartment.img}" alt="${apartment.name}">
                <h2>${apartment.name}</h2>
                <p>Price: $${apartment.price}</p>
                <p>Rating: ${apartment.rating}</p>
                <p>Rooms: ${apartment.rooms}</p>
                <button class="favoriteBtn">Add to Favorites</button>
                <button class="rentBtn">Rent</button>
            `;
            listingsContainer.appendChild(listing);
        });
    }

    // סינון הדירות לפי המשתמש
    filterBtn.addEventListener("click", () => {
        const minRating = parseInt(document.getElementById("rating").value) || 0;
        const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
        const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
        const rooms = parseInt(document.getElementById("rooms").value) || 1;

        const filtered = apartments.filter(apartment => 
            apartment.rating >= minRating &&
            apartment.price >= minPrice &&
            apartment.price <= maxPrice &&
            apartment.rooms === rooms
        );
        
        displayListings(filtered);
    });

    // הצגה ראשונית של רשימת הדירות
    displayListings(apartments);
});
document.addEventListener("DOMContentLoaded", () => {
    const roomsSelect = document.getElementById("rooms");

    // קביעת טווח החדרים (לדוגמה 1 עד 10)
    const minRooms = 1;
    const maxRooms = 10;

    // יצירת האפשרויות באופן דינמי
    for (let i = minRooms; i <= maxRooms; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i} Room${i > 1 ? 's' : ''}`;
        roomsSelect.appendChild(option);
    }
});

document.addEventListener("DOMContentLoaded" , function(){
    const total = window.amsterdam.length;

    const totalElement = document.createElement("h1");
    totalElement.textContent = `Total apartments in Amsterdam: ${total}`;
    totalElement.classList.add("total-info");


    const main = document.querySelector("main");

    main.insertBefore(totalElement , main.firstChild);
})