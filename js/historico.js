let selectedRating = 0;

function openModal() {
    document.getElementById("feedbackModal").style.display = "flex";
}

function rate(stars) {
    selectedRating = stars;
    let starElems = document.querySelectorAll("#starRating span");
    starElems.forEach((star, index) => {
        star.classList.toggle("active", index < stars);
    });
}

function sendFeedback() {
    if (selectedRating === 0) {
        alert("Por favor, selecione uma quantidade de estrelas.");
        return;
    }
    document.getElementById("feedbackModal").style.display = "none";
    alert("Obrigada pelo feedback!");
    selectedRating = 0;
    document.querySelectorAll("#starRating span").forEach(s => s.classList.remove("active"));
}

window.onclick = function(e) {
    if (e.target.id === "feedbackModal") {
        document.getElementById("feedbackModal").style.display = "none";
    }
}