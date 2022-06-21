const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoText = inputPart.querySelector('.info-text'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
wIcon = wrapper.querySelector('.weather-part img'),
arrowBack = document.querySelector('header i')

var api;

inputField.addEventListener('keyup', e => {
    if (e.key == 'Enter' && inputField.value != ''){
        requestApi(inputField.value)
    }
})

locationBtn.addEventListener('pointerdown', ()=>{
    if (navigator.geolocation){ // if browser support geolocaiton api
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert('Your browser does not support goelocation api')
    }
})

function onSuccess(position){
    const {latitude, longitude} = position.coords // get lat and lon of the user device from coords object
    const apiKey = '23dfe6c1d36d7adac44fb17ec39633d1'
     api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`

    fetchData()
}
function onError(error){
    infoText.innerText = error.message
    infoText.classList.add('error')
}

function requestApi(city) {
    const apiKey = '23dfe6c1d36d7adac44fb17ec39633d1'
     api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    
    fetchData()
}
function fetchData() {
    infoText.innerText = 'Getting weather details...'
    infoText.classList.add('pending')

    fetch(api).then(response => response.json()).then(result => weatherDetails(result))
}

function weatherDetails(info){
    infoText.classList.replace('pending', 'error')
    if (info.cod == '404'){
        infoText.innerText = `${inputField.value} isn't a valid city name`
    } else {
        const cityName = info.name
        const country = info.sys.country
        const {description, id} = info.weather[0]
        const {feels_like, humidity, temp} = info.main
        const wind = info.wind.speed

        // pass the values to html (view)
        wrapper.querySelector('.temp .number').innerText = ~~temp
        wrapper.querySelector('.weather').innerText = description
        wrapper.querySelector('.location span').innerText = `${cityName}, ${country}`
        wrapper.querySelector('.temp .number-2').innerText = ~~feels_like
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`
        wrapper.querySelector('.wind span').innerText = `${humidity}Km/h`

        // weather icon
        if (id >= 200 && id <= 232){
            wIcon.src = 'images/icons/storm.svg'
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = 'images/icons/rain.svg'
        } else if (id >= 600 && id <= 622){
            wIcon.src = 'images/icons/snow.svg'
        } else if (id >= 701 && id <= 781){
            wIcon.src = 'images/icons/haze.svg'
        } else if (id == 800){
            wIcon.src = 'images/icons/clear.svg'
        } else if (id >= 801 && id <= 804){
            wIcon.src = 'images/icons/cloud.svg'
        }
        infoText.classList.remove('pending', 'error')
        wrapper.classList.add('active')
    }
}

arrowBack.addEventListener('pointerdown', () => {
    wrapper.classList.remove('active')
})