let movies = [];


function noMoviesDiv() {
    // the second div is to get around the fact that this is all going into `movies-table`
    // which is a grid display. To center the `empty-wishlist` div, it needs to be in the second
    // grid spot , so the first empty div takes up the first spot, putting the info in the second spot
    return `<div></div><div class=empty-wishlist>
        <h1>Your wishlist is empty!</h1>
        <p>Add a movie to your wishlist above to see your wishlist here!</p>
    </div>`
}


window.onload = function() {
    movies = loadMovies();
    let tableContainer = document.getElementById("movie-table");
    tableContainer.innerHTML = `<h1>${movies.length}</h1>`;
    
    if (movies.length === 0) {
        tableContainer.innerHTML =  noMoviesDiv()
    } else {
        updateWishList();
    }
}


function sortWishList(method) {
    if (method === "title") {
        movies.sort((a, b) => 
            a.title > b.title ? 1 : a.title < b.title ? -1 : 0 
        );
    } else if (method === "rating") {
        movies.sort((a, b) => {
            var aRating = parseInt(a.rating)
            var bRating = parseInt(b.rating) 
            return aRating > bRating ? 1 : aRating < bRating ? -1 : 0;
        });
    } else { // method is by genre
        movies.sort((a, b) => 
            a.genre > b.genre ? 1 : a.genre < b.genre ? -1 : 0 
        );
    }
    updateWishList();
}


function filterWishList(genre) {
    
    // allows someone to filter by one genre then another
    // without it returning an empty set (because genres are mutually exclusive)
    let unfilteredMovies = loadMovies();
    movies = []
    if (genre === "All genres") { 
        unfilteredMovies = movies;
        return; 
    }

    switch (genre) {
        case "Action":          { for(let m of unfilteredMovies ) { if(m.genre === "Action")          movies.push(m) } break; }
        case "Animation":       { for(let m of unfilteredMovies ) { if(m.genre === "Animation")       movies.push(m) } break; }
        case "Comedy":          { for(let m of unfilteredMovies ) { if(m.genre === "Comedy")          movies.push(m) } break; }
        case "Drama":           { for(let m of unfilteredMovies ) { if(m.genre === "Drama")           movies.push(m) } break; }
        case "Fantasy":         { for(let m of unfilteredMovies ) { if(m.genre === "Fantasy")         movies.push(m) } break; }
        case "History":         { for(let m of unfilteredMovies ) { if(m.genre === "History")         movies.push(m) } break; }
        case "Horror":          { for(let m of unfilteredMovies ) { if(m.genre === "Horror")          movies.push(m) } break; }
        case "Romance":         { for(let m of unfilteredMovies ) { if(m.genre === "Romance")         movies.push(m) } break; }
        case "Science Fiction": { for(let m of unfilteredMovies ) { if(m.genre === "Science Fiction") movies.push(m) } break; }
        case "Thriller":        { for(let m of unfilteredMovies ) { if(m.genre === "Thriller")        movies.push(m) } break; }
        case "Western":         { for(let m of unfilteredMovies ) { if(m.genre === "Western")         movies.push(m) } break; }
    }
    updateWishList();
}


/// for debuging purposes
function clearWatchlist() {
    localStorage.removeItem('data');

    // clear display
    let tableContainer = document.getElementById("movie-table");
    tableContainer.innerHTML = noMoviesDiv();
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
        genre:   document.getElementById("movie-genre").value,
        rating:  "3",
        watched: false
    });

    document.getElementById("new-movie").reset();
    save();
    updateWishList();
}


/// styles the list of movies into an html table
function updateWishList() {

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