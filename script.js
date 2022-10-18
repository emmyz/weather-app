const container = document.querySelector(".container");
const inputSection = container.querySelector(".section-input");
const inputTxt = inputSection.querySelector(".input-text");
const inputField = inputSection.querySelector("input");
const locationBtn = inputSection.querySelector("button");
let weatherImg = container.querySelector(".section-weather img");
let backBtn = container.querySelector("header i");
const APIKEY = 'c667833baa6402e4652d4ae15ed4a5cb';
let api;

inputField.addEventListener("keyup", e =>{
   
    if(e.key=="Enter" && inputField.value!=""){
        requestApiWithCity(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    //if browser support geolocation api
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser does not support geolocation api");
    }
});

backBtn.addEventListener("click", ()=>{
    container.classList.remove("active");
});

function onSuccess(position){
    //request api with lat and lon
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`;
    fetchData();
}

function onError(error){
    inputTxt.innerHTML = error.message;
    inputTxt.classList.add("error");
}

function requestApiWithCity(city){
    api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`;
    fetchData();
}

function fetchData(){
    inputTxt.innerHTML = "Getting weather details...";
    inputTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => getWeatherDetails(result));
}

function getWeatherDetails(details){
    if(details.cod == "404"){
        inputTxt.innerHTML = `${inputField.value} is not a valid city name`;
        inputTxt.classList.replace("pending","error");
    }else{
        const city = details.name;
        const country = details.sys.country;
        const {description,id} = details.weather[0];
        const {feels_like, humidity, temp} = details.main;

        if(id == 800){
            weatherImg.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            weatherImg.src = "icons/storm.svg";
        }else if(id >= 600 && id <= 622){
            weatherImg.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            weatherImg.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            weatherImg.src = "icons/cloud.svg";
        }else if((id>=300 && id<=321) || (id>=500 && id<=531)){
            weatherImg.src = "icons/rain.svg";
        }

        container.querySelector(".temp .num").innerHTML = Math.floor(temp);
        container.querySelector(".weather").innerHTML = description;
        container.querySelector(".location span").innerHTML = `${city}, ${country}`;
        container.querySelector(".temp .num2").innerHTML = Math.floor(feels_like);
        container.querySelector(".humidity span").innerHTML = `${humidity}%`;

        inputTxt.classList.remove("pending","error");
        container.classList.add("active");

        inputTxt.innerHTML = "";
        inputField.value = "";
    }
}

