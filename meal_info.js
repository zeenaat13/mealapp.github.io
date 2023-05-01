const mealTitle = document.getElementById('meal-name');
const category = document.getElementById('cat');
const area = document.getElementById('area');
const video = document.getElementById('iframe-v');
const instructions = document.getElementById('ins');
const image = document.getElementById('thumb');
const ingredients = document.getElementById('ingredients');


let id = window.location.search.split('?')[1];


let meal = JSON.parse(localStorage.getItem(id));

document.title = meal.strMeal;

//function to render the details using jsonata
function renderDetailsPage(meal) {
    const {strMeal, strCategory, strArea, strYoutube, strInstructions, strMealThumb} = meal;
   
    mealTitle.innerText = strMeal;
    category.innerHTML = strCategory;
    area.innerHTML = strArea;
    video.setAttribute('src', strYoutube.replace("watch?v=", "embed/"));
    instructions.innerHTML = strInstructions;

    image.src = strMealThumb;

    
    for(let i = 1; i<21; i++){
        let index = i.toString();
        let ingredient =  'strIngredient' + index;
        let measure  = 'strMeasure' + index;
        if(meal[ingredient] === "" || meal[ingredient] === null){
            break;
        }
        const li =  document.createElement('li');
        li.innerHTML = ` ${meal[ingredient]}`
        ingredients.appendChild(li)
    }  
}

window.onload = () =>{
    renderDetailsPage(meal);
}