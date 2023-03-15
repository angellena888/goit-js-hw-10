import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const refs = {
    inputForm: document.querySelector('#search-box'),
    listCountry: document.querySelector('.country-list'),
    infoCountry: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.inputForm.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    cleanInput();
    const name = e.target.value.trim();
    if (name === '') {
        return;
    }
    fetchCountries(name)
        .then(name)
        .then(countries => {
            if (countries.length > 10)
            {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            } else {
                if (countries.length === 1) {
                    countryMarkupInfo(countries);
                }
                else {
                    countryMarkupList(countries);
                }
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name.');
        })
        .finally(() => {});
}

function cleanInput() {
  refs.infoCountry.innerHTML = '';
  refs.listCountry.innerHTML = '';
}

function countryMarkupList(name) {
    const markup = name
      
        .map(({ name, flags }) => {
      return `<li>
          <img src="${flags.svg}" 
          alt="${name}" 
          width = "25" 
          height = "15" />
        <span>${name}</span>
    </li>`;
    })
        .join('');
    
  refs.listCountry.innerHTML = markup;
  refs.infoCountry.innerHTML = '';
}

function countryMarkupInfo(name) {
  const markupInfo = name
    
      .map(({ name, flags, capital, population, languages }) => {
      return `
      <img src="${flags.svg}" 
      alt="${name}" 
      width = "25" 
      height = "15" />
      <span>${name}</span>
      
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${languages.map(el => el.name).join(', ')}</p>`;
    })
      .join('');
    
  refs.infoCountry.innerHTML = markupInfo;
  refs.listCountry.innerHTML = '';
}