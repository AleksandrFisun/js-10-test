import './css/styles.css';
import countriesCardMarkup from './template/countries-markup.hbs';
import allCountriesCard from './template/all-countries-card.hbs';
import cardsCountry from './template/country.hbs';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
//Подключение
const inputCounrty = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const sectionAllCardCountry = document.querySelector('.country-info');
const titleAllCountries = document.querySelector(
  '.title__all-countries-invisible'
);
//Задержка
const DEBOUNCE_DELAY = 300;
//
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
  } else if (countries.length < 10 && countries.length >= 2) {
    clearCountry();
    const createCountry = cardsCountry(countries);
    countryList.insertAdjacentHTML('afterbegin', createCountry);
    return;
  } else if (countries.length === 1) {
    clearCountry();
    countriesMarkup = countriesCardMarkup(countries);
    countryList.insertAdjacentHTML(`afterbegin`, countriesMarkup);
  }
}
// Обнуление html разметки
function clearCountry() {
  countryList.innerHTML = '';
}
inputCounrty.addEventListener('input', debounce(searchCoutry, DEBOUNCE_DELAY));
//
// Не касается домашней работы (Список карточек стран более 10)
//
function createAllCountryMarkup(countries) {
  if (countries.length >= 10) {
    sectionAllCardCountry.innerHTML = '';
    titleAllCountries.classList.remove('title__all-countries-invisible');
    titleAllCountries.classList.add('title__all-countries-visible');
    const allCardCountry = allCountriesCard(countries);
    sectionAllCardCountry.insertAdjacentHTML('beforeend', allCardCountry);
  } else {
    titleAllCountries.classList.remove('title__all-countries-visible');
    titleAllCountries.classList.add('title__all-countries-invisible');
    sectionAllCardCountry.innerHTML = '';
  }
}
