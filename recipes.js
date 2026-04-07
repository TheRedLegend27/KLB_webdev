async function loadRecipes() {
  const res = await fetch('dataset/recipes/beverages_recipes.json'); //change with recipe json we want to pull
  const recipes = await res.json();
  const grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';

  recipes.forEach(recipe => {
    grid.innerHTML += `
      <div class="col-6 col-md-3 mb-4">
        <div class="card h-100">
          <img src="dataset/images/${recipe.images[0]}" class="card-img-top" style="height:180px;object-fit:cover;">
          <div class="card-body">
            <h6 class="card-title">${recipe.name}</h6>
          </div>
        </div>
      </div>`;
  });
}

document.addEventListener('DOMContentLoaded', loadRecipes);
