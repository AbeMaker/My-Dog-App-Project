//GLOBAL VARIABLES
const randomButton = document.querySelector('.random');
const dogList = document.getElementById('dogDropDown');
const listButton = document.querySelector('.list');
//spinner

//EVENT LISTENERS
// window load
window.addEventListener('load', populateList);
//click and change
randomButton.addEventListener('click', getRandomDog);
dogList.addEventListener('change', getBreedImage);
listButton.addEventListener('click', getBreedImage);

//random dog image
function getRandomDog(){
  fetch('https://dog.ceo/api/breeds/image/random')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => handleData(data))
    .catch(error => notifyUser(error))
}

//populate List
function populateList(){
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => createListItems(data.message))
    .catch(error => notifyUser(error))
}

//getBreedImage
function getBreedImage(){
  //get list value
  let selectedBreed = dogList.options[dogList.selectedIndex].value;
  //build url
  let url = `https://dog.ceo/api/breed/${selectedBreed}/images`;
  //fetch call
  fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(data => getImageURL(data.message))
    .catch(error => console.log(error))
}

//HELPER FUNCTIONS
//checkStatus
function checkStatus(response){
  if(response.ok){
    return Promise.resolve(response);
  }else{
    return Promise.reject(new Error(response.statusText));
  }
}

//display Dog Info
function displayDogInfo(data){
  //populate paragraph
  document.getElementById('dogInfo').innerHTML = `<strong>${capitalize(data[0])}:</strong> ${data[2][0]} <a href="${data[3][0]}" alt="read more on wikipedia"> Read more on wikipedia</a>`;
}

//handleData
function handleData(data){
  let url = data.message;
  console.log(url)
  let regex = /https:\/\/images\.dog\.ceo\/breeds\/(\w+\-?\w+)\/.+/g;
  let breedName = regex.exec(url);
  document.getElementById('randomImageContainer').innerHTML = `<img alt="random image of a ${fixBreed(breedName[1])}" src='${url}'/>`;
  document.querySelector('.dogInfo').innerHTML = `<p class="h5">Random image of a ${fixBreed(breedName[1])}</p>`;
}

//getImageURL
function getImageURL(data){
  //get random number
  let randomNumberURL = data[Math.floor(Math.random()*data.length)+1];
  listImageContainer.innerHTML = `<img src="${randomNumberURL}" alt="${extractBreedName(data)}"/>`;
}

//createListItems
function createListItems(data){
  let output = '';
  Object.keys(data).forEach(key => output+=`<option value="${key}">${fixBreed(key)}</option>`);
  document.getElementById('dogDropDown').innerHTML = output;
}
/*
notifyUser
function notifyUser(error){
  const errorContainer = document.querySelector('.alert');
  errorContainer.innerHTML = `There was an error with the server request (${error}). <br> Try again later.`;
  errorContainer.style.display = 'block';
  setTimeout(()=>{
    errorContainer.innerHTML = '';
    errorContainer.style.display ='none';
  },4000)

}
*/

//fixBreed
function fixBreed(breedName){
  if(breedName === 'germanshepherd'){
    return 'German Shepherd';
  }else if(breedName === 'mexicanhairless'){
    return 'Mexican Hairless';
  }else if(breedName === 'stbernard'){
    return 'St. Bernard';
  }else if(breedName === "african"){
    return 'African Wild Dog';
  }else if(breedName === 'bullterrier'){
    return 'Bull Terier';
  }
  return capitalize(breedName);
}

//capitalize breed name
function capitalize(breedName){
  return breedName.replace(/\-/g,' ')
                  .split(" ")
                  .map(word => word.charAt(0).toUpperCase()+word.slice(1))
				          .join(" ");
}

//extract breed name
function extractBreedName(data){
  let regex = /https:\/\/images\.dog\.ceo\/breeds\/(\w+-?\w+)\/\w+\.\w+/g;
  let match = regex.exec(data);
  return fixBreed(match[1]);
}
