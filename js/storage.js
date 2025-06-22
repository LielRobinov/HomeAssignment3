// פונקציות כלליות לעבודה עם localStorage

function saveToStorage(key , value){
    const Stringvalue = JSON.stringify(value);
    localStorage.setItem(key , Stringvalue);
}

function loadFromStorage (key){
    const rawValue = localStorage.getItem(key);
    if (rawValue !== null){
        const parsedValue = JSON.parse(rawValue);
        return parsedValue;
    } 
    else{
        return [];
    }
}

function removeFromStorage(key){
    localStorage.removeItem(key);
}



// function toggelMenu() {
//     const hamburgerBtn = document.querySelector("#hamburgerBtn");
//     const icon = hamburgerBtn.querySelector("i");
//     const navLinks = document.querySelector(".navLinks");

//     navLinks.classList.toggle("show");

//     if (icon.classList.contains("fa-bars")) {
//         icon.classList.remove("fa-bars");
//         icon.classList.add("fa-times");
//     } else {
//         icon.classList.remove("fa-times");
//         icon.classList.add("fa-bars");
//     }
// }

// document.addEventListener("DOMContentLoaded" , function(){
// // יציאה מהחשבון
// const signOutBtn = document.getElementById("signOutBtn");
// if(signOutBtn){
// signOutBtn.addEventListener("click", function() {
// localStorage.removeItem("currentUser");
// window.location.href = "login.html";
// })
// }

// // בדיקה אם המשתמש מחובר
// let currentUser = localStorage.getItem("currentUser");
// let usernameDisplay = document.getElementById("usernameDisplay");

// if (!currentUser) {
//     window.location.href = "login.html";
// } 
// else {
//     currentUser = JSON.parse(currentUser);
//     if (usernameDisplay){
//     usernameDisplay.textContent = `Welcome, ${currentUser.username}`;
//     }
// }

// })


