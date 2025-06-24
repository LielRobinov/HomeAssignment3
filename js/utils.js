function toggelMenu() {
    const hamburgerBtn = document.querySelector("#hamburgerBtn");
    const icon = hamburgerBtn.querySelector("i");
    const navLinks = document.querySelector(".navLinks");

    navLinks.classList.toggle("show");

    if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
}

document.addEventListener("DOMContentLoaded" , function(){
const signOutBtn = document.getElementById("signOutBtn");
if(signOutBtn){
signOutBtn.addEventListener("click", function() {
removeFromStorage("currentUser");
window.location.href = "login.html";
})
}

})