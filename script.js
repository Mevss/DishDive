let currentCardFav;

document.addEventListener('DOMContentLoaded', () => {
    initializeCardData();

    const filterButtons = document.querySelectorAll(".filter-buttons button");
    filterButtons.forEach(button => button.addEventListener("click", filterCards));

    if (document.location.pathname.includes('favourites.html')) {
        displayFavouriteCards();
        displayMostLikedCard();

        const favouritesContainer = document.querySelector('.favourite-food-cards');
        if (favouritesContainer) {
            favouritesContainer.addEventListener('click', function(event) {
                let card = event.target.closest('.card');
                if (!card) return;

                toggleFavouriteCard(card);
                card.remove();
            });
        }
    }

    const filterToggle = document.getElementById("filter-toggle");
    const filterButtonsContainer = document.querySelector(".filter-buttons");

    if (filterToggle) {
        filterToggle.addEventListener("click", function () {
            filterButtonsContainer.classList.toggle("open");
        });
    }

    const foodCardsContainer = document.querySelector('.food-cards');
    if (foodCardsContainer) {
        foodCardsContainer.addEventListener('click', function(event) {
            let card = event.target.closest('.card');
            if (!card) return;

            const imageSrc = card.querySelector('img').src;
            const id = card.id;
            const details = detailedDescriptions[id] || {
                title: card.querySelector('.card-title').textContent,
                description: card.querySelector('.card-text').textContent
            };
            const likes = parseInt(card.dataset.likes, 10);

            currentCardFav = card;
            openPopup(imageSrc, details.title, details.description, likes, card);
        });
    }

    const likeButton = document.getElementById('like-button');
    const favouriteButton = document.getElementById('favourite-button');
    
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            if (currentCard) {
                updateLikes(currentCard);
            }
        });
    }

    if (favouriteButton) {
        favouriteButton.addEventListener('click', () => {
            if (currentCardFav) {
                toggleFavouriteCard(currentCardFav);
            }
        });
    }

    if (document.location.pathname.includes('favourites.html')) {
        displayMostLikedCard();
    }
});

const filterCards = (e) => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");

    const filterableCards = document.querySelectorAll(".food-cards .card");
    filterableCards.forEach(card => {
        card.classList.add("hide");
        if (card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all") {
            card.classList.remove("hide");
        }
    });
};

function initializeCardData() {
    let existingCards = JSON.parse(localStorage.getItem('foodCards')) || [];

    const preExistingCards = [
        { id: 'card1', title: "Burger", description: "Burger z chrupiącymi frytkami!", imageSrc: 'images/image-2.jpg', category: 'meat', likes: 0 }, 
        { id: 'card2', title: "Tost", description: "Tosty z serem!", imageSrc: 'images/image-1.jpg', category: 'vegan', likes: 0 },
        { id: 'card3', title: "Zapiekanka ziemniaczana", description: "Zapiekanka ziemniaczana pod jajkami!", imageSrc: 'images/image-3.jpg', category: 'vegan', likes: 0 }, 
        { id: 'card4', title: "Orzo risotto", description: "Orzo risotto z chorizo, jarmużem i pomidorami!", imageSrc: 'images/image-8.jpg', category: 'meat', likes: 0 },
        { id: 'card5', title: "Tofu", description: "Tofu w sojowo-musztardowej marynacie z kaszą!", imageSrc: 'images/image-7.jpg', category: 'vegetarian', likes: 0 }, 
        { id: 'card6', title: "Mapo tofu", description: "Autentyczne mapo tofu w autorskim sosie!", imageSrc: 'images/image-5.jpg', category: 'vegan', likes: 0 },
        { id: 'card7', title: "Butter chicken", description: "Kurczak w kremowym sosie pomidorowym z przyprawami indyjskimi.", imageSrc: 'images/extra1.jpg', category: 'vegetarian', likes: 0 },
    ];

    preExistingCards.forEach(card => {
        if (!existingCards.find(c => c.id === card.id)) {
            existingCards.push(card);
        }
    });

    localStorage.setItem('foodCards', JSON.stringify(existingCards));
    loadCardsFromLocalStorage();
}

function loadCardsFromLocalStorage() {
    const cards = JSON.parse(localStorage.getItem('foodCards')) || [];
    console.log("Loaded cards from localStorage:", cards);
    const foodCardsContainer = document.querySelector('.food-cards');
    cards.forEach(card => {
        const cardHTML = `
            <div class="card" id="${card.id}" data-name="${card.category}" data-likes="${card.likes}" onclick="toggleBlur()">
                <img src="${card.imageSrc}" alt="${card.title}" />
                <div class="card-body">
                    <h6 class="card-title">${card.title}</h6>
                    <p class="card-text">${card.description}</p>
                    <div class="like-section">
                        <span class="likes-count">${card.likes} Likes</span>
                        <i class='bx bx-like'></i>
                    </div>
                </div>
            </div>
        `;
        if (foodCardsContainer) {
            foodCardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        } else {
            console.error('foodCardsContainer not found in the DOM');
        }
    });
}


function toggleOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.toggle('active');
}   

function openPopup(imageSrc, title, description, likes, card) {
    const popup = document.getElementById('container-popup');
    document.getElementById('popup-image').src = imageSrc;
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-description').textContent = description;
    document.getElementById('like-button').onclick = (event) => {
        updateLikes(card);
    };

    const favouriteButton = document.getElementById('favourite-button');
    if (favouriteButton) {
        if (checkIfFavourite(card.id)) {
            favouriteButton.innerHTML = "<i class='bx bx-bookmark-minus'></i>Unfavourite this recipe!";
        } else {
            favouriteButton.innerHTML = "<i class='bx bx-bookmark-plus'></i>Favourite this recipe!";
        }
    }
    
    popup.classList.add('active');
    enableBlur();
}

function openPopupRecipe() {
    const popupRecipe = document.getElementById('container-popup-add');
    popupRecipe.classList.add('active');
    enableBlur();
}

function updateLikes(card) {
    console.trace('Updating likes for', card.id);
    let likes = parseInt(card.dataset.likes, 10) || 0;
    likes++;
    card.dataset.likes = likes;
    card.querySelector('.likes-count').textContent = `${likes} Likes`;
    console.log("Updated likes for card ID:", card.id, "New likes:", likes);
    updateCardInLocalStorage(card.id, likes);
    updateMostLikedCard(card, likes); // Check if this card is now the most liked
}

function updateMostLikedCard(card, likes) {
    const mostLiked = JSON.parse(localStorage.getItem('mostLikedCard')) || { likes: 0 };

    if (likes > mostLiked.likes) {
        const mostLikedCardData = {
            id: card.id,
            likes: likes,
            title: card.querySelector('.card-title').textContent,
            description: card.querySelector('.card-text').textContent,
            imageSrc: card.querySelector('img').src
        };
        localStorage.setItem('mostLikedCard', JSON.stringify(mostLikedCardData));
        console.log(`Updated most liked card: ${card.id} with ${likes} likes`);
    }
}

function updateCardInLocalStorage(cardId, newLikes) {
    let cards = JSON.parse(localStorage.getItem('foodCards')) || [];
    let found = false;

    cards = cards.map(card => {
        if (card.id === cardId) {
            card.likes = newLikes;
            found = true;
        }
        return card;
    });

    if (!found) {
        console.error("Card not found in localStorage:", cardId);
    }

    console.log("Updated cards in localStorage:", cards);
    localStorage.setItem('foodCards', JSON.stringify(cards));
}

const detailedDescriptions = {
    card1: {
        title: "Burger",
        description: "Klasyczny burger z soczystą wołowiną, serem cheddar i świeżymi warzywami, podawany z chrupiącymi frytkami. Idealny wybór dla miłośników amerykańskiej kuchni."
    },
    card2: {
        title: "Tost",
        description: "Złociste tosty z roztopionym serem i szczyptą ziół. Proste, ale niezwykle smakowite śniadanie na szybki start dnia."
    },
    card3: {
        title: "Zapiekanka ziemniaczana",
        description: "Zapiekanka ziemniaczana z bogatym farszem z boczku, cebuli i śmietany, zapieczona pod kruszonką serową. Komfortowe jedzenie, które zawsze poprawia nastrój."
    },
    card4: {
        title: "Orzo risotto",
        description: "Risotto z makaronem orzo, aromatycznym chorizo, jarmużem i suszonymi pomidorami. Połączenie, które zachwyci miłośników włoskich smaków."
    },
    card5: {
        title: "Tofu",
        description: "Tofu marynowane w orientalnej marynacie sojowo-musztardowej, podawane z kaszą gryczaną. Idealne dla szukających lekkiej, ale sycącej opcji wegetariańskiej."
    },
    card6: {
        title: "Mapo tofu",
        description: "Pikantne mapo tofu, serwowane z autorskim sosem na bazie fasoli czarnej. Ostra i intensywnie smakowa propozycja dla fanów kuchni chińskiej."
    },
    card7: {
        title: "Butter chicken",
        description: "Kurczak w kremowym sosie pomidorowym z przyprawami indyjskimi. Aromatyczne i kremowe danie idealne dla miłośników kuchni indyjskiej."
    },
};

// FAVOURITES
function displayMostLikedCard() {
    const mostLikedCardData = JSON.parse(localStorage.getItem('mostLikedCard'));
    if (mostLikedCardData) {
        console.log(`Displaying most liked card: ${mostLikedCardData.id} with ${mostLikedCardData.likes} likes`);
        const container = document.querySelector('.most-liked-container');
        container.innerHTML = '';
        const cardElement = createCardElement(mostLikedCardData);
        container.appendChild(cardElement);
    } else {
        console.log('No most liked card found');
    }
}

function toggleFavouriteCard(card) {
    let favourites = JSON.parse(localStorage.getItem('favouriteCards')) || [];
    const cardId = card.id;
    const index = favourites.findIndex(fav => fav.id === cardId);
    const favouriteButton = document.getElementById('favourite-button');

    if (index !== -1) {
        favourites.splice(index, 1);
        if (favouriteButton) favouriteButton.innerHTML = "<i class='bx bx-bookmark-plus'></i>Favourite this recipe!";
        console.log(`Removed card from favourites: ${card.id}`, favourites);
    } else {
        if (favourites.length >= 3) {
            console.log("Cannot add more than 3 favourite cards.");
            return;
        }
        const cardData = {
            id: card.id,
            title: card.querySelector('.card-title').textContent,
            description: card.querySelector('.card-text').textContent,
            imageSrc: card.querySelector('img').src,
            category: card.dataset.name,
            likes: parseInt(card.dataset.likes, 10)
        };
        favourites.push(cardData);
        if (favouriteButton) favouriteButton.innerHTML = "<i class='bx bx-bookmark-minus'></i>Unfavourite this recipe!";
        console.log(`Added card to favourites: ${card.id}`, favourites);
    }

    localStorage.setItem('favouriteCards', JSON.stringify(favourites));
}

function checkIfFavourite(cardId) {
    let favourites = JSON.parse(localStorage.getItem('favouriteCards')) || [];
    return favourites.some(fav => fav.id === cardId);
}

function displayFavouriteCards() {
    const favouriteCards = JSON.parse(localStorage.getItem('favouriteCards')) || [];
    const favouritesContainer = document.querySelector('.favourite-food-cards');
    
    if (favouritesContainer) {
        favouritesContainer.innerHTML = '';
        favouriteCards.forEach(cardData => {
            const cardElement = createCardElement(cardData);
            favouritesContainer.appendChild(cardElement);
        });
        console.log("Displayed favourite cards:", favouriteCards);
    } else {
        console.warn('Favourites container not found on this page.');
    }
}

function createCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = cardData.id;
    card.setAttribute('data-name', cardData.category);
    card.setAttribute('data-likes', cardData.likes);
    card.setAttribute('onclick', 'toggleBlur()');
    card.innerHTML = `
        <img src="${cardData.imageSrc}" alt="${cardData.title}" />
        <div class="card-body">
            <h6 class="card-title">${cardData.title}</h6>
            <p class="card-text">${cardData.description}</p>
            <div class="like-section">
                <span class="likes-count">${cardData.likes} Likes</span>
                <i class='bx bx-like'></i>
            </div>
        </div>
    `;
    return card;
}

const popupButton = document.getElementById('popup-button-recipe');
if (popupButton) {
    popupButton.addEventListener('click', function() {
        const title = document.getElementById('title-add-recipe').value;
        const description = document.getElementById('description-add-recipe').value;
        const category = document.getElementById('category-select').value;
        const imageFile = document.getElementById('image-add-recipe').files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const newId = 'card' + (document.querySelectorAll('.card').length + 1);
            const newCardHTML = `
                <div class="card" id="${newId}" data-name="${category}" data-likes="0">
                    <img src="${e.target.result}" alt="${title}" />
                    <div class="card-body">
                        <h6 class="card-title">${title}</h6>
                        <p class="card-text">${description}</p>
                        <div class="like-section">
                            <span class="likes-count">0 Likes</span>
                            <i class='bx bx-like'></i>
                        </div>
                    </div>
                </div>
            `;

            const container = document.querySelector('.food-cards');
            container.insertAdjacentHTML('beforeend', newCardHTML);
            saveCardToLocalStorage({
                id: newId,
                title: title,
                description: description,
                imageSrc: e.target.result,
                category: category,
                likes: 0
            });
            toggleBlur();
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    });
} else {
    console.warn('Popup button not found on this page.');
}

function saveCardToLocalStorage(card) {
    let cards = JSON.parse(localStorage.getItem('foodCards')) || [];
    cards.push(card);
    console.log("Saving new card to localStorage:", card);
    localStorage.setItem('foodCards', JSON.stringify(cards));
}


function enableBlur() {
    var blurContainer = document.getElementById('blur');
    blurContainer.classList.add('active');
    const overlay = document.getElementById('overlay');
    overlay.classList.add('active');
}

function disableBlur() {
    var blurContainer = document.getElementById('blur');
    blurContainer.classList.remove('active');
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('active');
}

function closePopup() {
    const popup = document.getElementById('container-popup');
    if (popup.classList.contains('active')) {
        popup.classList.remove('active');
        disableBlur();
    }
}

function closePopupAdd() {
    const popupAdd = document.getElementById('container-popup-add');
    if (popupAdd.classList.contains('active')) {
        popupAdd.classList.remove('active');
        disableBlur();
    }
}
