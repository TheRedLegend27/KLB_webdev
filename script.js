async function loadMonsters() {
  const monsters = await fetch("monsters.json").then(r => r.json());
  const container = document.querySelector("#monster-cards");

  // inserts monster cards pulled from monsters.json
  monsters.forEach(m => {
    container.insertAdjacentHTML("beforeend", `
      <div class="card bg-dark text-white mb-2">
        <div class="card-body">
          <h5 class="card-title">${m.name}</h5>
          <span class="badge bg-secondary me-2">${m.danger}</span>
          <p class="card-text mt-2">${m.description}</p>
        </div>
      </div>`);
  });}
loadMonsters();

// hide popup dialog if user already dismissed it
const dialog = document.querySelector("dialog");
if (localStorage.getItem("dialogDismissed")) {
  dialog.removeAttribute("open");
}

// saves dismissal so it stays closed on relaunch
dialog.querySelector("button").addEventListener("click", () => {
  localStorage.setItem("dialogDismissed", "true");
  dialog.removeAttribute("open");
});

// roating tags
const tags = [
  "The Company is Watching",
  "The Company Appreciates Your Sacrifice.",
  "You are a Valued Employee of the Comapny",
];
let i = 0;
const taglineEl = document.querySelector("#tagline");
taglineEl.textContent = tags[i];
setInterval(() => taglineEl.textContent = tags[i = (i + 1) % tags.length], 5000);

// toggle visibility of monster cards
const toggleBtn = document.querySelector("#toggle-monsters-btn");
const monsterCards = document.querySelector("#monster-cards");
toggleBtn.addEventListener("click", () => {
  toggleBtn.textContent = monsterCards.classList.toggle("d-none") ? "Show" : "Hide";
});

// highlight monster card on hover
document.querySelector("#Monsters").addEventListener("mouseover", (e) => {
  const card = e.target.closest(".card");
  if (card) card.style.outline = "2px solid white";
});

document.querySelector("#Monsters").addEventListener("mouseout", (e) => {
  const card = e.target.closest(".card");
  if (card) card.style.outline = "";
});

// Text change on button click
document.getElementById("blindBtn").onclick = blind_text;
document.getElementById("sightBtn").onclick = sight_text;

function blind_text() {
  document.getElementById("Blind").style.fontSize = "30px";
  document.getElementById("Blind").style.height = "1300px";
}

function sight_text() {
  document.getElementById("Blind").style.fontSize = "1rem";
  document.getElementById("Blind").style.height = "650px";
}

//Moons drop down
var coll = document.getElementsByClassName("collapsible");
var j;

for (j = 0; j < coll.length; j++) {
  coll[j].addEventListener("click", function() {
    this.classList.toggle("active");
    var itemmoons = this.nextElementSibling;
    if (itemmoons.style.display === "block") {
      itemmoons.style.display = "none";
    } else {
      itemmoons.style.display = "block";
    }
  });
}