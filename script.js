//Flödet för programmet
//När man öppnar siten första gången så ska restauranger hämtas
//Om man ändrar något i selectboxen måste vi också ändra i URLen innan vi gör fetch igen. 

//const restaurants = document.getElementsByClassName('restaurant'); //dont use this

 //funktion filterResult som returnerar en filtrerad array
 const filterPrice = () => {
  const filterPriceInput = document.getElementById('filterPrice').value
  console.log("Price in filterPrice" ,filterPriceInput)
  return filterPriceInput
}


const filterRating = () => {
  const filterRatingInput = document.getElementById('filterRating').value
  console.log(filterRatingInput)
  return filterRatingInput
}

const setUpRequest = (sort) => {
  let sortResult = sort
  //console.log(sortResult)
  //let sortOrder = order
  //console.log(sortOrder)
  const apiData = `https://developers.zomato.com/api/v2.1/search?entity_id=64&entity_type=city&count=20&cuisines=89&sort=${sortResult}&order=asc`
  const apiKey = `6fe7eca07d46a86fc9db6690648ba3df`
    const request = new Request(apiData, {
        headers: new Headers({
        Accept: 'application/json', 
        'user-key': apiKey
    })
  })
  return request
}

//function that takes in sorted values 
const applyFilters = () => {
  const selectedSortBy = document.getElementById('sortBy').value
  //const sortOrder = document.getElementById('sortingOrder').value
  const filterPriceResult = filterPrice();
  const filterRatingResult = filterRating();
  console.log("In apply filters: ",selectedSortBy,filterPriceResult,filterRatingResult);
  //fetchRestaurants(selectedSortBy, sortOrder)
  //console.log(selectedSortBy)
  //console.log(sortOrder)
  fetchRestaurants(selectedSortBy,true);
}

//functin to add a default image to restaurants with no image 
const setDefaultImage = () => {
  return './image/default-image.jpg'
}

const fetchRestaurants = (sort = 'cost',filter = false) => {
  console.log("In Fetch restaurants: ",sort,filter);
  const requestObject = setUpRequest(sort);


  fetch(requestObject) //we use the request object and pass it in to the fetch-function (instead of the URL)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log(json);
      //map
      let newArray = json.restaurants.map(restaurantInformation)
      if(filter === true){
        newArray = rangeFilter(newArray)
      }
 
      console.log(newArray)
     // console.log(newArray)
      //
      document.getElementById("mainContent").innerHTML = ''; 
    //newArray.forEach(renderHTML)
    newArray.forEach(renderHTML);
        
      });
 
}
fetchRestaurants();

const restaurantInformation = (information) => {
  const restaurantName = information.restaurant.name
  const restaurantAddress = information.restaurant.location.address
  const averageCost = information.restaurant.average_cost_for_two 
  const averageRating = information.restaurant.user_rating.aggregate_rating
  let image = information.restaurant.featured_image
  if (image === '') image = setDefaultImage()
  //console.log(image)
  const currency = information.restaurant.currency
  //console.log(image);
  return {restaurantName, restaurantAddress, averageRating, averageCost, currency, image}
}

const renderHTML = (restaurantItem, index) => { 
    //console.log(restaurantItem, index); 
    let restaurantSection = `<section class="restaurant">`; 
    restaurantSection += `<div class="picture-container">`; 
    restaurantSection += `<img class="rest-picture" src="${restaurantItem.image}"/>`; 
    restaurantSection += `</div>`; 
    restaurantSection += `<div class="restaurant-description>`; 
    restaurantSection += `<h1 class="rest-name">Restaurant name ${restaurantItem.restaurantName}</h1>`; 
    restaurantSection += `<p class="rest-address"> Address ${restaurantItem.restaurantAddress}</p>`; 
    restaurantSection += `<p class="rest-average-cost"> Avg Cost ${restaurantItem.averageCost} ${restaurantItem.currency} </p>`; 
    restaurantSection += `<p class="rest-rating"> Rating ${restaurantItem.averageRating}</p>`; 
    restaurantSection += `</div>`; 
    restaurantSection += `</section>`; 
    document.getElementById("mainContent").innerHTML += restaurantSection; 
}

const rangeFilter = (restaurantArray) => {
  const filterPriceResult = filterPrice() 
  const filterRatingResult = filterRating()
  console.log(`in rangefilter price ${filterPriceResult}`)
  console.log(`in rangefilter rating ${filterRatingResult}`)
  //newArray ska filtreras på rating eller price. Tänkbar funktion är t.ex. array.filter 
  let filteredArray = restaurantArray.filter(item => (item.averageCost <= filterPriceResult) && item.averageRating >= filterRatingResult);
  //let filteredCostandRatingArray = filteredCostArray.filter(item => item.averageRating >= filterRatingResult);
  return filteredArray

}

const changedPriceValue = () => {
  let value = document.getElementById('filterPrice').value;
  let valueText;
  if (value <= 100){
      valueText = 'Budget';
  }
  else if(value > 100 && value < 500){
    valueText = 'Mid-range'
  }
  else (valueText = 'High')
  document.getElementById('outputPrice').innerHTML = valueText;
}

const changedRatingValue = () => {
  let value = document.getElementById('filterRating').value;
  document.getElementById('outputRating').innerHTML = value;

}