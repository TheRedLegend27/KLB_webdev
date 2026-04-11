let allRecipes = []; // full list of recipes loaded from JSON
let limiter = 4; //we can change this to whatever but the page shows 4 at a time rn

function showRecipes(recipes) {
  filteredRecipes = recipes; // update the current list to whatever was passed in (right now its just all because we do not have filters yet :p)
  limiter = 4; // reset to 4 so a new search/filter starts from the top
  displayRecipes(); // function to render the cards
}

function displayRecipes() {
  const grid = document.getElementById('recipe-grid'); 
  grid.innerHTML = ''; // clear existing cards 

  filteredRecipes.slice(0, limiter).forEach(recipe => { // only show up to limiter recipes
    const col = document.createElement('div');
    col.className = 'col-6 col-md-3 mb-4';
    col.innerHTML = `
      <div class="card h-100" style="cursor:pointer;">
        <img src="dataset/images/${recipe.images[0]}" class="card-img-top" style="height:180px;object-fit:cover;"> <!-- first image from the recipe's image list -->
        <div class="card-body">
          <h6 class="card-title">${recipe.name}</h6> <!-- display the recipe name -->
        </div>
      </div>`;
    col.addEventListener('click', () => { // clicking a card saves the recipe and navigates to the detail page
      localStorage.setItem('selectedRecipe', JSON.stringify(recipe)); // save recipe data so recipe.html can read it
      window.location.href = 'recipe.html';
    });
    grid.appendChild(col); // adds the finished card
  });

  if (limiter < filteredRecipes.length) { // only show more if there are hidden recipes remaining
    const btnCol = document.createElement('div');
    btnCol.className = 'col-12 text-center mt-2 mb-4';
    btnCol.innerHTML = `<button class="btn btn-dark" id="more">More</button>`; // button maybe change this later
    grid.appendChild(btnCol);
    document.getElementById('more').addEventListener('click', () => {
      limiter += 4; //this can also be adjusted but 4 is what the page shows
      displayRecipes(); // redner the cards
    });
  }
}

async function loadRecipes() {
  const res = await fetch('dataset/recipes/all_recipes.json'); // gets the all the recipes, keep as all recipes for now
  allRecipes = await res.json();
  showRecipes(allRecipes); // parse and display all recipes (this is old I think we an remove this later because of the limiter)

  document.getElementById('search-input').addEventListener('input', function() { // function for typing in the search box 
    const query = this.value.toLowerCase(); // sets all input to lowercase
    showRecipes(allRecipes.filter(r => r.name.toLowerCase().includes(query)));
  });
}

document.addEventListener('DOMContentLoaded', loadRecipes);