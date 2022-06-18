const API_KEY = '21ee2a95-6271-421f-9032-0af958c10d32';
const ALL_GENRES = [{
    genre: "комедия", id: '13'
},
{
    genre: "боевик", id: '11'
},
{
    genre: "приключения", id: '7'
},
{
    genre: "триллер", id: '1'
},
{
    genre: "детектив", id: '5'
},
{
    genre: "драма", id: '2'
},
{
    genre: "мелодрама", id: '4'
},
{
    genre: "фантастика", id: '6'
},
{
    genre: "вестерн", id: '10'
},
{
    genre: "криминал", id: '3'
},
{
    genre: "ужасы", id: '17'
},
{
    genre: "документальные", id: '22'
},
{
    genre: "семейные", id: '19'
},
{
    genre: "фэнтези", id: '12'
},
{
    genre: "военные", id: '14'
},
{
    genre: "биография", id: '8'
},
{
    genre: "фильм-нуар", id: '9'
},
{
    genre: "исторический", id: '15'
},
{
    genre: "музыкальный", id: '16'
},
{
    genre: "мультфильм", id: '18'
},
{
    genre: "мюзикл", id: '20'
},
{
    genre: "спорт", id: '21'
},
{
    genre: "короткометражка", id: '23'
},
{
    genre: "анимэ", id: '24'
},

    
]


const baseUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/';
const moviesConteiner = document.querySelector('.movies-conteiner');

const paginationConteiner = document.querySelector('.pagination');

let currentUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS';
const genreSelector = document.getElementById('genre-select');

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
    currentUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=${selectedGenre}&order=RATING&type=FILM&ratingFrom=6&ratingTo=10&yearFrom=2010&yearTo=2010`    
    currentFields = filterMovieFilds;
    getMovies(`${currentUrl}&page=1`, currentFields);
})


const fillGenreSelector = () => {
    genreSelector.innerHTML = '';
    ALL_GENRES.forEach(element => {
        genreSelector.innerHTML += `<option value=${element.id}>${element.genre}</option>`
        
    })
    
} 
fillGenreSelector();