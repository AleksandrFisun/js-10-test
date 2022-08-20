import './css/styles.css';
import listCountries from './template/list-countries.hbs';
import cardsCountry from './template/country.hbs';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
refs = {
  inputCounrty: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
};
const DEBOUNCE_DELAY = 300;

function searchCoutry(e) {
  const country = e.target.value.trim();
  if (!country || country === ``) {
    clearCountry();
  }
  fetchCountries(country)
    .then(data => {
      if (data.status === 404) {
        clearCountry();
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
        return;
      }
      creationMarkup(data);
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
    refs.countryList.insertAdjacentHTML('afterbegin', countriesInfo);
    return;
  }
  if (country.length === 1) {
    clearCountry();
    const counrryInfo = cardsCountry(country);
    refs.countryList.insertAdjacentHTML('afterbegin', counrryInfo);
    return;
  }
}
function clearCountry() {
  refs.countryList.innerHTML = '';
}
refs.inputCounrty = addEventListener(
  'input',
  debounce(searchCoutry, DEBOUNCE_DELAY)
);
