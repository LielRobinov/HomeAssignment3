//  הוספה/ביטול השכרות, לפי currentUser

document.addEventListener('DOMContentLoaded', function(){
    
    const pastBookingsContainer = document.getElementById('pastBookingsContainer');
    const upcomingBookingsContainer = document.getElementById('upcomingBookingsContainer');

    function loadAndDisplayBookings() {
        const currentUserRaw = localStorage.getItem("currentUser");
        if (!currentUserRaw) {
           window.location.href = "login.html";
           return;
        }

        const currentUser = JSON.parse(currentUserRaw);
        const key = `${currentUser.username}_bookings`;
        const allBookings = JSON.parse(localStorage.getItem(key)) || [];
        console.log("Loaded user bookings:", allBookings);

        pastBookingsContainer.innerHTML = '';
        upcomingBookingsContainer.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        let hasUpcoming = false;
        let hasPast = false;

        //הודעות במקרה שאין הזמנות כלל
        if (allBookings.length === 0) {
        const noPastMessage = document.createElement("p");
        noPastMessage.textContent = "You have no past bookings.";
        noPastMessage.classList.add("noBookingsMessage");
        pastBookingsContainer.appendChild(noPastMessage);

        const noUpcomingMessage = document.createElement("p");
        noUpcomingMessage.textContent = "You have no upcoming bookings.";
        noUpcomingMessage.classList.add("noBookingsMessage");
        upcomingBookingsContainer.appendChild(noUpcomingMessage);

        return; 
        }

        // עבר על כל ההזמנות וסווג אותן
        allBookings.forEach(booking => {
            const checkOutDate = new Date(booking.endDate);
            checkOutDate.setHours(0, 0, 0, 0);
            const checkInDate = new Date(booking.startDate); 
            checkInDate.setHours(0, 0, 0, 0);
            
            const bookingCard = document.createElement('div');
            bookingCard.classList.add('booking-card');
            bookingCard.innerHTML = `
             <div class="booking-image-container">
                   <img src="${booking.apartmentImageUrl}" alt="${booking.apartmentName}" class="booking-image">
              </div>
               <div class="booking-details">
                <h4>${booking.apartmentName}</h4>
                <p><b>Booking ID:</b> ${booking.id}</p>
                <p><b>Check-in:</b> ${booking.startDate}</p>
                <p><b>Check-out:</b> ${booking.endDate}</p>
                <p><b>Price:</b> ${booking.price}</p>
                <p><b>Booking Date:</b> ${booking.bookingDate}</p>
                </div>
            `;

            console.log("Loading image:", booking.apartmentImageUrl);

            if (checkInDate.getTime() <= today.getTime()) {
                pastBookingsContainer.appendChild(bookingCard);
                hasPast = true;
            }
            else 
            {
                upcomingBookingsContainer.appendChild(bookingCard);
                hasUpcoming = true;

                if(checkOutDate.getTime() >= today.getTime()){
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

        })

        // בדיקה אם היו הזמנות בכל קטגוריה
        if (!hasPast) {
           const noPastMessage = document.createElement("p");
           noPastMessage.textContent = "You have no past bookings.";
           noPastMessage.classList.add("noBookingsMessage");
           pastBookingsContainer.appendChild(noPastMessage)
        }
        if (!hasUpcoming) {
            const noUpcomingMessage = document.createElement("p");
            noUpcomingMessage.textContent = "You have no upcoming bookings.";
            noUpcomingMessage.classList.add("noBookingsMessage");
            upcomingBookingsContainer.appendChild(noUpcomingMessage);
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

       let updatedBookings = [];
       for (let i = 0; i < allBookings.length; i++) {
        if (allBookings[i].id !== bookingId) {
        updatedBookings.push(allBookings[i]); 
        }}

        allBookings = updatedBookings;

        localStorage.setItem(key, JSON.stringify(allBookings));

        loadAndDisplayBookings();
    }

    loadAndDisplayBookings();
});
