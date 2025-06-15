document.addEventListener("DOMContentLoaded", function(){
    const currentUserRaw = localStorage.getItem('currentUser');
    if (!currentUserRaw) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(currentUserRaw);
    const key = `${currentUser.username}_favorites`;
    const favorites = JSON.parse(localStorage.getItem(key)) || [];

    if (!window.amsterdam || !Array.isArray(window.amsterdam)){
        console.error("Missing apartment data");
        return;
    }

    let container = document.querySelector("#favorites-container");
    container.innerHTML="<h1>Favorites</h1>"; 

    if(favorites.length === 0){
        container.innerHTML += "<p>No preferred apartments to display</p>";
        return;
    }

    for (let i=0; i < favorites.length; i++){
        let id = favorites[i];

        let apt = null;
        for (let j = 0; j <amsterdam.length; j++){
            if (String(amsterdam[j].listing_id) === String(id)){
                apt = amsterdam[j];
                break;
            }
        }

        if (apt !== null){
        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML=
        `<img src="${apt.picture_url }" alt="apartmentImage">` +
        `<h3>${apt.name}</h3>` +
        `<p> ${apt.description}</p>` +
        `<button onclick="removeFavorite(${apt.listing_id})">הסר</button>`;

        container.appendChild(card);
       }
    }
})

function removeFavorite(id){
    let currentUserRaw = localStorage.getItem('currentUser');
    if (!currentUserRaw) 
        return;

    let currentUser = JSON.parse(currentUserRaw);
    let key = `${currentUser.username}_favorites`;
    let favorites = JSON.parse(localStorage.getItem(key)) || [];

    let newFavorites = [];
    for (let i =0; i < favorites.length; i++){
        if (String(favorites[i]) !== String(id)) {
            newFavorites.push(favorites[i]);
        }
    }

    localStorage.setItem(key,JSON.stringify(newFavorites));
}




// function updateFavoritesNavLinkStatus() {
//     var favorites = JSON.parse(localStorage.getItem('favorites'));
//     var favoritesLink = document.querySelector('nav ul.navLinks li a[href="favorites.html"]');

//     if (favoritesLink) {
//         if (!favorites || favorites.length === 0) {
//             favoritesLink.classList.add('disabled-link');
//             favoritesLink.style.pointerEvents = 'none';
//             favoritesLink.style.opacity = '0.6';
//         } else {
//             favoritesLink.classList.remove('disabled-link');
//             favoritesLink.style.pointerEvents = 'auto';
//             favoritesLink.style.opacity = '1';
//         }
//     }
// }
// function loadFavorites() {
//     var container = document.getElementById('favorites-container');
//     container.innerHTML = ''; 

//     var favorites = JSON.parse(localStorage.getItem('favorites'));

//     updateFavoritesNavLinkStatus(); 

//     if (!favorites || favorites.length === 0) {
//         container.innerHTML = '<p>עדיין לא הוספת מועדפים.</p>';
//         return; }

//     for (var i = 0; i < favorites.length; i++) {
//         var id = favorites[i]; 

//         for (var j = 0; j < listings.length; j++) { 
//             if (listings[j].id === id) {
//                 var item = listings[j]; 

//                 var card = document.createElement('div');
//                 card.className = 'card';

//                 var img = document.createElement('img');
//                 img.src = item.picture_url;
//                 img.alt = item.name;

//                 var title = document.createElement('h3');
//                 title.textContent = item.name;

//                 var desc = document.createElement('p');
//                 desc.textContent = item.description;

//                 var btn = document.createElement('button');
//                 btn.textContent = 'הסר';
//                 btn.onclick = (function(idToRemove) {
//                     return function() {
//                         removeFavorite(idToRemove); }; })(item.id);

//                 card.appendChild(img);
//                 card.appendChild(title);
//                 card.appendChild(desc);
//                 card.appendChild(btn);

//                 container.appendChild(card);
//                 break;  } }}}

//     function removeFavorite(id) {
//     var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//     var newFavorites = []; 

//     for (var i = 0; i < favorites.length; i++) {
//         if (favorites[i] !== id) {
//             newFavorites.push(favorites[i]);
//         }
//     }

//     localStorage.setItem('favorites', JSON.stringify(newFavorites)); 
//     loadFavorites(); 
//     updateFavoritesNavLinkStatus(); 
// }

// window.addEventListener('load', function() {
//     var currentUser = localStorage.getItem('currentUser'); 
//     if (!currentUser) {
//         window.location.href = 'login.html';
//     } else {
//         if (typeof loadFavorites === 'function') {
//             loadFavorites(); 
//         }
//         updateFavoritesNavLinkStatus(); 
//     }
// });