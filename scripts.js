let movies = [];


function noMoviesDiv() {
    return `<div class=empty-wishlist>
        <h1>Your wishlist is empty!</h1>
        <p>add a movie to your wishlist above to see your wishlist here!</p>
    </div>`
}


window.onload = function() {
    movies = loadMovies();
    let tableContainer = document.getElementById("movie-table");
    tableContainer.innerHTML = `<h1>${movies.length}</h1>`;
    
    if (movies.length === 0) {
        tableContainer.innerHTML =  noMoviesDiv()
    } else {
        setMovieTable();
    }
}



/// for debuging purposes
function clearWatchlist() {
    localStorage.removeItem('data');

    // clear display
    let tableContainer = document.getElementById("movie-table");
    tableContainer.innerHTML = `<h1>No movies wishlisted yet!</h1><p>Add a movie to your wishlist to see them appear here.</p>`;
}

function save() {
    localStorage.setItem('data', JSON.stringify(movies));
}

function loadMovies() {
    const data = localStorage.getItem('data');
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}


function newMovie(event) {
    event.preventDefault();

    var userRating = document.querySelector('input[name="rating"]:checked')?.value;
    if (userRating === undefined) { userRating = "N/A"; }

    // movies.push({
    //     title:   document.getElementById("movie-name").value,
    //     genre:   document.getElementById("movie-genre").value,
    //     rating:  userRating,
    //     watched: false       
    // });

    movies.push({
        title:   "Sample Title",
        genre:   "Sample Genre",
        rating:  "5",
        watched: false
    });

    document.getElementById("new-movie").reset();
    save();
    setMovieTable();
}


/// styles the list of movies into an html table
function setMovieTable() {

    var movieCards = ""

    for(let movie of movies) { movieCards += toCard(movie); }

    document.getElementById("movie-table").innerHTML = movieCards;
}


function toCard(movie) {
    return `<div class="movie-card">
        <h2>${movie.title}</h2>
        <p>${movie.rating}</p>
        <span class=rating>${movie.genre}</span>    
    </div>
    `;
}