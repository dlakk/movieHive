document.addEventListener("DOMContentLoaded", async () => {
  const movieDetailsContainer = document.getElementById(
    "movie-details-container"
  );
  const relatedMoviesContainer = document.getElementById(
    "related-movies-container"
  );
  const queryParams = new URLSearchParams(window.location.search);
  const movieId = queryParams.get("id");

  if (!movieId) {
    movieDetailsContainer.innerHTML = "<p>Movie ID not found.</p>";
    return;
  }

  // Fetch Movie Details
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=5e5b8093e7d7736405fb91d83905aaab&append_to_response=credits,external_ids`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    // Check if poster path exists
    const posterPath = data.poster_path
      ? `https://image.tmdb.org/t/p/w1280${data.poster_path}`
      : "path/to/default-image.jpg"; // Replace with a default image

    // Populate Movie Details
    document.getElementById("movie-title").textContent = data.title;
    document.getElementById("movie-poster").src = posterPath;
    document.getElementById("movie-overview").textContent = data.overview;

    const runtime = data.runtime || 0;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    document.getElementById("movie-time").textContent = `${hours}h ${minutes}m`;
    document.getElementById("movie-rating").textContent =
      data.vote_average.toFixed(1) || "N/A";
    document.getElementById("release-date").textContent =
      data.release_date || "Unknown";

    const movieDetails = document.querySelector(".movie-details");
    movieDetails.style.backgroundImage = `url(${posterPath})`;

    // Populate Genres
    const genresList = document.getElementById("movie-genres");
    genresList.innerHTML = data.genres
      .map((genre) => `<li>${genre.name}</li>`)
      .join("|");

    // Ratings
    const pgRating = data.adult ? "🔞" : "👨‍👩‍👧‍👦";
    document.getElementById("movie-pg").innerHTML = pgRating;

    // feedback on ratings
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const feedback = document.getElementById("feedback");

  ratingInputs.forEach((input) =>{ 
    input.addEventListener("change", (event) => {
      const rating = event.target.value; // Get selected rating value

      // Display feedback based on rating
      if (rating == 5) {
        feedback.textContent = "I love it🥰";
      } else if (rating == 4) {
        feedback.textContent = "I like it😊";
      } else if (rating == 3) {
        feedback.textContent = "I somewhat like it🤗";
      } else if (rating == 2) {
        feedback.textContent = "It's okay🙂";
      } else if (rating == 1) {
        feedback.textContent = "I don't like it😑";
      }
      feedback.classList.add("visible");
      ratingInputs.forEach((input) => {
        input.disabled = true;
      });
      // setTimeOut to remove the rating feedback and add an appreciation 
      setTimeout(() => {
        feedback.textContent = "Thanks for rating!";
        
        setTimeout(() => {
          feedback.classList.remove("visible");
          setTimeout(()=>{
            feedback.textContent = ""; 
          },1000);
        }, 3000); 
      }, 3000);
    
    });
  });

    // Social Links
    const externalIds = data.external_ids || {};
    const facebookLink = document.getElementById("facebook-link");
    const twitterLink = document.getElementById("twitter-link");
    const instagramLink = document.getElementById("instagram-link");
    const homepageLink = document.getElementById("homepage-link");

    facebookLink.href = externalIds.facebook_id
      ? `https://www.facebook.com/${externalIds.facebook_id}`
      : "#";
    twitterLink.href = externalIds.twitter_id
      ? `https://twitter.com/${externalIds.twitter_id}`
      : "#";
    instagramLink.href = externalIds.instagram_id
      ? `https://instagram.com/${externalIds.instagram_id}`
      : "#";
    homepageLink.href = data.homepage || "#";

    // Hide links if IDs are missing
    if (!externalIds.facebook_id) facebookLink.style.display = "none";
    if (!externalIds.twitter_id) twitterLink.style.display = "none";
    if (!externalIds.instagram_id) instagramLink.style.display = "none";
    if (!data.homepage) homepageLink.style.display = "none";

    // Populate Cast
    const castContainer = document.getElementById("movie-cast");
    const castMembers = data.credits.cast.slice(0, 7);
    castContainer.innerHTML = castMembers
      .map(
        (member) => `
      <div class="cast-member">
        <img src="https://image.tmdb.org/t/p/w185${
          member.profile_path || ""
        }" alt="${member.name}" 
        loading="lazy"
        class="cast-img" data-name="${member.name}">
        <p>${member.name}</p>
      </div>
    `
      )
      .join("");
    const fullCastButton = document.getElementById("to-cast");

    if (fullCastButton) {
      fullCastButton.addEventListener("click", () => {
        // Redirect to full-cast.html with the movie ID as a query parameter
        window.location.href = `full-cast.html?id=${movieId}`;
      });
    }

    // Add Click Event to Cast Images
    document.querySelectorAll(".cast-img").forEach((img) => {
      img.addEventListener("click", (e) => {
        const actorName = e.target.dataset.name;
        if (actorName) {
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(actorName)}`,
            "_blank"
          );
        }
      });
    });

    // Fetch and Display Related Movies
    const relatedRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=5e5b8093e7d7736405fb91d83905aaab`
    );
    if (!relatedRes.ok) {
      throw new Error(`HTTP error! Status: ${relatedRes.status}`);
    }

    const relatedData = await relatedRes.json();

    if (relatedData.results.length > 0) {
      relatedMoviesContainer.innerHTML = relatedData.results
        .slice(0, 10)
        .map(
          (movie) => `
        <div class="related-movie" data-id="${movie.id}">
          <img src="https://image.tmdb.org/t/p/w185${
            movie.poster_path || ""
          }" alt="${movie.title}"
          loading="lazy">
          <div class="movie-info">
          <p class=""><i class="fa-solid fa-star"></i>${movie.vote_average.toFixed(1)}</p>
          <h3>${movie.title}</h3>
          
          </div>
        </div>
      `
        )
        .join("");

      // Add Click Event to Related Movies
      document.querySelectorAll(".related-movie").forEach((movieDiv) => {
        movieDiv.addEventListener("click", () => {
          const relatedMovieId = movieDiv.dataset.id;
          if (relatedMovieId) {
            window.location.href = `movie-details.html?id=${relatedMovieId}`;
          }
        });
      });
    } else {
      relatedMoviesContainer.innerHTML = "<p>No related movies found.</p>";
    }
    
let isDown = false;
let startX;
let scrollLeft;

// Mouse down event
relatedMoviesContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - relatedMoviesContainer.offsetLeft;
  scrollLeft = relatedMoviesContainer.scrollLeft;
});

// Mouse leave event
relatedMoviesContainer.addEventListener("mouseleave", () => {
  isDown = false;
});

// Mouse up event
relatedMoviesContainer.addEventListener("mouseup", () => {
  isDown = false;
});

// Mouse move event
relatedMoviesContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - relatedMoviesContainer.offsetLeft;
  const walk = (x - startX) * 2; // Increase scroll sensitivity
  relatedMoviesContainer.scrollLeft = scrollLeft - walk;
});

  } catch (error) {
    console.error("Error fetching movie details or related movies:", error);
    movieDetailsContainer.innerHTML =
      "<p>Unable to fetch movie details. Please try again later.</p>";
  }
});
