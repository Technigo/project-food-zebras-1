//Flödet för programmet
//När man öppnar siten första gången så ska restauranger hämtas
//Om man ändrar något i selectboxen måste vi också ändra i URLen innan vi gör fetch igen. 

//const restaurants = document.getElementsByClassName('restaurant'); //dont use this

const setUpRequest = (sort, order) => {
  let sortResult = sort
  console.log(sortResult)
  let sortOrder = order
  console.log(sortOrder)
  const apiData = `https://developers.zomato.com/api/v2.1/search?entity_id=64&entity_type=city&count=50&cuisines=89&sort=${sortResult}&order=${sortOrder}`
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
const changedSort = () => {
  const selectedSortBy = document.getElementById('sortBy').value
  const sortOrder = document.getElementById('sortingOrder').value
  fetchRestaurants(selectedSortBy, sortOrder)
  console.log(selectedSortBy)
  console.log(sortOrder)
}

const setDefaultImage = () => {
  return './image/default-image.jpg'
}

 //funktion filterResult som returnerar en filtrerad array
const filterPrice = () => {
  const filteredOnPrice = document.getElementById('filterPrice').value
  console.log(filteredOnPrice)
}

const filterRating = () => {
  const filter
}



const fetchRestaurants = (sort = 'cost', order = 'asc') => {
  console.log(sort, order)
  const requestObject = setUpRequest(sort, order);

  fetch(requestObject) //we use the request object and pass it in to the fetch-function (instead of the URL)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log(json);
      //map
      let newArray = json.restaurants.map(restaurantInformation)
      
      //newArray ska filtreras på rating eller price. Tänkbar funktion är t.ex. array.filter 
      // newArray = newArray.filter(item => item.averageCost < 50);

      // document.querySelector('.rest-name').innerHTML += restName
      // document.querySelector('.rest-address').innerHTML += restAddress
      console.log(newArray)
      //
      document.getElementById("mainContent").innerHTML = ''; 
    newArray.forEach(renderHTML)
    })
}
fetchRestaurants();

const restaurantInformation = (information) => {
  const restaurantName = information.restaurant.name
  const restaurantAddress = information.restaurant.location.address
  const averageCost = information.restaurant.average_cost_for_two 
  const averageRating = information.restaurant.user_rating.aggregate_rating
  let image = information.restaurant.featured_image
  if (image === '') image = setDefaultImage()
  console.log(image)
  const currency = information.restaurant.currency
  //console.log(image);
  return {restaurantName, restaurantAddress, averageRating, averageCost, currency, image}
}

const renderHTML = (restaurantItem, index) => { 
    console.log(restaurantItem, index); 
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

