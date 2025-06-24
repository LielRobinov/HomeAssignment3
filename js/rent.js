//  ניהול תהליך השכרה של דירה אחת

function displayMessage(message, type) {
    const MessageElement = document.getElementById("error-message");
    if (MessageElement) {
        MessageElement.textContent = message;
        MessageElement.classList.remove('message-error', 'message-success', 'hidden'); 

        if (type === 'error') {
            MessageElement.classList.add('message-error');
            MessageElement.style.color = "red";
        } else if (type === 'success') {
            MessageElement.classList.add('message-success');
            MessageElement.style.color = "green";
        }
        MessageElement.classList.remove('hidden'); 

        setTimeout(function(){
            MessageElement.classList.add('hidden');
            MessageElement.textContent = ''; 
        }, 5000);
    } else {
        console.error("Error message element not found with ID 'error-message'.");
        alert(message); 
    }
}
    let apartment = null;

document.addEventListener("DOMContentLoaded", function(){
// בדיקה אם המשתמש מחובר
let currentUser = loadFromStorage("currentUser");
let usernameDisplay = document.getElementById("usernameDisplay");

if (!currentUser.username) {
    window.location.href = "login.html";
    return;
} 
if (usernameDisplay && currentUser.username){
    usernameDisplay.textContent = `Welcome, ${currentUser.username}`;
}

    let listingId = loadFromStorage("selectListing");
    if (!listingId){
    displayMessage("Invalid listing Id.", "error");
    return;
    }

    let amsterdam = window.amsterdam || [];

    for (let i=0; i < amsterdam.length; i++){
        if(String(amsterdam[i].listing_id) === String(listingId)){
            apartment = amsterdam[i];
            break;
        }
    }
    console.log("Apartment data before booking:", apartment);

    if(apartment !== null){
        const listingInfo = document.querySelector("#listing_info");
        listingInfo.innerHTML = "";

       listingInfo.innerHTML = 
       `<img src="${apartment.picture_url}" alt="apartmentImage">` +
       `<h3>${apartment.name}</h3>` +
       `<p><b>Rating:</b> ${apartment.review_scores_rating}</p>` +
       `<p><b>Price per night:</b> ${apartment.price}</p>` +
       `<p><b>Bedrooms:</b> ${apartment.bedrooms}</p>` +
       `<p><b>Beds:</b> ${apartment.beds}</p>` +
       `<p><b>Batrooms:</b> ${apartment.bathrooms_text}</p>` +
       `<p><b>Guests:</b> ${apartment.accommodates}</p>` +
       `<p><b>Neighborhood:</b> ${apartment.neighbourhood_cleansed}</p>`;
    } else{
        displayMessage("Apartment not found." ,"error");
        return;
    }

    let mapContainer = document.getElementById("map");
    if (mapContainer) {
       let map = L.map('map').setView([apartment.latitude, apartment.longitude], 13);
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([apartment.latitude, apartment.longitude]).addTo(map)
        .bindPopup('Location of your apartment')
        .openPopup();
    } 
    else if (mapContainer) {
        console.error("Leaflet (L) library not loaded, cannot initialize map.");}
    else {
   console.error("Map container not found!");}
});

//פונקציה שבודקת חפיפה בין תאריכים
function isDateRangeOverlap(start1, end1, start2, end2) {
  return !(end1 < start2 || start1 > end2);
}

//פונקציה שבודקת זמינות תאריכים
function checkAvailability(listingId, startDate, endDate) {
    let allBookingsKeys = Object.keys(localStorage);
    let filteredKeys = [];

    for (let i=0; i < allBookingsKeys.length; i++)
    {
        if(allBookingsKeys[i].endsWith("_bookings")){
            filteredKeys.push(allBookingsKeys[i]);
        }
    }

    let allBookings = [];
    for(let i =0; i<filteredKeys.length; i++)
    {
        let userBookings = loadFromStorage(filteredKeys[i]);
        for(let j=0; j< userBookings.length; j++){
            if (userBookings[j].listingId === listingId){
                allBookings.push(userBookings[j]);
            }
        }

    }

    
    for (let i=0; i<allBookings.length ; i++){
        if(isDateRangeOverlap(startDate , endDate , allBookings[i].startDate , allBookings[i].endDate))
        {
            return false;
        }
    }
    return true;
}

document.getElementById("booking_form").addEventListener("submit", function(event){
    event.preventDefault();
    let listingId = loadFromStorage("selectListing");
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;
    let currentUser = loadFromStorage("currentUser");

    if (!currentUser) {
    window.location.href = "login.html";
    return;}

    let key =`${currentUser.username}_bookings`;
    let userBookings = loadFromStorage(key);

    if(!startDate || !endDate){
        displayMessage("Please select both check-in and check-out dates.", "error");
        return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj < today || endDateObj < today){
        displayMessage("You cannot book past dates.", "error");
        return;
    }

    if (endDateObj <= startDate){
        displayMessage("Check-out date must be after check-in date.", "error");
        return; 
    }

    if (!checkAvailability(listingId , startDate , endDate)){
        displayMessage("These dates are already booked.","error");
        return;
    }

    let expiryDateValue = document.getElementById("expiry-date").value;
    let expiryDateYear = parseInt(expiryDateValue.split(`/`)[1], 10);
    let expiryDateMonth = parseInt(expiryDateValue.split(`/`)[0], 10);
    const currentyear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (expiryDateYear < currentyear % 100){
        displayMessage("Invalid credit card year, Please enter a valid year.", "error");
        return;
    }

    if(expiryDateYear === (currentyear % 100) && expiryDateMonth < currentMonth){
        displayMessage("Invalid credit card month, Please enter a valid month.", "error");
        return;
    }

    //יצירת הזמנה
    const booking = {
        id: Date.now(), 
        listingId: listingId,
        apartmentName: apartment.name, 
        apartmentImageUrl: apartment.picture_url,
        startDate: startDate,
        endDate: endDate,
        price: `${apartment.price}`, 
        bookingDate: new Date().toISOString().split('T')[0]
    };

    userBookings.push(booking);

    saveToStorage(key, userBookings);

    displayMessage("Booking confirmed! Redirecting to My Bookings." , "success");

    setTimeout(function () {
    window.location.href = "mybookings.html";}, 3000);
})