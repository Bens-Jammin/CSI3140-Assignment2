let movies = [];
let nextMovieID = 0; //IDs for movie entries to identify individual wishlist cards
let newRating = 0;
let editRating = 0;

function noMoviesDiv() { //display when there are no movies in the wishlist
    return `<div></div><div class=empty-wishlist>
        <h1>Your wishlist is empty!</h1>
        <p>Add a movie to your wishlist above to see your wishlist here!</p>
    </div>`
}

window.onload = function() { //loading saved movies into the movie table (may be empty)
    movies = loadMovies();
    let tableContainer = document.getElementById("movie-table");
    //tableContainer.innerHTML = `<h1>${movies.length}</h1>`;
    
    if (movies.length === 0) {
        tableContainer.innerHTML =  noMoviesDiv();
    } else {
        updateWishList();
    }
}

function sortWishList(method) { //sort by title, rating or genre then update wishlist based on sorting
    if (method === "title") {
        movies.sort((a, b) =>
            a.title > b.title ? 1 : a.title < b.title ? -1 : 0
        );
    } else if (method === "rating") {
        movies.sort((a, b) => {
            var aRating = parseInt(a.rating)
            var bRating = parseInt(b.rating) 
            return aRating < bRating ? 1 : aRating > bRating ? -1 : 0;
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
    movies = [];
    if (genre === "All Genres") {
        movies = unfilteredMovies;
        updateWishList();
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
    localStorage.removeItem('id');
    movies = [];
    nextMovieID = 0;
    newRating = 0;
    editRating = 0;

    // clear display
    let tableContainer = document.getElementById("movie-table");
    tableContainer.innerHTML = noMoviesDiv();
}

function save() { //saves the next ID and all movies into local storage
    localStorage.setItem('id', nextMovieID);
    localStorage.setItem('data', JSON.stringify(movies));
}

function loadMovies() {
    const id = localStorage.getItem("id");
    if (id !== null) {
        nextMovieID = id;
    } //establish the ID for the next movie entry

    const data = localStorage.getItem('data'); //load all movie entries
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}


function newMovie(event) {
    event.preventDefault();

    movies.push({ //creating new movie entry
        id: nextMovieID,
        title:   document.getElementById("movie-name").value,
        genre:   document.getElementById("movie-genre").value,
        rating:  newRating,
        watched: false
    });

    nextMovieID++; //establishing the next new ID
    document.getElementById("new-movie").reset(); //resetting new movie fields
    newRating = 0;
    setActiveRating(0, 'new');
    save();
    updateWishList();
}


/// styles the list of movies into an html table
function updateWishList() {

    var movieCards = "";

    for(let movie of movies) { movieCards += toCard(movie); }

    document.getElementById("movie-table").innerHTML = movieCards;
}


function toCard(movie) { //create the 'card' representation for each movie entry
    return `
    <div class="movie-card" id="movie-${movie.id}">
        <div class="header">
            <h2>${movie.title}</h2>
            <div class="icons">
                <button id="edit" class="icon-container">✎</button>
                <button id="watched" class="icon-container ${movie.watched ? 'active':''}">✔</button>
                <button id="remove" class="icon-container">✘</button>
            </div>
        </div>
        <div class="rating">
            ${'<span class="star active">★</span>'.repeat(movie.rating)}${'<span class="star">★</span>'.repeat(5-movie.rating)}
        </div>
        <span class="genre-tag">${movie.genre}</span>
    </div>
    `;
}

function editMovie(event) { //handling one of the three buttons on each card in the wishlist
    if (event.target.nodeName !== 'BUTTON') return
    var cardEl = event.target.closest('.movie-card');
    var movieID = cardEl?.id.match(/movie-(\d+)/)[1];
    let buttonType = event.target.id;

    if (buttonType == 'watched') {addWatchedMovie(movieID); }
    else if (buttonType == 'remove') {removeMovie(movieID); }
    else if (buttonType == 'edit') {openEditMovieModal(movieID); }
}

function removeMovie(id) { //remove card by filtering
    movies = movies.filter((movie) => movie.id != id);
    save();
    updateWishList();
}

function addWatchedMovie(id) { //toggle the movie.watched property for the specific movie entry
    movies.forEach((movie) => {
        if (movie.id == id) {
            movie.watched = !movie.watched;
        }
    })
    save();
    updateWishList();
}

function openEditMovieModal(id) {
    let movie = movies.find((movie) => movie.id == id);

    const dialog = document.getElementById("editMovieModal");

    //building the modal
    dialog.innerHTML = `
    <div class="edit-movie movie-form">
        <h2>Edit Entry</h2>
        <form id="edit-movie">
            <div class="input-fields">
                <div class="input-package">
                    <label for="movie-name">Movie Title:</label>
                    <input type="text" id="movie-name" placeholder="Movie title" value="${movie.title}" required>
                </div>

                <div class="input-package">
                    <label for="movie-genre">Genre: </label>
                    <select id="movie-genre" name="genre" value="${movie.genre}">
                        <option value="Action" ${movie.genre === 'Action' ? 'selected' : ''}>Action</option>
                        <option value="Animation" ${movie.genre === 'Animation' ? 'selected' : ''}>Animation</option>
                        <option value="Comedy" ${movie.genre === 'Comedy' ? 'selected' : ''}>Comedy</option>
                        <option value="Drama" ${movie.genre === 'Drama' ? 'selected' : ''}>Drama</option>
                        <option value="Fantasy" ${movie.genre === 'Fantasy' ? 'selected' : ''}>Fantasy</option>
                        <option value="History" ${movie.genre === 'History' ? 'selected' : ''}>History</option>
                        <option value="Horror" ${movie.genre === 'Horror' ? 'selected' : ''}>Horror</option>
                        <option value="Romance" ${movie.genre === 'Romance' ? 'selected' : ''}>Romance</option>
                        <option value="Science Fiction" ${movie.genre === 'Science Fiction' ? 'selected' : ''}>Science Fiction</option>
                        <option value="Thriller" ${movie.genre === 'Thriller' ? 'selected' : ''}>Thriller</option>
                        <option value="Western" ${movie.genre === 'Western' ? 'selected' : ''}>Western</option>
                    </select>
                </div>

                <div class="input-package" onclick="updateRating(event, 'edit')" onmouseover="ratingButtonHovered(event, 'edit')" onmouseout="resetRatingHover('edit')">
                    <span>Rating: </span>
                    <button id="movie-rating1" class="rating-button star">★</button>
                    <button id="movie-rating2" class="rating-button star">★</button>
                    <button id="movie-rating3" class="rating-button star">★</button>
                    <button id="movie-rating4" class="rating-button star">★</button>
                    <button id="movie-rating5" class="rating-button star">★</button>
                </div>
            </div>

            <div class="modal-buttons">
                <button type="submit" class="submit-button">Save</button>
                <button id="close-button" class="submit-button">Close</button>
            </div>
        </form>
    </div>
    `;

    //adding the handler for the close button
    const closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
    });

    //addling the handler for the save button
    const editForm = document.getElementById("edit-movie");
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        movie.title = document.querySelector("#edit-movie #movie-name").value;
        movie.genre = document.querySelector("#edit-movie #movie-genre").value;
        movie.rating = editRating;

        save();
        updateWishList();
        dialog.close();
    });

    editRating = movie.rating;
    setActiveRating(editRating, 'edit');

    dialog.showModal();
}

function updateRating(event, formType) {
    event.preventDefault();
    var value = event.target.id.charAt(event.target.id.length -1);
    //using the last char in the ID of the rating star buttons as the rating value
    if (formType == 'new') {
        newRating = value;
        return
    }
    editRating = value;
}

function resetRatingHover(formType) {
    setActiveRating(formType == 'new' ? newRating : editRating, formType);
}

function ratingButtonHovered(event, formType) {
    if (event.target.nodeName !== 'BUTTON') return

    var value = event.target.id.charAt(event.target.id.length -1);
    setActiveRating(value, formType);
}

//activates or deactivates stars in relation to the current rating value
function setActiveRating(value, formType) {
    for (let i = 1; i <= 5; i++) {
        let button = document.querySelector(`.${formType}-movie #movie-rating${i}`);
        if (i <= value) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    }
}
