document.addEventListener("DOMContentLoaded", function(){
    const currentUserRaw = localStorage.getItem('currentUser');
    if (!currentUserRaw) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(currentUserRaw);
    const key = `${currentUser.username}_favorites`;
    const favorites = JSON.parse(localStorage.getItem(key)) || [];

    let container = document.querySelector("#favorites-container");

    if (!window.amsterdam || !Array.isArray(window.amsterdam)){
        container.innerHTML += `<p class="noFavoriteMessage">Error: please try again later.</p>`
        return;
    }

    container.innerHTML = `<h1>My Favorite Apartments</h1>`;

    if(favorites.length === 0){
        container.innerHTML += `<p class="noFavoriteMessage">No preferred apartments to display</p>`;
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
        `<p>Neighbourhood: ${apt.neighbourhood}</p>` +
        `<p>Price: ${apt.price}</p>` +
        `<p>Rating: ${apt.review_scores_rating}</p>` +
        `<button onclick="removeFavorite(${apt.listing_id})">Remove</button>`;

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
    location.reload();
}

