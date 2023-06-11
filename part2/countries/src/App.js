import { useState, useEffect } from "react";
import countriesService from "./services/countries";

const Countries = ({ showCountries, search, setSearch, weather, setWeather }) => {
  if (search === '') {
    return;
  }

  if (showCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (showCountries.length === 1) {
    return (
      showCountries.map(country =>
        <DetailCountry country={country} weather={weather} setWeather={setWeather} />
      )
    )
  }

  return (
    showCountries.map(country =>
      <div>
        {country.name.common} &nbsp;
        <button onClick={() => { setSearch(country.name.common) }}>show</button>
      </div>
    )
  )
}

const DetailCountry = ({ country, weather, setWeather }) => {
  useEffect(() => {
    console.log(`getting ${country.capital} weather`)
    countriesService
      .getWeather(country.capital)
      .then(response => {
        setWeather(response)
      })
    console.log(`gettin weather done`)
  }, [])

  // return null if getting weather is not complete yet
  if (weather.length === 0) {
    return null;
  }

  return (
    <>

      <pre>
        {/* {weather} */}
      </pre>

      <h1>{country.name.common}</h1>

      <p>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
      </p>

      <h3>languages: </h3>
      <ul>
        {Object.values(country.languages).map(language => <li>{language}</li>)}
      </ul>

      <img src={country.flags.png} alt="country flag" />

      <h2>Weather in {country.capital}</h2>

      <p>
        <div>temperature {weather.main.temp}</div>
        <div>wind {weather.wind.speed} m/s</div>
      </p>
    </>
  )
}

function App() {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState([])

  useEffect(() => {
    countriesService
      .getAll()
      .then(countriesResponse => {
        setCountries(countriesResponse)
        console.log('getting countries done')
      })
  }, [search])

  const searchHandler = (event) => {
    setSearch(event.target.value)
  }

  const showCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <>
      <form>
        find countries <input value={search} onChange={searchHandler} ></input>
      </form>

      <Countries showCountries={showCountries} search={search} setSearch={setSearch} weather={weather} setWeather={setWeather} />
    </>
  )

}

export default App;
