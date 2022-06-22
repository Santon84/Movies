import { ALL_GENRES } from "./values";
const API_KEY = '21ee2a95-6271-421f-9032-0af958c10d32';



const baseUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/';
const moviesConteiner = document.querySelector('.movies-conteiner');

const paginationConteiner = document.querySelector('.pagination');

let currentUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS';
const genreSelector = document.getElementById('genre-select');
const yearSelector = document.getElementById('year-select');
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
    rating:'rating',
    nameRu: 'nameRu',
    year: 'year',
    genre: 'genres',
    posterUrl: 'posterUrlPreview',
    pageCount: 'pagesCount'

})
const filterMovieFilds = new fieldsConstructor({
    id: 'kinopoiskId',
    array: 'items',
    rating:'ratingKinopoisk',
    nameRu: 'nameRu',
    year: 'year',
    genre: 'genres',
    posterUrl: 'posterUrlPreview',
    pageCount: 'totalPages',
    nameOrig: 'nameOriginal'


})

let currentFields = topMovieFilds;

const prerenderPage = () => {
    moviesConteiner.innerHTML = "";
    for (i=0; i<12; i++) {
        moviesConteiner.innerHTML +=  `<div class="movie">
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
            'X-API-KEY': '21ee2a95-6271-421f-9032-0af958c10d32',
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    renderMovies(data, fields);
    renderPagination(data[fields.pageCount]);
    console.log(data);
    
   
    
}


const renderMovies = (movies, fields) => {
    
    moviesConteiner.innerHTML = "";
    movies[fields.array].forEach(movie => {
    console.log(movie[fields.nameRu] ?? movie[fields.nameOrig]);
    moviesConteiner.innerHTML += `
    <div class="movie" data-id=${movie[fields.id]}>
        <img class="movie-preview-poster" src="${movie[fields.posterUrl]}" alt="${movie[fields.nameRu] ?? movie[fields.nameOrig]}">
        <p class="movie-title">${movie[fields.nameRu] ?? movie[fields.nameOrig]}</p>
        <p class="movie-genre">${movie[fields.year]}, ${movie[fields.genre].map(genre => genre.genre).join(', ')}</p> 
        <div class="movie-rating">${movie[fields.rating]}</div>
    </div>
    `
    })
   
}



const renderPagination = (pagesNum = 0) => {

    paginationConteiner.innerHTML = "";
    for (i=1; i<=pagesNum; i++){
        paginationConteiner.innerHTML += `<div class="page">${i}</div>`
    }

    const pages = paginationConteiner.querySelectorAll('.page');

    pages.forEach(page => {

       page.addEventListener('click', function() {
        getMovies(`${currentUrl}&page=${page.innerHTML}`,currentFields);

       }) 
    })

}

const buttonFilter = document.querySelector('.button-select');
    buttonFilter.addEventListener('click', function() {
    let selectedGenre = genreSelector.options[genreSelector.selectedIndex].value;
    let selectedYear = yearSelector.options[yearSelector.selectedIndex].value;
    
    currentUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=${selectedGenre}&order=RATING&type=FILM&ratingFrom=6&ratingTo=10&yearFrom=${selectedYear}&yearTo=${selectedYear}`    
    currentFields = filterMovieFilds;
    getMovies(`${currentUrl}&page=1`, currentFields);
})


const fillGenreSelector = () => {
    genreSelector.innerHTML = '';
    ALL_GENRES.forEach(element => {
        genreSelector.innerHTML += `<option value=${element.id}>${element.genre}</option>`
        
    })
    
} 
const fillYearSelector = () => {
    yearSelector.innerHTML = '';
    const yearNow = new Date().getFullYear();
    const yearStart = 1950;

    for (i=yearNow; i>=yearStart;i--){
        yearSelector.innerHTML += `<option>${i}</option>`

    }

}
fillGenreSelector();
fillYearSelector()