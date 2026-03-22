async function loadMonsters() {
  const monsters = await fetch("load/monsters.json").then(r => r.json());
  const container = document.querySelector("#Monsters");
  monsters.forEach(m => {
    container.insertAdjacentHTML("beforeend", `
      <div class="card bg-dark text-white mb-2">
        <div class="card-body">
          <h5 class="card-title">${m.name}</h5>
          <span class="badge bg-secondary me-2">${m.danger}</span>
          <p class="card-text mt-2">${m.description}</p>
        </div>
      </div>`);
  });
}
loadMonsters();