let allRecipes = [];
let limiter = 4; //we can change this to whatever but the page shows 4 at a time rn

function showRecipes(recipes) {
  filteredRecipes = recipes;
  limiter = 4;
  displayRecipes();
}

function displayRecipes() {
  const grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';

  filteredRecipes.slice(0, limiter).forEach(recipe => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-3 mb-4';
    col.innerHTML = `
      <div class="card h-100" style="cursor:pointer;">
        <img src="dataset/images/${recipe.images[0]}" class="card-img-top" style="height:180px;object-fit:cover;">
        <div class="card-body">
          <h6 class="card-title">${recipe.name}</h6>
        </div>
      </div>`;
    col.addEventListener('click', () => {
      localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
      window.location.href = 'recipe.html';
    });
    grid.appendChild(col);
  });

  if (limiter < filteredRecipes.length) {
    const btnCol = document.createElement('div');
    btnCol.className = 'col-12 text-center mt-2 mb-4';
    btnCol.innerHTML = `<button class="btn btn-dark" id="more">More</button>`;
    grid.appendChild(btnCol);
    document.getElementById('more').addEventListener('click', () => {
      limiter += 4; //this can also be adjusted but 4 is what the page shows
      displayRecipes();
    });
  }
}

async function loadRecipes() {
  const res = await fetch('dataset/recipes/all_recipes.json');
  allRecipes = await res.json();
  showRecipes(allRecipes);

  document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    showRecipes(allRecipes.filter(r => r.name.toLowerCase().includes(query)));
  });
}

document.addEventListener('DOMContentLoaded', loadRecipes);
