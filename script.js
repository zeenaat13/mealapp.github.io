const searchitem = document.querySelector(' section div.text div.container #input-search');
const list = document.querySelector('.recipes')
const favBtn = document.getElementById('fav-btn');
const searchField = document.querySelector(' section div.text div.container input[type = search]');

//fetch results from the searchfield from the mealdb api
async function search(query) {
    
    let loader = `<div class="ld-ring"><div></div><div></div><div></div><div></div></div>`
    list.innerHTML = loader;
    if(query.length === 0){
        list.textContent = '';
        return;
    }
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    fetch(url).
    then(response => response.json())
    .then((jsonData) =>{
        const arr = jsonData.meals;
        //remove loading animation
    
        list.textContent = '';

        //NOT FOUND RESULT
        if(arr === null){
            
            let item = document.createElement('p');
            item.setAttribute('class', 'no_result_found');
            if(!list.hasChildNodes()){
                item.innerHTML = '<p style = "font-size: 3rem ">NO MEAL RECIPE AVAILABLE</p>';
                
                list.appendChild(item);
            }
            return;
        }
        
        //render the results from fetch results
        renderMeals(arr, false);
        
    }).catch((e) =>{
        throw(e)
    })
}
// function to render all the meals 
 async function renderMeals(results,  favList) {
    
    //loop  array for each meal object 
    for(let result of results){
        
        const item = document.createElement('div');
        item.setAttribute('class', 'meal-container')
        
        const thumbnail= document.createElement('div');
        thumbnail.setAttribute('class', 'card');
        thumbnail.style.backgroundImage = `url(${result.strMealThumb})`

        const favouriteBtn = document.createElement('button');
        favouriteBtn.setAttribute('class', 'favourite-btn')
        favouriteBtn.setAttribute('id', result.idMeal)
        favouriteBtn.innerHTML = `❤`

        const name = document.createElement('p');
        name.innerText = result.strMeal;
        name.setAttribute('class', 'card_title')
        

       const category = document.createElement('p');
       category.innerHTML = `<span> ${result.strCategory}</span>`;
        category.setAttribute('class', 'category')

        

        const titleWrapper = document.createElement('div');
        titleWrapper.setAttribute('class', 'title-wrapper')
        titleWrapper.appendChild(name);
        titleWrapper.appendChild(category);

        thumbnail.append(favouriteBtn)
       
       

        item.append(thumbnail)
        item.append(titleWrapper)
      
          
        
        if(isInLocals(result.idMeal) !== -1){
            favouriteBtn.classList.add('is-fav-color')

        }
        
        list.appendChild(item);
        
        
         name.addEventListener('click', function loadDetails(){
            
            
            localStorage.setItem(result.idMeal, JSON.stringify(result))
           
            window.open('meal_info.html?' + result.idMeal);           
        });
// function to add meals to the favourite list
        favouriteBtn.addEventListener('click',  function addToFav() {
            
            let id = result.idMeal;
        
            let itemIndex = isInLocals(id);
            
            let locals;
            
            if( itemIndex !== -1){
                
                locals = JSON.parse(localStorage.getItem('locals'));
                locals.splice(itemIndex, 1);
                this.style.color = 'white'
               
                if(favList){
                    this.parentNode.parentNode.style.display = 'none'
                }

         
                
                
            }else {
               
                locals = [];
                let obj = {
                    id: result.idMeal,
                    result
                }
            
               if(localStorage.getItem('locals') === null){
                locals.push(obj);
               }
               
               else{
                locals = JSON.parse(localStorage.getItem('locals'));
                locals.push(obj);
               }
              
            }
           
            if(locals.length !== 0)
            {
                localStorage.setItem('locals', JSON.stringify(locals));
            }
            else{
                
                localStorage.removeItem('locals')
            }

              
            }
        );
    }  
    
}


function isInLocals(id){
    

    let locals = JSON.parse(localStorage.getItem('locals'));
    if(locals == null){
        return -1;
    }
    let itemIndex = locals.findIndex( local => local.id == id );
    return itemIndex;
 

    
}

favBtn.addEventListener('click', showFavourites);
// function to show the favourite meals
async function showFavourites() {
    
    searchitem.value = "";
    list.textContent = '';


   let listStrArr =  JSON.parse(localStorage.getItem('locals'));
   if(listStrArr === null){
    list.innerHTML="There are no recipes in the favourite list"
       return;
   }
  
   let listArr = listStrArr.map(meal => {
       return meal.result;
   })
   
   renderMeals(listArr, true)
}

//Empty searchfield ,clear the list
searchField.addEventListener('search', (e) => {
    list.textContent = ''
  })



let searchTime = 0;

window.onload = () =>{
   
    searchitem.onkeyup = (event) =>{

        if(searchitem.value.trim().length === 0){
            
            list.textContent = ''


            return;
        }
        
        clearTimeout(searchTime);

        
         searchTime = setTimeout(() => {
             search(searchitem.value.trim());
         }, 150);
    }
}