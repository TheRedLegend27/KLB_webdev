const container = document.getElementById("card-container");
const deckContainer = document.getElementById("deck-container");

const modal = document.getElementById("card-modal");
const closeModal = document.getElementById("close-modal");

let allCards = [];
let deck = [];

// LOAD CARDS
fetch("nano-data/cards.json")
  .then(res => res.json())
  .then(cards => {
    allCards = cards;
    renderCards();
  });

// CARD RARITY
function getRarity(card) {
  if (card.attack >= 4) return "high";
  if (card.attack >= 2) return "mid";
  return "low";
}

// RENDER CARD GRID
function renderCards() {
  container.innerHTML = "";

  allCards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.rarity = getRarity(card);

    const img = document.createElement("img");
    img.src = "nano-data/" + card.image;

    const name = document.createElement("p");
    name.textContent = card.name;

    div.appendChild(img);
    div.appendChild(name);

    // VIEW card on click
    div.addEventListener("click", () => showCard(card));

    // HOVER button for adding/removing deck
    const deckBtn = document.createElement("button");
    deckBtn.textContent = deck.includes(card) ? "−" : "+";
    deckBtn.classList.add("deck-btn");
    deckBtn.onclick = e => {
      e.stopPropagation(); // prevent opening modal
      toggleDeck(card);
      deckBtn.textContent = deck.includes(card) ? "−" : "+";
    };

    div.appendChild(deckBtn);
    container.appendChild(div);
  });
}

// SHOW CARD MODAL
function showCard(card) {
  document.getElementById("modal-image").src = "nano-data/" + card.image;
  document.getElementById("modal-name").textContent = card.name;
  document.getElementById("modal-type").textContent = card.type;
  document.getElementById("modal-role").textContent = card.role;
  document.getElementById("modal-stats").textContent =
    `ATK ${card.attack} / DEF ${card.defense}`;
  document.getElementById("modal-rules").textContent = card.rulesText;
  document.getElementById("modal-flavor").textContent = card.flavorText;
  document.getElementById("modal-details").textContent = card.details;

  modal.classList.remove("hidden");
}

// CLOSE MODAL
closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = e => {
  if (e.target === modal) modal.classList.add("hidden");
};

// DECK BUILDER
function toggleDeck(card) {
  const index = deck.findIndex(c => c.id === card.id);

  if (index > -1) {
    deck.splice(index, 1);
  } else {
    deck.push(card);
  }

  renderDeck();
  renderCards(); // refresh add/remove buttons
}

function renderDeck() {
  deckContainer.innerHTML = "";

  deck.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("deck-card");

    const img = document.createElement("img");
    img.src = "nano-data/" + card.image;

    const name = document.createElement("p");
    name.textContent = card.name;

    div.appendChild(img);
    div.appendChild(name);

    // remove on click
    div.onclick = () => toggleDeck(card);

    deckContainer.appendChild(div);
  });
}

// PAGE SWITCH
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}