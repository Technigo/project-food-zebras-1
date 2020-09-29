const restaurants = document.getElementsByClassName('restaurant');
const apiData = `https://developers.zomato.com/api/v2.1/search?entity_id=64&entity_type=city&count=20&cuisines=89`
const apiKey = `6fe7eca07d46a86fc9db6690648ba3df`
const request = new Request(apiData, {
  headers: new Headers({
    Accept: 'application/json', 
    'user-key': apiKey
  })
})
const fetchRestaurants = () => {
  fetch(request) //we use the request object and pass it in to the fetch-function (instead of the URL)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log(json);
      //map
      const newArray = json.restaurants.map(restaurantInformation)
      // document.querySelector('.rest-name').innerHTML += restName
      // document.querySelector('.rest-address').innerHTML += restAddress
      console.log(newArray)
    newArray.forEach(renderHTML)
    })
}
fetchRestaurants();
const restaurantInformation = (information) => {
  const restaurantName = information.restaurant.name
  const restaurantAddress = information.restaurant.location.address
  const averageCost = information.restaurant.average_cost_for_two 
  const averageRating = information.restaurant.user_rating.aggregate_rating
  const image = information.restaurant.featured_image
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
    restaurantSection += `</div>`; restaurantSection += `</section>`; 
    document.getElementById("mainContent").innerHTML += restaurantSection; 
}