import axios from "axios";
const baseURL = 'https://studies.cs.helsinki.fi/restcountries'
const openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?`

const getAll = () => {
    const request = axios.get(`${baseURL}/api/all`)
    return request.then(response => response.data)
}

const getWeather = (capital) => {
    const request = axios.get(`${openWeatherURL}q=${capital}&appid=bc2348d1b3a48b98ae771fb0abdfa7df&units=metric`)
    return request.then(response => response.data)
}

export default { getAll, getWeather }