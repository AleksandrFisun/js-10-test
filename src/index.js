import './css/styles.css';
import listCountries from './template/list-countries.hbs';
import cardsCountry from './template/country.hbs';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputCounrty = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const sectionAllCardCountry = document.querySelector('.country-info');
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
        clearCountry();
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
      }
      creationMarkup(data);
      createAllCountryMarkup(data);
    })
    .catch(error => {
      Notiflix.Notify.failure(error);
    });
}

function creationMarkup(country) {
  if (country.length > 10) {
    clearCountry();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (country.length < 10 && country.length >= 2) {
    clearCountry();
    const countriesInfo = listCountries(country);
    countryList.insertAdjacentHTML('afterbegin', countriesInfo);
    return;
  }
  if (country.length === 1) {
    clearCountry();
    const createCountry = country
      .map(
        country =>
          `
<li>
<img src="${country.flags.svg}" alt="" width ="20">
<span> ${country.name.official}</span>
<p>Capital: ${country.capital}</p>
<p>Population: ${country.population}</p>
<p>Languages: ${Object.values(country.languages)}</p>
</li>
`
      )
      .join('');

    countryList.insertAdjacentHTML(`afterbegin`, createCountry);
  }
}
function clearCountry() {
  countryList.innerHTML = '';
}
inputCounrty = addEventListener(
  'input',
  debounce(searchCoutry, DEBOUNCE_DELAY)
);
// Не касается домашней работы
function createAllCountryMarkup(country) {
  if (country.length >= 10) {
    sectionAllCardCountry.innerHTML = '';
    const allCardCountry = cardsCountry(country);
    sectionAllCardCountry.insertAdjacentHTML('beforeend', allCardCountry);
  } else {
    sectionAllCardCountry.innerHTML = '';
  }
}
