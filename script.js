const filterButtons = document.querySelectorAll(".filter-buttons button");
const filterableCard = document.querySelectorAll(".food-cards .card");

console.log(filterButtons, filterableCard);

const filterCards = (e) => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    filterableCard.forEach(card => {
        card.classList.add("hide");
        if(card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all"){
            card.classList.remove("hide");
        }
    });
};

filterButtons.forEach(button => button.addEventListener("click", filterCards));



function toggleBlur(){
    var blurContainer = document.getElementById('blur');
    blurContainer.classList.toggle('active');
    var popup = document.getElementById('container-popup');
    popup.classList.toggle('active');
}
function test(){
    console.log("TES");
}

document.addEventListener("DOMContentLoaded", function () {
    const filterToggle = document.getElementById("filter-toggle");
    const filterButtons = document.querySelector(".filter-buttons");

    filterToggle.addEventListener("click", function () {
        filterButtons.classList.toggle("open");
    });
});
