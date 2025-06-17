//  הוספה/ביטול השכרות, לפי currentUser

document.addEventListener('DOMContentLoaded', function(){
    // קבל את האלמנטים מה-HTML שבהם נציג את ההזמנות
    const pastBookingsContainer = document.getElementById('pastBookingsContainer');
    const upcomingBookingsContainer = document.getElementById('upcomingBookingsContainer');

    // קבל את אלמנטי ההודעות למקרה שאין הזמנות
    const noPastBookingsMessage = document.getElementById('noPastBookingsMessage');
    const noUpcomingBookingsMessage = document.getElementById('noUpcomingBookingsMessage');

    function loadAndDisplayBookings() {
        const currentUserRaw = localStorage.getItem("currentUser");
        if (!currentUserRaw) {
           window.location.href = "login.html";
           return;
        }


        const currentUser = JSON.parse(currentUserRaw);
        const key = `${currentUser.username}_bookings`;
        const allBookings = JSON.parse(localStorage.getItem(key)) || [];
        console.log("Loaded user bookings:", allBookings); //בדיקה


        // נקה קונטיינרים קיימים לפני הוספת הזמנות חדשות
        pastBookingsContainer.innerHTML = '';
        upcomingBookingsContainer.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0); // איפוס זמן להשוואת תאריכים מדויקת לפי יום

        let hasUpcoming = false;
        let hasPast = false;

        // הסתר את הודעות "אין הזמנות" בהתחלה, נציג אותן רק אם אין
        if (noPastBookingsMessage){
            noPastBookingsMessage.style.display = 'none';
        }
        if (noUpcomingBookingsMessage){
            noUpcomingBookingsMessage.style.display = 'none';
        } 
        if (allBookings.length === 0) {
            // אם אין בכלל הזמנות, הצג את הודעות "אין הזמנות" בשני המקומות
            if (noPastBookingsMessage) noPastBookingsMessage.style.display = 'block';
            if (noUpcomingBookingsMessage) noUpcomingBookingsMessage.style.display = 'block';
            return; // סיים את הפונקציה
        }

        // עבר על כל ההזמנות וסווג אותן
        allBookings.forEach(booking => {
            const checkOutDate = new Date(booking.endDate); // תאריך היציאה מהדירה
            
            // יצירת כרטיס הזמנה (div) עבור כל הזמנה
            const bookingCard = document.createElement('div');
            bookingCard.classList.add('booking-card'); // קלאס לעיצוב, אם יש לך CSS עבורו
            bookingCard.innerHTML = `
             <div class="booking-image-container">
                   <img src="${booking.apartmentImageUrl}" alt="${booking.apartmentName}" class="booking-image">
              </div>
               <div class="booking-details">
                <h4>${booking.apartmentName}</h4>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Check-in:</strong> ${booking.startDate}</p>
                <p><strong>Check-out:</strong> ${booking.endDate}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
                <p><strong>Booking Date:</strong> ${booking.bookingDate}</p>
                </div>
            `;

            console.log("Loading image:", booking.apartmentImageUrl);

            // השוואה לתאריך הנוכחי
            if (checkOutDate < today || (checkOutDate.getTime() <= today.getTime())) {
                // הזמנות עבר (תאריך יציאה עבר את היום הנוכחי)
                pastBookingsContainer.appendChild(bookingCard);
                hasPast = true;
            } else {
                // הזמנות עתידיות (תאריך יציאה עדיין לא הגיע או זה היום)
                upcomingBookingsContainer.appendChild(bookingCard);
                hasUpcoming = true;

                //הוספת כפתור ביטול
                if(checkOutDate.getTime() > today.getTime()){
                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancel Booking";
                cancelBtn.classList.add("cancelBtn");
                cancelBtn.addEventListener("click", function(){
                cancelBooking(booking.id);
                })

                bookingCard.querySelector(".booking-details").appendChild(cancelBtn);
                }
            }

            console.log("Today's date (timestamp):", today.getTime());
            console.log("Booking checkout date (timestamp):", checkOutDate.getTime());

        });


        // לאחר סיום הלולאה, בדוק אם היו הזמנות בכל קטגוריה
        if (!hasPast && noPastBookingsMessage) {
            noPastBookingsMessage.style.display = 'block';
        }
        if (!hasUpcoming && noUpcomingBookingsMessage) {
            noUpcomingBookingsMessage.style.display = 'block';
        }
    }

    function cancelBooking(bookingId){
        const currentUserRaw = localStorage.getItem("currentUser");
        if (!currentUserRaw) {
            return;
        }

        const currentUser = JSON.parse(currentUserRaw);
        const key = `${currentUser.username}_bookings`;
        let allBookings = JSON.parse(localStorage.getItem(key)) || [];

        // מחיקת ההזמנה עם `bookingId`
       let updatedBookings = [];
       for (let i = 0; i < allBookings.length; i++) {
        if (allBookings[i].id !== bookingId) {
        updatedBookings.push(allBookings[i]); // מוסיף רק הזמנות שלא תואמות ל־bookingId
        }}

        allBookings = updatedBookings;

        localStorage.setItem(key, JSON.stringify(allBookings));

        loadAndDisplayBookings();
    }

    // קרא וטען את ההזמנות כאשר העמוד נטען
    loadAndDisplayBookings();
});



  
/*
document.addEventListener("DOMContentLoaded", function(){
    let pastList = document.querySelector("#pastList");
    let upcomingList = document.querySelector("#upcomingList");

    function isPastBooking(booking){
        let today = new Date();
        let endDate = new Date(booking.endDate);
        return endDate < today;
    }

    function renderBooking(){
        pastList.innerHTML ="";
        upcomingList.innerHTML = "";

        let pastBookings = [];
        let upcomingBooking = [];

        for (let i =0; i<amsterdam.length; i++)
        {
            if(isPastBooking(amsterdam[i])){
                pastBookings.push(amsterdam[i]);
            }
            else{
                upcomingBooking.push(amsterdam[i]);
            }
        }
    }
    
    for (let i = 0; i <pastBookings.length; i++){
    let div = document.querySelector("#pastList");
    div.innerHTML = "";
    div.innerHTML = 
    `<p> ${pastBookings[i].apartment} </p>` +
    `<p>From: ${pastBookings[i].startDate} To:${pastBookings[i].endDate} </p>` +
    `<p>Status: <span>Past</span> </p>`;
    }

    for (let i = 0; i <upcomingBooking.length; i++){
        let div = document.querySelector("#upcomingList");
        div.innerHTML = "";
        div.innerHTML = 
        `<p> ${upcomingBooking[i].apartment} </p>` +
        `<p>From: ${upcomingBooking[i].startDate} To:${upcomingBooking[i].endDate} </p>` +
        `<p>Status: <span>Upcoming</span> </p>`+
        `<button class="cancelBtn" id="${upcomingBookings[k].id}">Cancel Booking</button>`;
    }
    
      let cancelBtn = document.getElementsByClassName("cancelBtn");
      for (let i = 0; i < cancelBtn.length; i++) {
        cancelBtn[i].addEventListener("click", function(event) {
          let id = parseInt(this.getAttribute("upcomingBookings[k].id"));
          cancelBooking(id);
        });
      }

    function cancelBooking(id) {
    let confirmed = confirm("Are you sure you want to cancel this booking?");
    if (confirmed) {
      let newBookings = [];
      for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].id !== id) {
          newBookings.push(bookings[i]);
        }
      }
      bookings = newBookings;

      renderBookings();
      showPopupMessage("Booking cancelled successfully.");
    }
  }

  renderBookings();
})

*/










// const pastBookingsList = document.getElementById('past-bookings-list');
// const upcomingBookingsList = document.getElementById('upcoming-bookings-list');
// const noPastBookingsMessage = pastBookingsList.querySelector('.no-bookings-message');
// const noUpcomingBookingsMessage = upcomingBookingsList.querySelector('.no-bookings-message');
// const messageElement = document.getElementById('message'); 
// const userInfoElement = document.getElementById('user-info');

// /*   const allListings = typeof listings !== 'undefined' ? listings : [];   */
// let currentUser = null;

// function showGeneralMessage(text, type = 'info') {
//     messageElement.textContent = text;
//     messageElement.className = 'general-message'; // קלאס בסיסי
//     if (type === 'error') { messageElement.classList.add('error-message'); }
//     else if (type === 'success') { messageElement.classList.add('success-message'); }
//     messageElement.style.display = 'block';
// }

// function hideGeneralMessage() {
//     messageElement.style.display = 'none';
//     messageElement.textContent = '';
// }


// function loadBookings() {
//     const bookingsKey = `_bookings${currentUser}`;
//     return JSON.parse(localStorage.getItem(bookingsKey)) || [];
// }

// function saveBookings(bookings) {
//     const bookingsKey = `_bookings${currentUser}`;
//     localStorage.setItem(bookingsKey, JSON.stringify(bookings));
// }

// function handleCancelBooking(bookingId) {
//     let bookings = loadBookings();
//     const initialLength = bookings.length;
//     bookings = bookings.filter(booking => booking.bookingId !== bookingId);

//     if (bookings.length < initialLength) {
//         saveBookings(bookings);
//         displayBookings();
//         showGeneralMessage('Booking cancelled successfully!', 'success');
//     } else {
//         showGeneralMessage('Failed to cancel booking.', 'error');
//     }
// }


// function createBookingCardElement(booking, isUpcoming) {
//     const bookingDiv = document.createElement('div');
//     bookingDiv.classList.add('booking-item');

//     const listing = allListings.find(l => l.listing_id === booking.listingId);
//     const apartmentName = listing ? listing.name : 'Unknown Apartment';
//     const apartmentImage = listing ? listing.picture_url : 'images/placeholder.jpg';

//     // תמונה
//     const imgElement = document.createElement('img');
//     imgElement.src = apartmentImage;
//     imgElement.alt = apartmentName;
//     imgElement.classList.add('booking-image');
//     bookingDiv.appendChild(imgElement);

//     // שם הדירה
//     const titleElement = document.createElement('h3');
//     titleElement.textContent = apartmentName;
//     bookingDiv.appendChild(titleElement);

//     // פרטים בסיסיים (Booking ID, Check-in, Check-out, Total Price)
//     // הוספת פסקאות וספנים מודגשים
//     const details = [
//         { label: 'Booking ID', value: booking.bookingId },
//         { label: 'Check-in', value: booking.checkInDate, className: 'booking-dates' },
//         { label: 'Check-out', value: booking.checkOutDate, className: 'booking-dates' },
//         { label: 'Total Price', value: `$${booking.totalPrice}` }
//     ];

//     details.forEach(detail => {
//         const p = document.createElement('p');
//         if (detail.className) p.classList.add(detail.className);

//         const spanLabel = document.createElement('span');
//         spanLabel.classList.add('label-bold');
//         spanLabel.textContent = detail.label + ': ';
//         p.appendChild(spanLabel);
//         p.appendChild(document.createTextNode(detail.value));
//         bookingDiv.appendChild(p);
//     });

//     // **הוספת כפתור ביטול רק אם זו השכרה עתידית**
//     if (isUpcoming) {
//         const cancelButton = document.createElement('button');
//         cancelButton.textContent = 'Cancel Booking';
//         cancelButton.classList.add('cancel-button');
//         cancelButton.dataset.bookingId = booking.bookingId; // שומר את ה-ID על הכפתור
        
//         cancelButton.addEventListener('click', (event) => {
//             const bookingIdToCancel = event.target.dataset.bookingId;
//             handleCancelBooking(bookingIdToCancel);
//         });
//         bookingDiv.appendChild(cancelButton);
//     }

//     return bookingDiv;
// }


// function displayBookings() {
//     const bookings = loadBookings(); // טען את כל ההזמנות
    
//     // נקה את המקטעים לפני הצגה
//     pastBookingsList.innerHTML = '';
//     upcomingBookingsList.innerHTML = '';

//     let hasPastBookings = false;
//     let hasUpcomingBookings = false;

//     // הצג הודעה כללית אם אין הזמנות בכלל
//     if (bookings.length === 0) {
//         showGeneralMessage("You currently have no apartment bookings.", "info");
//         noPastBookingsMessage.style.display = 'block';
//         noUpcomingBookingsMessage.style.display = 'block';
//         return;
//     } else {
//         hideGeneralMessage(); // הסתר הודעה כללית אם יש הזמנות
//     }

//     const now = new Date(); // תאריך נוכחי להשוואה

//     bookings.forEach(booking => {
//         const checkOutDate = new Date(booking.checkOutDate); // תאריך סיום ההשכרה

//         let isUpcoming = false;
//         if (checkOutDate > now) { // אם תאריך היציאה עתידי, זו השכרה עתידית
//             isUpcoming = true;
//         }

//         // צור את כרטיס ההזמנה ושלח לו אם הוא עתידי (כדי להוסיף כפתור ביטול)
//         const bookingCard = createBookingCardElement(booking, isUpcoming);

//         // הוסף את הכרטיס למקטע המתאים
//         if (isUpcoming) {
//             upcomingBookingsList.appendChild(bookingCard);
//             hasUpcomingBookings = true;
//         } else {
//             pastBookingsList.appendChild(bookingCard);
//             hasPastBookings = true;
//         }
//     });

//     // הצג/הסתר הודעות "אין הזמנות" ספציפיות
//     noPastBookingsMessage.style.display = hasPastBookings ? 'none' : 'block';
//     noUpcomingBookingsMessage.style.display = hasUpcomingBookings ? 'none' : 'block';
// }

// document.addEventListener('DOMContentLoaded', checkLoginStatusAndInit); // קרא לפונקציה הראשונית