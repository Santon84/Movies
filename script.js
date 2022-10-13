import fillModal from "./modal.js";


const filterTopButton = document.querySelectorAll('.filter-link.top');


const baseUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/';
const moviesConteiner = document.querySelector('.movies-conteiner');
const searchInput = document.querySelector('.search-input');
const paginationConteiner = document.querySelector('.pagination');

let currentUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS';
const genreSelector = document.getElementById('genre-select');
const yearSelector = document.getElementById('year-select');
const countrySelector = document.getElementById('country-select');

class fieldsConstructor {
  constructor(options) {
    this.id = options.id
    this.array = options.array
    this.rating = options.rating
    this.nameRu = options.nameRu
    this.nameOrig = options.nameOrig
    this.year = options.year
    this.genre = options.genre
    this.posterUrl = options.posterUrl
    this.pageCount = options.pageCount
  }

}

const topMovieFilds = new fieldsConstructor({
  id: 'filmId',
  array: 'films',
  rating: 'rating',
  nameRu: 'nameRu',
  year: 'year',
  genre: 'genres',
  posterUrl: 'posterUrlPreview',
  pageCount: 'pagesCount'

})
const filterMovieFilds = new fieldsConstructor({
  id: 'kinopoiskId',
  array: 'items',
  rating: 'ratingKinopoisk',
  nameRu: 'nameRu',
  year: 'year',
  genre: 'genres',
  posterUrl: 'posterUrlPreview',
  pageCount: 'totalPages',
  nameOrig: 'nameOriginal'


})

let currentFields = topMovieFilds;


const addEventHover = () => {

  const hoverElements = document.querySelectorAll('.movie');


  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function (e) {

      getMoveInfo(element.dataset.id);


    })



  })
}

const addEventMovieClick = () => {

  const clickElements = document.querySelectorAll('.movie');


  clickElements.forEach(element => {
    element.addEventListener('click', function (e) {

      getMoveInfo(element.dataset.id);


    })
  })
}


const prerenderPage = () => {
  moviesConteiner.innerHTML = "";
  for (let i = 0; i < 12; i++) {
    moviesConteiner.innerHTML += `<div class="movie">
            <img class="movie-preview-poster skeleton" alt="">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>`
  }

}
getMovies(`${currentUrl}&page=1`, currentFields);
async function getMovies(url, fields) {

  prerenderPage();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json();
  console.log(data);
  renderMovies(data, fields);
  if (data[fields.array].length > 0) {
    renderPagination(data[fields.pageCount]);

  } else {
    renderPagination(0);
  }


}


const renderMovies = (movies, fields) => {

  if (movies[fields.array].length === 0) {
    moviesConteiner.innerHTML = "Поиск не дал результатов";
    return;
  }

  moviesConteiner.innerHTML = "";
  movies[fields.array].forEach(movie => {
    moviesConteiner.innerHTML += `
    <div class="movie" data-id=${movie[fields.id]}>
        <img class="movie-preview-poster" src="${movie[fields.posterUrl]}" alt="${movie[fields.nameRu] ?? movie[fields.nameOrig]}">
        <p class="movie-title">${movie[fields.nameRu] ?? movie[fields.nameOrig]}</p>
        <p class="movie-genre">${movie[fields.year] || ''}, ${movie[fields.genre].map(genre => genre.genre).join(', ')}</p> 
        <div class="movie-rating">${movie[fields.rating] || ''}</div>
    </div>
    `
  })
  // addEventHover();
  addEventMovieClick();

}



const renderPagination = (pagesNum = 0) => {
  console.log('pages:' + pagesNum);
  paginationConteiner.innerHTML = "";
  if (pagesNum === 0) {
    return
  }
  for (let i = 1; i <= pagesNum; i++) {
    paginationConteiner.innerHTML += `<div class="page">${i}</div>`
  }

  const pages = paginationConteiner.querySelectorAll('.page');

  pages.forEach(page => {

    page.addEventListener('click', function () {
      getMovies(`${currentUrl}&page=${page.innerHTML}`, currentFields);

    })
  })

}

const buttonFilter = document.querySelector('.button-select');
buttonFilter.addEventListener('click', function () {
  let selectedGenre = genreSelector.options[genreSelector.selectedIndex].value;
  let selectedYear = yearSelector.options[yearSelector.selectedIndex].value;
  let selectedCountry = countrySelector.options[countrySelector.selectedIndex].value;

  let yearStart = 1950;
  let yearEnd = new Date().getFullYear();
  let countryLine = '';


  if (selectedYear.length > 8) {
    const years = selectedYear.split(' - ');
    yearStart = years[0];
    yearEnd = years[1];

  }
  if (selectedYear.length === 4) {

    yearStart = selectedYear;
    yearEnd = selectedYear;
  }

  if (Number(selectedCountry) > 0) {
    countryLine = `countries=${selectedCountry}&`
    console.log(countryLine);
  }

  // ?countries=1

  currentUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films?${countryLine}genres=${selectedGenre}&order=RATING&type=FILM&ratingFrom=6&ratingTo=10&yearFrom=${yearStart}&yearTo=${yearEnd}`
  console.log(currentUrl);
  currentFields = filterMovieFilds;
  getMovies(`${currentUrl}&page=1`, currentFields);
})

//top search
const searchMovie = (value) => {



  const searchText = value;
  currentUrl = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${searchText}`
  currentFields = topMovieFilds;
  getMovies(`${currentUrl}&page=1`, currentFields);



}


// filling the selectors
const fillGenreSelector = () => {
  genreSelector.innerHTML = '';
  ALL_GENRES.forEach(element => {
    genreSelector.innerHTML += `<option value=${element.id}>${element.genre}</option>`

  })

}
const fillCountrySelector = () => {
  countrySelector.innerHTML = `<option>Все страны</option>`;
  ALL_COUNTRIES.forEach(element => {
    countrySelector.innerHTML += `<option value=${element.id}>${element.country}</option>`

  })

}

const fillYearSelector = () => {
  yearSelector.innerHTML = `<option>Все года</option>`;
  yearSelector.innerHTML += `<option>2010 - 2020</option>`;
  yearSelector.innerHTML += `<option>2000 - 2010</option>`;
  const yearNow = new Date().getFullYear();
  const yearStart = 1950;

  for (let i = yearNow; i >= yearStart; i--) {
    yearSelector.innerHTML += `<option>${i}</option>`

  }

}
fillGenreSelector();
fillYearSelector();
fillCountrySelector();

filterTopButton.forEach(button => {

  button.addEventListener('click', function (e) {
    e.preventDefault();
    const activeClass = 'filter-link__active';
    filterTopButton.forEach(btn => {
      if (btn.classList.contains(activeClass)) {
        btn.classList.remove(activeClass)
      }
    })
    button.classList.add(activeClass);


    currentUrl = TOP_MOVIES[button.dataset.url];
    currentFields = topMovieFilds;
    getMovies(`${currentUrl}&page=1`, currentFields);



  })

})


searchInput.addEventListener('keypress', function (e) {

  if (e.key === 'Enter') {
    e.preventDefault();
    if (searchInput.value) {
      searchMovie(searchInput.value);
    }
  }

})



async function getMoveInfo(id) {
  const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/' + id;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json();
  const renderData = {};
  renderData.descr = data.description;
  renderData.title = data.nameRu;
  renderData.src = data.posterUrlPreview;

  fillModal('.modal_image','.modal_title','.modal_descr','',renderData)
  console.log(data);
}


document.getElementById('modal-movie-close-btn').addEventListener('click', (e) => {

  const modal = e.target.parentElement.parentElement;

  modal.classList.remove('show');
  modal.classList.add('hide');
  console.log(e.target.parentElement);
  document.getElementsByTagName("body")[0].style.overflowY = "auto";
})

document.querySelector('.modal').addEventListener('click', (e) => {

  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
    e.target.classList.add('hide');
    document.getElementsByTagName("body")[0].style.overflowY = "auto";
  }
  

})