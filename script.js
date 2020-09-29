

const setUpRequests = (sort,order) => {
  let sortResult = sort
  //console.log(sortResult)
  let sortOrder = order
  //console.log(sortOrder)
  let apiData = new Array();
  apiData[0] = `https://developers.zomato.com/api/v2.1/search?entity_id=64&entity_type=city&count=20&cuisines=89&sort=${sortResult}&order=${sortOrder}&start=0`
  apiData[1] = `https://developers.zomato.com/api/v2.1/search?entity_id=64&entity_type=city&count=20&cuisines=89&sort=${sortResult}&order=${sortOrder}&start=20`
  apiData[2] = `https://developers.zomato.com/api/v2.1/search?entity_id=64&entity_type=city&count=20&cuisines=89&sort=${sortResult}&order=${sortOrder}&start=40`
const apiKey = `6fe7eca07d46a86fc9db6690648ba3df`

let request = new Array();
    request[0] = new Request(apiData[0], {
        headers: new Headers({
        Accept: 'application/json', 
        'user-key': apiKey
    })
  })
  request[1] = new Request(apiData[1], {
    headers: new Headers({
    Accept: 'application/json', 
    'user-key': apiKey
})
})
request[2] = new Request(apiData[2], {
  headers: new Headers({
  Accept: 'application/json', 
  'user-key': apiKey
})
})
  return request
}

const fetchAllRestaurants = (sort = 'cost', order='desc',filter = false) =>{
   const request = setUpRequests(sort,order);
  Promise.all([
    fetch(request[0]),
    fetch(request[1]),
    fetch(request[2])
  ]).then(function (responses) {
    // Get a JSON object from each of the responses
    return Promise.all(responses.map(function (response) {
      return response.json();
    }));
  }).then(function (data) {
    
    array1 = data[0].restaurants;
    array2 = data[1].restaurants;
    array3 = data[2].restaurants;
    let allArrays = [].concat(array1, array2, array3);
    console.log(allArrays);

   let newArray = allArrays.map(restaurantInformation);
    if(filter === true){
      newArray = rangeFilter(newArray)
    }
    console.log(newArray)
  
    document.getElementById("mainContent").innerHTML = ''; 
    //newArray.forEach(renderHTML)
    newArray.forEach(renderHTML);
  }).catch(function (error) {
    // if there's an error, log it
    console.log(error);
  });
}
fetchAllRestaurants();

const renderHTML = (restaurantItem, index) => { 
  //console.log(restaurantItem, index); 
  let restaurantSection = `<section class="restaurant">`; 
  restaurantSection += `<div id="pictureContainer" class="picture-container">`; 
  //restaurantSection += `<img class="rest-picture" src="${restaurantItem.image}"/>`; 
  restaurantSection += `</div>`; 
  restaurantSection += `<div class="restaurant-description>`; 
  restaurantSection += `<h1 class="rest-name">Restaurant name ${restaurantItem.restaurantName}</h1>`; 
  restaurantSection += `<p class="rest-address"> Address ${restaurantItem.restaurantAddress}</p>`; 
  restaurantSection += `<p class="rest-average-cost"> Avg Cost ${restaurantItem.averageCost} ${restaurantItem.currency} </p>`; 
  restaurantSection += `<p class="rest-rating"> Rating ${restaurantItem.averageRating}</p>`; 
  restaurantSection += `</div>`; 
  restaurantSection += `</section>`; 
  document.getElementById("mainContent").innerHTML += restaurantSection; 
  let imageURL = "url('" +restaurantItem.image+ "')";
  document.getElementById("pictureContainer").style.backgroundImage= imageURL;
}

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
//function that takes in sorted values 
const applyFilters = () => {
  const selectedSortBy = document.getElementById('sortBy').value
  const sortOrder = document.getElementById('sortingOrder').value
  const filterPriceResult = filterPrice();
  const filterRatingResult = filterRating();
  console.log("In apply filters: ",selectedSortBy,sortOrder,filterPriceResult,filterRatingResult);
  fetchAllRestaurants(selectedSortBy,sortOrder,true);
}

//functin to add a default image to restaurants with no image 
const setDefaultImage = () => {
  return './image/default-image.jpg'
}

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


