async function loadMonsters() {
  const monsters = await fetch("load/monsters.json").then(r => r.json());
  const container = document.querySelector("#Monsters");

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

// highlight monster card on hover
document.querySelector("#Monsters").addEventListener("mouseover", (e) => {
  const card = e.target.closest(".card");
  if (card) card.style.outline = "2px solid white";
});

document.querySelector("#Monsters").addEventListener("mouseout", (e) => {
  const card = e.target.closest(".card");
  if (card) card.style.outline = "";
});