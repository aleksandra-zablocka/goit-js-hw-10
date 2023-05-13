import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const COUNTRIES_PATH = 'https://restcountries.com/v3.1/name/';
const FILTERS = '?fields=name,capital,population,flags,languages';

searchBox.placeholder = 'Please type a country name';

function clearFields() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function findCountry() {
  const searchTerm = searchBox.value.trim();
  if (searchTerm === '') {
    clearFields();
  }

  fetchCountries(`${COUNTRIES_PATH}${searchTerm}${FILTERS}`).then(countries => {
    if (countries.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
      resultsDiv.innerHTML = '';
      clearFields();
      return;
    }
    if (countries.length === 1) {
      clearFields();
      countryInfo.innerHTML = `<div class="country-info__container">
<h2>${countries[0].name.official}</h2>
<img class="country-info__img" src="${countries[0].flags.svg}" alt="flag of ${
        countries[0].name.official
      }">
<p><b>Capital: </b>${countries[0].capital}</p>
<p><b>Population: </b>${countries[0].population}</p>
<p><b>Languages: </b>${Object.values(countries[0].languages).join(', ')}</p>
</div>
`;
    }

    if (countries.length > 1 && countries.length <= 10) {
      clearFields();
      const markup = countries
        .map(country => {
          return `<li class="country-list__item"><img class="country-list__img" src="${country.flags.svg}" alt="flag of ${country.name.official}">
            <p>${country.name.official}
            </li>`;
        })
        .join('');
      countryList.innerHTML = markup;
    }
  });
}

searchBox.addEventListener('input', debounce(findCountry, DEBOUNCE_DELAY));
