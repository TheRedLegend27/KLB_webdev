let allRecipes = [];
let filteredRecipes = [];
let limiter = 4;

function isMobileViewport() { return window.innerWidth <= 767; }

function getMobileCardBadge(recipe) {
  if (recipe.difficulty === 'Hard') return { label: 'HIGH PRIORITY', cls: 'badge-red' };
  if (recipe.dietary && recipe.dietary.includes('Vegan')) return { label: 'FORAGED INTEL', cls: 'badge-red' };
  if (recipe.difficulty === 'Easy')     return { label: 'LEVEL 1 CLEARANCE', cls: 'badge-gray' };
  if (recipe.difficulty === 'Moderate') return { label: 'LEVEL 2 CLEARANCE', cls: 'badge-gray' };
  return { label: 'CLASSIFIED', cls: 'badge-red' };
}

function getMobileExcerpt(recipe) {
  return `Winter reserves — ${recipe.cuisine || 'field'} technique. ${recipe.difficulty} difficulty. ${recipe.ingredients ? recipe.ingredients.length : '?'} core components.`;
}

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
    filteredRecipes.slice(0, limiter).forEach(recipe => {
      const badge = getMobileCardBadge(recipe);
      const excerpt = getMobileExcerpt(recipe);
      const card = document.createElement('div');
      card.className = 'mob-recipe-card';
      card.innerHTML = `
        <div class="mob-card-image-wrapper">
          <img src="../dataset/images/${recipe.images[0]}" alt="${recipe.name}" loading="lazy">
          <div class="mob-card-overlay">
            <span class="mob-card-badge ${badge.cls}">${badge.label}</span>
            <p class="mob-card-name">${recipe.name}</p>
          </div>
        </div>
        <div class="mob-card-excerpt-area">
          <p class="mob-card-excerpt-text">${excerpt}</p>
          <hr>
          <div class="mob-card-meta-row">
            <span class="mob-card-prep"><span class="mob-card-prep-icon">&#9201;</span>${recipe.prep_time || 'N/A'}</span>
            <button class="mob-card-access-btn">ACCESS DECRYPTED</button>
          </div>
        </div>`;
      card.addEventListener('click', () => {
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = '../recipe.html?id=' + recipe.id;
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
      document.getElementById('more').addEventListener('click', () => { limiter += 4; displayRecipes(); });
    }
  } else {
    filteredRecipes.slice(0, limiter).forEach(recipe => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-3 mb-4';
      col.innerHTML = `
        <div class="card h-100" style="cursor:pointer;">
          <img src="../dataset/images/${recipe.images[0]}" class="card-img-top" style="height:180px;object-fit:cover;">
          <div class="card-body bg-dark text-white">
            <h6 class="card-title fw-bold text-center">${recipe.name}</h6>
          </div>
        </div>`;
      col.addEventListener('click', () => {
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = '../recipe.html?id=' + recipe.id;
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
      document.getElementById('more').addEventListener('click', () => { limiter += 4; displayRecipes(); });
    }
  }
}

async function loadRecipes() {
  const grid = document.getElementById('recipe-grid');
  if (!grid) return;
  const res = await fetch('../dataset/recipes/winter_recipes.json');
  allRecipes = await res.json();
  showRecipes(allRecipes);

  const mobSearch = document.getElementById('mob-search-input');
  if (mobSearch) {
    mobSearch.addEventListener('input', function() {
      showRecipes(allRecipes.filter(r => r.name.toLowerCase().includes(this.value.toLowerCase())));
    });
  }
  const desktopSearch = document.getElementById('search-input');
  if (desktopSearch) {
    desktopSearch.addEventListener('input', function() {
      showRecipes(allRecipes.filter(r => r.name.toLowerCase().includes(this.value.toLowerCase())));
    });
  }
}

let _lastMobile = isMobileViewport();
window.addEventListener('resize', () => {
  const now = isMobileViewport();
  if (now !== _lastMobile) { _lastMobile = now; if (filteredRecipes.length) displayRecipes(); }
});

document.addEventListener('DOMContentLoaded', loadRecipes);

function getFavorites() { return JSON.parse(localStorage.getItem('favorites')) || []; }
function saveFavorites(f) { localStorage.setItem('favorites', JSON.stringify(f)); }
function isFavorite(id) { return getFavorites().some(r => String(r.id) === String(id)); }
function addToFavorites(recipe) {
  let f = getFavorites();
  if (!isFavorite(recipe.id)) { f.push(recipe); saveFavorites(f); return true; }
  return false;
}
function removeFromFavorites(id) { saveFavorites(getFavorites().filter(r => String(r.id) !== String(id))); }
