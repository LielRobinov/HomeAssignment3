//  ניהול תהליך השכרה של דירה אחת
console.log("rent.js is alive!");
function isDateRangeOverlap(start1, end1, start2, end2) {
  return !(end1 < start2 || start1 > end2);
}

function checkAvailability(listingId, startDate, endDate) {
    const allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];

    for (const booking of allBookings) {
        // בודק רק הזמנות עבור הדירה הספציפית
        if (booking.listingId === listingId) {
            // אם יש חפיפה בתאריכים, הדירה לא זמינה
            if (isDateRangeOverlap(startDate, endDate, booking.checkInDate, booking.checkOutDate)) {
                return false; 
            }
        }
    }
    return true; // הדירה זמינה בתאריכים שנבחרו
}

function saveBookingToLocalStorage(booking) {
    let bookings = JSON.parse(localStorage.getItem('allBookings')) || [];
    
    const exists = bookings.some(b => 
        b.listingId === booking.listingId && 
        b.checkInDate === booking.checkInDate && 
        b.checkOutDate === booking.checkOutDate &&
        b.fullName === booking.fullName
    );

    if (!exists) {
        bookings.push(booking);
        console.log("Saving bookings to localStorage:", bookings);
        localStorage.setItem('allBookings', JSON.stringify(bookings));
    } 
    else {
        console.warn("Attempted to save a duplicate booking:", booking);
    }
}


document.addEventListener("DOMContentLoaded", function(){


 const errorMessageElement = document.getElementById('error-message');
    function displayMessage(message, type) {
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
            errorMessageElement.style.display = 'block';
            if (type === 'error') {
                errorMessageElement.style.color = 'red';
            } else {
                errorMessageElement.style.color = 'green';
            }
            setTimeout(function(){
                errorMessageElement.style.display = 'none';
            }, 5000);
        } else {
            console.error("Error message element not found with ID 'error-message'.");
            alert(message);
        }
    }


function displayMessage(message, type) {
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('message-error', 'message-success', 'hidden'); 

        if (type === 'error') {
            errorMessageElement.classList.add('message-error');
        } else if (type === 'success') {
            errorMessageElement.classList.add('message-success');
        }
        errorMessageElement.classList.remove('hidden'); 

        setTimeout(function(){
            errorMessageElement.classList.add('hidden');
            errorMessageElement.textContent = ''; 
        }, 5000);
    } else {
        console.error("Error message element not found with ID 'error-message'.");
        alert(message); 
    }
}

    let listingId = localStorage.getItem("selectListing"); 
if (!listingId) {
    displayMessage("Invalid listing ID. Using default apartment.", 'error'); 
    listingId = 'LST001'; 
}


let apartment = null;
const amsterdam = window.amsterdam || [];
    if (!Array.isArray(amsterdam) || amsterdam.length === 0) {
        console.error("Amsterdam apartments data not found or is empty! Cannot load apartment details.");
        displayMessage("Error loading apartment details. Please try again later.", 'error');
    }

for(let i=0; i < amsterdam.length; i++)
{
    if(amsterdam[i].listing_id === listingId)
    {
        apartment = amsterdam[i];
        break;
    }
}

 const listingInfo = document.querySelector("#listing_info");
if (apartment !== null && listingInfo)
{
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
}
else{
    displayMessage("apartment not found.");
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
        console.error("Leaflet (L) library not loaded, cannot initialize map.");
        }
else {
   console.error("Map container not found!");
     }
     

    const rentalForm = document.getElementById('booking_form').querySelector('form');
    // console.log("After getting rentalForm element. Is it found?", rentalForm);
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const checkInDateInput = document.getElementById('start-date');
    const checkOutDateInput = document.getElementById('end-date');
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');

    if (rentalForm) {
        rentalForm.addEventListener('submit', function(event){
            event.preventDefault(); 

            // וודא ש-apartment אובייקט הדירה זמין ממה שנטען בתחילת הדף
            if (!apartment) {
                displayMessage("Apartment details not loaded. Cannot confirm booking.", 'error');
                return;
            }

   const fullName = fullNameInput.value;
   const email = emailInput.value;
   const checkInDate = checkInDateInput.value; 
   const checkOutDate = checkOutDateInput.value; 
            
   const today = new Date();
   today.setHours(0, 0, 0, 0); 

   const inDate = new Date(checkInDate);
   const outDate = new Date(checkOutDate);

            if (inDate < today) {
                displayMessage('Check-in date cannot be in the past.', 'error');
                return;
            }

            if (outDate <= inDate) {
                displayMessage('Check-out date must be after check-in date.', 'error');
                return;
            }
            
            if (!checkAvailability(apartment.listing_id, checkInDate, checkOutDate)) {
                displayMessage('This apartment is not available for the selected dates.', 'error');
                return;
            }
 const booking = {
                id: Date.now(), // ID ייחודי לכל הזמנה
                listingId: apartment.listing_id,
                apartmentName: apartment.name,
                apartmentImageUrl: apartment.picture_url,
                email: email, 
                fullName: fullName,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                price: `${apartment.price}`, 
                bookingDate: new Date().toISOString().split('T')[0] // תאריך יצירת ההזמנה בפורמט YYYY-MM-DD
            };

            // שמירת ההזמנה באמצעות הפונקציה החדשה saveBookingToLocalStorage
            console.log("Booking object before saving:", booking);
            saveBookingToLocalStorage(booking);

            // הצגת הודעת הצלחה וניתוב
            displayMessage('Booking confirmed successfully! Redirecting to My Bookings...', 'success');

            // איפוס הטופס
            rentalForm.reset();

            // הפנייה לעמוד My Bookings לאחר השהיה קצרה
            setTimeout(function(){
                window.location.href = 'mybookings.html';
            }, 2000); 
        });
    }

}); 


/*
function checkAvailability(listingId, startDate, endDate) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
      if (key.endsWith('_bookings')) {
        const bookingsString = localStorage.getItem(key);
        let bookings = [];

        try { bookings = JSON.parse(bookingsString);
            if (!Array.isArray(bookings)) {
                    bookings = [];} 
            } 
        catch(e){ 
            console.error("Error parsing bookings from localStorage for key:", key, e);
            continue; 
        } 
            for (const booking of bookings) {
                if (booking.listingId === listingId) {
                    if (isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}   

function saveBooking(currentUser, listingId, startDate, endDate){
    const userBookingsKey = `${currentUser.username}_bookings`;
    const userBookings = JSON.parse(localStorage.getItem(userBookingsKey)) || [];

    const newBooking = {
        listingId: listingId,
        startDate: startDate,
        endDate: endDate
    };

    userBookings.push(newBooking);
localStorage.setItem(userBookingsKey, JSON.stringify(userBookings));
}

*/
    
