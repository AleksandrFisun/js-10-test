import './css/styles.css';
import cardsCountry from './template/country.hbs';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
//
const inputCounrty = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const sectionAllCardCountry = document.querySelector('.country-info');
const titleAllCountries = document.querySelector(
  '.title__all-countries-invisible'
);
//
const DEBOUNCE_DELAY = 300;

function searchCoutry(e) {
  const country = e.target.value.trim();
  if (!country || country === ``) {
    clearCountry();
    Notiflix.Notify.info('Please enter more characters.');
  }
  fetchCountries(country)
    .then(data => {
      if (data.status === 404) {
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
        clearCountry();
      }
      creationMarkup(data);
      createAllCountryMarkup(data);
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}

function creationMarkup(countries) {
  if (countries.length > 10) {
    clearCountry();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length < 10 && countries.length >= 2) {
    clearCountry();
    const createCountry = countries
      .map(
        countries => `
  <li>
  <img src="${countries.flags.svg}" alt="" width ="20">
  <span> ${countries.name.official}</span>
  </li>`
      )
      .join('');
    countryList.insertAdjacentHTML('afterbegin', createCountry);
    return;
  }
  if (countries.length === 1) {
    clearCountry();
    const createCountry = countries
      .map(
        countries =>
          `
    <li>
    <img src="${countries.flags.svg}" alt="" width ="20">
    <span> ${countries.name.official}</span>
    <p>Capital: ${countries.capital}</p>
    <p>Population: ${countries.population}</p>
    <p>Languages: ${Object.values(countries.languages)}</p>
    </li>`
      )
      .join('');
    countryList.insertAdjacentHTML(`afterbegin`, createCountry);
  }
}
function clearCountry() {
  countryList.innerHTML = '';
}
inputCounrty.addEventListener('input', debounce(searchCoutry, DEBOUNCE_DELAY));
// Не касается домашней работы (Подсказка если знаешь только 1 букву =) )
function createAllCountryMarkup(countries) {
  if (countries.length >= 10) {
    sectionAllCardCountry.innerHTML = '';
    titleAllCountries.classList.remove('title__all-countries-invisible');
    titleAllCountries.classList.add('title__all-countries-visible');
    const allCardCountry = cardsCountry(countries);
    sectionAllCardCountry.insertAdjacentHTML('beforeend', allCardCountry);
  } else {
    titleAllCountries.classList.remove('title__all-countries-visible');
    titleAllCountries.classList.add('title__all-countries-invisible');
    sectionAllCardCountry.innerHTML = '';
  }
}
