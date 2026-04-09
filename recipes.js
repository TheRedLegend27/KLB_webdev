async function loadRecipes() {
  const res = await fetch('dataset/recipes/all_recipes.json'); //change with recipe json we want to pull
  const recipes = await res.json();
  const grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';

  recipes.forEach(recipe => {
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
}
document.addEventListener('DOMContentLoaded', loadRecipes);
