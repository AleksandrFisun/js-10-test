import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';
import cardsCountry from './template/country.hbs';
import allCountriesCard from './template/all-countries-card.hbs';
// import countryCardMarkup from './template/countryMarkup.hbs';
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
  }
  if (countries.length < 10 && countries.length >= 2) {
    clearCountry();
    const createCountry = cardsCountry(countries);
    countryList.insertAdjacentHTML('afterbegin', createCountry);
  }
  if (countries.length === 1) {
    clearCountry();
    const countryMarkup = countries
      .map(
        country =>
          `<li>
      <img src="${country.flags.svg}" alt="" width ="20">
      <span> ${country.name.official}</span>
      <p>Capital: ${country.capital}</p>
      <p>Population: ${country.population}</p>
      <p>Languages: ${Object.values(country.languages)}</p>
      </li>
      `
      )
      .join('');
    // (Через handlebars на локал хосте работает а на гите нет, пишет countryMarkup is not defined)
    // countryMarkup = countryCardMarkup(countries);
    countryList.insertAdjacentHTML(`afterbegin`, countryMarkup);
  }
}
// Обнуление html разметки
function clearCountry() {
  countryList.innerHTML = '';
}
inputCounrty.addEventListener('input', debounce(searchCoutry, DEBOUNCE_DELAY));
//
// Не касается домашней работы (Список карточек стран более 10)
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
