const container = document.getElementById("card-container");
const modal = document.getElementById("card-modal");
const closeModal = document.getElementById("close-modal");

const availableContainer = document.getElementById("available-container");
const deckContainer = document.getElementById("deck-container");
const deckCount = document.getElementById("deck-count");

let allCards = [];
let deck = [];
const MAX_DECK_SIZE = 10;

// Load cards
fetch("nano-data/cards.json")
  .then(res => res.json())
  .then(cards => {
    allCards = cards;
    renderAllCards();
    renderDeckBuilder();
  });

// CARD RARITY
function getRarity(card) {
  if (card.attack >= 4) return "high";
  if (card.attack >= 2) return "mid";
  return "low";
}

// Render all cards on Cards page
function renderAllCards() {
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

    div.onclick = () => showCard(card);

    container.appendChild(div);
  });
}

// Show card modal
function showCard(card) {
  document.getElementById("modal-image").src = "nano-data/" + card.image;
  document.getElementById("modal-name").textContent = card.name;
  document.getElementById("modal-type").textContent = card.type;
  document.getElementById("modal-role").textContent = card.role;
  document.getElementById("modal-stats").textContent = `ATK ${card.attack} / DEF ${card.defense}`;
  document.getElementById("modal-rules").textContent = card.rulesText;
  document.getElementById("modal-flavor").textContent = card.flavorText;
  document.getElementById("modal-details").textContent = card.details;

  modal.classList.remove("hidden");
}

// Close modal
closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = e => { if (e.target === modal) modal.classList.add("hidden"); };

// Deck Builder
function toggleDeck(card) {
  const index = deck.findIndex(c => c.id === card.id);
  if (index > -1) {
    deck.splice(index, 1); // remove
  } else {
    if(deck.length >= MAX_DECK_SIZE) {
      alert("Deck is full!");
      return;
    }
    deck.push(card); // add
  }
  renderDeckBuilder();
}

// Render Deck Builder panes
function renderDeckBuilder() {
  deckContainer.innerHTML = "";
  availableContainer.innerHTML = "";

  deckCount.textContent = deck.length;

  // Render deck
  deck.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("deck-card");

    const img = document.createElement("img");
    img.src = "nano-data/" + card.image;

    const name = document.createElement("p");
    name.textContent = card.name;

    div.appendChild(img);
    div.appendChild(name);
    div.onclick = () => toggleDeck(card);

    deckContainer.appendChild(div);
  });

  // Render available cards
  allCards.filter(c => !deck.includes(c)).forEach(card => {
    const div = document.createElement("div");
    div.classList.add("available-card");

    const img = document.createElement("img");
    img.src = "nano-data/" + card.image;

    const name = document.createElement("p");
    name.textContent = card.name;

    div.appendChild(img);
    div.appendChild(name);
    div.onclick = () => toggleDeck(card);

    availableContainer.appendChild(div);
  });
}

// Page switch
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}