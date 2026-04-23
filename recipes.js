let allRecipes = [];
let filteredRecipes = [];
let limiter = 4;

/* ---- Viewport helper ---- */
function isMobileViewport() {
  return window.innerWidth <= 767;
}

/* ---- Badge label for archive cards ---- */
function getMobileCardBadge(recipe) {
  if (recipe.difficulty === 'Hard') return { label: 'HIGH PRIORITY', cls: 'badge-red' };
  if (recipe.dietary && recipe.dietary.includes('Vegan')) return { label: 'FORAGED INTEL', cls: 'badge-red' };
  if (recipe.difficulty === 'Easy')     return { label: 'LEVEL 1 CLEARANCE', cls: 'badge-gray' };
  if (recipe.difficulty === 'Moderate') return { label: 'LEVEL 2 CLEARANCE', cls: 'badge-gray' };
  return { label: 'CLASSIFIED', cls: 'badge-red' };
}

/* ---- Short excerpt for archive card body ---- */
function getMobileExcerpt(recipe) {
  const seasonLines = {
    'Winter': 'Cold-weather field ration. Engineered for maximum caloric density in sub-zero conditions.',
    'Summer': 'High-hydration field protocol. Optimized for heat endurance and rapid energy replenishment.',
    'Spring': 'Foraged from the thaw. Light and adaptable — suited for fast-moving operations.',
    'Autumn': 'Harvest-season intel. Rich reserves gathered before the winter lockdown.',
  };
  if (seasonLines[recipe.season]) return seasonLines[recipe.season];
  return `${recipe.cuisine || 'Field'} technique. ${recipe.difficulty} difficulty. ${recipe.ingredients ? recipe.ingredients.length : '?'} core components.`;
}

/* ---- Render recipe list ---- */
function showRecipes(recipes) {
  filteredRecipes = recipes;
  limiter = 4;
  displayRecipes();
}

function displayRecipes() {
  const grid = document.getElementById('recipe-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const mobile = isMobileViewport();

  if (mobile) {
    /* ---- MOBILE LAYOUT ---- */
    filteredRecipes.slice(0, limiter).forEach(recipe => {
      const badge = getMobileCardBadge(recipe);
      const excerpt = getMobileExcerpt(recipe);

      const card = document.createElement('div');
      card.className = 'mob-recipe-card';
      card.innerHTML = `
        <div class="mob-card-image-wrapper">
          <img src="dataset/images/${recipe.images[0]}" alt="${recipe.name}" loading="lazy">
          <div class="mob-card-overlay">
            <span class="mob-card-badge ${badge.cls}">${badge.label}</span>
            <p class="mob-card-name">${recipe.name}</p>
          </div>
        </div>
        <div class="mob-card-excerpt-area">
          <p class="mob-card-excerpt-text">${excerpt}</p>
          <hr>
          <div class="mob-card-meta-row">
            <span class="mob-card-prep">
              <span class="mob-card-prep-icon">&#9201;</span>
              ${recipe.prep_time || 'N/A'}
            </span>
            <button class="mob-card-access-btn">ACCESS DECRYPTED</button>
          </div>
        </div>`;

      card.addEventListener('click', () => {
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = 'recipe.html?id=' + recipe.id;
      });
      grid.appendChild(card);
    });

    if (filteredRecipes.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:#666;padding:40px 16px;font-family:Montserrat,sans-serif;font-size:0.85rem;">NO INTEL FOUND</p>';
      return;
    }

    if (limiter < filteredRecipes.length) {
      const btnWrap = document.createElement('div');
      btnWrap.style.cssText = 'text-align:center;padding:8px 16px 16px;';
      btnWrap.innerHTML = `<button id="more" style="width:100%;background:#1a1a1a;color:#888;border:1px solid #333;border-radius:8px;padding:12px;font-family:Montserrat,sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:1px;cursor:pointer;">LOAD MORE INTEL</button>`;
      grid.appendChild(btnWrap);
      document.getElementById('more').addEventListener('click', () => {
        limiter += 4;
        displayRecipes();
      });
    }

  } else {
    /* ---- DESKTOP LAYOUT (unchanged) ---- */
    filteredRecipes.slice(0, limiter).forEach(recipe => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-3 mb-4';
      col.innerHTML = `
        <div class="card h-100" style="cursor:pointer;">
          <img src="dataset/images/${recipe.images[0]}" class="card-img-top" style="height:180px;object-fit:cover;">
          <div class="card-body bg-dark text-white">
            <h6 class="card-title fw-bold text-center">${recipe.name}</h6>
          </div>
        </div>`;
      col.addEventListener('click', () => {
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = 'recipe.html?id=' + recipe.id;
      });
      grid.appendChild(col);
    });

    if (filteredRecipes.length === 0) {
      grid.innerHTML = '<p class="text-center w-100 mt-4"><b>No Results</b></p>';
      return;
    }

    if (limiter < filteredRecipes.length) {
      const btnCol = document.createElement('div');
      btnCol.className = 'col-12 text-center mt-2 mb-4';
      btnCol.innerHTML = `<button class="btn btn-dark" id="more">More</button>`;
      grid.appendChild(btnCol);
      document.getElementById('more').addEventListener('click', () => {
        limiter += 4;
        displayRecipes();
      });
    }
  }
}

/* ---- Load recipes (called on archive pages) ---- */
async function loadRecipes() {
  const grid = document.getElementById('recipe-grid');
  if (!grid) return;

  const res = await fetch('dataset/recipes/all_recipes.json');
  allRecipes = await res.json();
  showRecipes(allRecipes);

  /* Desktop search */
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      showRecipes(allRecipes.filter(r => r.name.toLowerCase().includes(query)));
    });
  }

  /* Mobile search */
  const mobSearch = document.getElementById('mob-search-input');
  if (mobSearch) {
    mobSearch.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      resetChips();
      showRecipes(allRecipes.filter(r => r.name.toLowerCase().includes(query)));
    });
  }

  /* Mobile filter chips */
  const chipContainer = document.getElementById('mob-filter-chips');
  if (chipContainer) {
    chipContainer.querySelectorAll('.mob-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        chipContainer.querySelectorAll('.mob-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        /* Clear mobile search */
        const ms = document.getElementById('mob-search-input');
        if (ms) ms.value = '';

        const type  = this.dataset.filterType;
        const value = this.dataset.filter;

        if (type === 'all')      { showRecipes(allRecipes); return; }
        if (type === 'season')   { showRecipes(allRecipes.filter(r => r.season   === value)); return; }
        if (type === 'category') { showRecipes(allRecipes.filter(r => r.category === value)); return; }
        if (type === 'dietary')  { showRecipes(allRecipes.filter(r => r.dietary && r.dietary.includes(value))); return; }
      });
    });
  }
}

function resetChips() {
  const cc = document.getElementById('mob-filter-chips');
  if (!cc) return;
  cc.querySelectorAll('.mob-chip').forEach(c => c.classList.remove('active'));
  const all = cc.querySelector('[data-filter-type="all"]');
  if (all) all.classList.add('active');
}

/* ---- Re-render on viewport resize crossing breakpoint ---- */
let _lastMobile = isMobileViewport();
window.addEventListener('resize', () => {
  const now = isMobileViewport();
  if (now !== _lastMobile) {
    _lastMobile = now;
    if (filteredRecipes.length) displayRecipes();
  }
});

document.addEventListener('DOMContentLoaded', loadRecipes);

/* ============================================================
   HOME PAGE data loader (index.html only)
   ============================================================ */
async function loadHomeData() {
  const res = await fetch('dataset/recipes/all_recipes.json');
  const recipes = await res.json();

  /* ---- Featured recipe ---- */
  const idx = new Date().getDay() % recipes.length;
  const featured = recipes[idx];
  const featEl = document.getElementById('mob-featured-recipe');
  if (featEl && featured) {
    const excerpt = getMobileExcerpt(featured);
    featEl.innerHTML = `
      <div class="mob-featured-img-wrapper">
        <img src="dataset/images/${featured.images[0]}" alt="${featured.name}" loading="lazy">
        <div class="mob-featured-badge">FEATURED FIND</div>
      </div>
      <div class="mob-featured-body">
        <div class="mob-featured-title">${featured.name}</div>
        <p class="mob-featured-desc">${excerpt}</p>
        <button class="mob-featured-btn">ACCESS INTEL</button>
      </div>`;
    featEl.addEventListener('click', () => {
      localStorage.setItem('selectedRecipe', JSON.stringify(featured));
      window.location.href = 'recipe.html?id=' + featured.id;
    });
  }

  /* ---- Recent Field Notes (last 3 by index) ---- */
  const fieldLocations = ['ARCHIVE NORTH', 'FIELD STATION B', 'OBSERVATION POST', 'BASE CAMP DELTA', 'SECTOR 7'];
  const fieldTimes = ['3H AGO', '8H AGO', 'YESTERDAY', '2 DAYS AGO'];
  const noteRecipes = recipes.slice(-3).reverse();
  const fieldEl = document.getElementById('mob-field-notes-list');
  if (fieldEl) {
    fieldEl.innerHTML = noteRecipes.map((r, i) => `
      <div class="mob-field-note-item" style="cursor:pointer;" data-id="${r.id}">
        <div class="mob-field-note-body">
          <div class="mob-field-note-name">${r.name}</div>
          <div class="mob-field-note-meta">${fieldTimes[i % fieldTimes.length]} &middot; ${fieldLocations[i % fieldLocations.length]}</div>
        </div>
        <div class="mob-field-note-icon">&#128196;</div>
      </div>`).join('');

    fieldEl.querySelectorAll('.mob-field-note-item').forEach(item => {
      item.addEventListener('click', () => {
        const r = recipes.find(x => String(x.id) === item.dataset.id);
        if (r) {
          localStorage.setItem('selectedRecipe', JSON.stringify(r));
          window.location.href = 'recipe.html?id=' + r.id;
        }
      });
    });
  }

  /* ---- Survival Dashboard ---- */
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const categories = [...new Set(recipes.map(r => r.category).filter(Boolean))];
  const dashEl = document.getElementById('mob-dashboard-grid');
  if (dashEl) {
    dashEl.innerHTML = `
      <div class="mob-dashboard-stat">
        <div class="mob-dashboard-stat-num">${recipes.length}</div>
        <div class="mob-dashboard-stat-label">ARCHIVE ITEMS</div>
      </div>
      <div class="mob-dashboard-stat">
        <div class="mob-dashboard-stat-num">${favorites.length || 0}</div>
        <div class="mob-dashboard-stat-label">RECIPES SAVED</div>
      </div>
      <div class="mob-dashboard-stat">
        <div class="mob-dashboard-stat-num">24%</div>
        <div class="mob-dashboard-stat-label">FORAGE YIELD</div>
      </div>
      <div class="mob-dashboard-stat">
        <div class="mob-dashboard-stat-num">${categories.length}</div>
        <div class="mob-dashboard-stat-label">ACTIVE SCOUTS</div>
      </div>`;
  }

  /* ---- Hero search wires to archive ---- */
  const heroSearch = document.getElementById('mob-hero-search');
  if (heroSearch) {
    heroSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter' && heroSearch.value.trim()) {
        window.location.href = 'all_recipes.html';
      }
    });
    heroSearch.addEventListener('click', () => {
      window.location.href = 'all_recipes.html';
    });
  }
}

/* ============================================================
   Favorites helpers (shared across pages)
   ============================================================ */
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(id) {
  return getFavorites().some(r => String(r.id) === String(id));
}

function addToFavorites(recipe) {
  let favorites = getFavorites();
  if (!isFavorite(recipe.id)) {
    favorites.push(recipe);
    saveFavorites(favorites);
    return true;
  }
  return false;
}

function removeFromFavorites(id) {
  saveFavorites(getFavorites().filter(r => String(r.id) !== String(id)));
}
