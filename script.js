export async function fetchSuggestions(query) {
  const apiKey = "5e5b8093e7d7736405fb91d83905aaab";
  try {
    const [movieRes, tvShowsRes, peopleRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
      ),
      fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}`
      ),
      fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}`
      ),
    ]);
    const movieData = await movieRes.json();
    const tvShowsData = await tvShowsRes.json();
    const peopleData = await peopleRes.json();
    // Call the displaySuggestions function
    displaySuggestions(
      movieData.results,
      tvShowsData.results,
      peopleData.results
    );
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

export function displaySuggestions(movies, tvShows, people) {
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = ""; // Clear previous suggestions

  let suggestionsHTML = "";

  const allResults = [
    { type: "Movie", results: movies },
    { type: "TV Show", results: tvShows },
    { type: "Crew", results: people },
  ];
 const radomizeresults = allResults.sort(()=>Math.random() - 0.5);
  

  radomizeresults.forEach((category) => {
    if (category.results && Array.isArray(category.results) && category.results.length > 0) {
      let categoryHTML = `
        <h3>${category.type}</h3>
        ${category.results
          .map((item) => {
            const releaseYear = item.release_date ? item.release_date.split('-')[0] : '';
            const posterPath = item.poster_path || item.profile_path || "default-image-path.jpg";  // Add a fallback image path
            return `
              <div class="suggestion-item" data-id="${item.id}" data-type="${category.type === "Movie" ? "movie" : "tv"}">
                <img class="suggestion-img" src="https://image.tmdb.org/t/p/w92${posterPath}" alt="${item.title || item.name}">
                <div class="suggestion-des">
                  <p class="suggestion-category">${category.type}</p>
                  <span>${releaseYear}</span>
                  <p class="suggestion-title">${item.title || item.name}</p>
                </div>
                <hr>
              </div>
            `;
          })
          .join("")}
      `;
      suggestionsHTML += categoryHTML;
    }
  });

  suggestions.innerHTML = suggestionsHTML;
  suggestions.style.display = radomizeresults.some((category) => category.results.length > 0)
    ? "block"
    : "none";

  // Attach event listeners to suggestion items
  document.querySelectorAll(".suggestion-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      const id = event.target.closest('.suggestion-item').dataset.id;
      const title = event.target.closest('.suggestion-item').querySelector(".suggestion-title").textContent;
      const type = event.target.closest('.suggestion-item').dataset.type
      selectSuggestion(title, id, type);
    });
  });
}

export function selectSuggestion(value, id, type="movie") {
  document.getElementById("search-input").value = value;
  document.getElementById("suggestions").style.display = "none";
  if (id) {
    window.location.href = `movie-details.html?id=${id}&type=${type}`;
  }
}

export function login(){
  const authBtn = document.getElementById("auth");

 if (authBtn) {
   authBtn.addEventListener("click", () => {
     
     window.location.href = "login.html";
   });
 }}

document.addEventListener("DOMContentLoaded", async () => {
  const genreList = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  const categories = [
    { id: "now_playing", name: "Now Playing (Movies)", type: "movie" },
    { id: "on_the_air", name: "On The Air (TV Shows)", type: "tv" },
    { id: "popular", name: "Popular (Movies)", type: "movie" },
    { id: "top_rated", name: "Top Rated (TV Shows)", type: "tv" },
    { id: "top_rated", name: "Top Rated (Movies)", type: "movie" },
    { id: "airing_today", name: "Airing Today (TV Shows)", type: "tv" },
    { id: "upcoming", name: "Upcoming (Movies)", type: "movie" },
    { id: "popular", name: "Popular (TV Shows)", type: "tv" },
    
  ];
  // Utility function to shuffle an array. this enables different movies in each category
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
 
  login()
  const slideContainer = document.getElementById("hero-slide");
  const thumbnailSlider = document.getElementById("thumbnail-slide");

  let nextDom = document.getElementById("next");
  let prevDom = document.getElementById("prev");
  let heroDom = document.querySelector(".hero-section");
  let sliderDom = document.querySelector(".hero-section #hero-slide");
  let thumbnailDom = document.querySelector(".hero-section #thumbnail-slide");

  //fetch search
  document.getElementById("search-input").addEventListener("input", (e) => {
    fetchSuggestions(e.target.value);
    //hide suggestion and close search bar
    document.querySelector(".search-container").addEventListener("mouseleave", () => {
      document.getElementById("search-input").value = ""; 
      const suggestions = document.getElementById("suggestions");
      suggestions.style.display = "none";
    });
  });
  const fetchMovies = async () => {
    try {
      const res = await fetch(
        "https://api.themoviedb.org/3/trending/movie/week?api_key=5e5b8093e7d7736405fb91d83905aaab"
      );
      const data = await res.json();

      return data.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  const fetchTvShows = async () => {
    try {
      const res = await fetch(
        "https://api.themoviedb.org/3/trending/tv/week?api_key=5e5b8093e7d7736405fb91d83905aaab"
      );
      const data = await res.json();

      return data.results;
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      return [];
    }
  }
  const fetchCategories = async (categoryId, type) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${categoryId}?api_key=5e5b8093e7d7736405fb91d83905aaab`
      );
      if (!res.ok) {
        console.error(`Error fetching ${type} category ${categoryId}:`, res.statusText);
        return [];
      }
      const data = await res.json();
      if (data.results.length === 0) {
        console.warn(`No results for ${type} category ${categoryId}`);
      }
      return shuffleArray(data.results.slice(0, 15)); 
    } catch (error) {
      console.error("Error fetching category data:", error);
      return [];
    }
  };

  const fetchVideos = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=5e5b8093e7d7736405fb91d83905aaab`
      );
      const data = await res.json();
      return data.results.length > 0
        ? `https://www.youtube.com/watch?tv=${data.results[0].key}`
        : "";
    } catch (error) {
      console.error("Error fetching video:", error);
      return "";
    }
  };

  const generateSlides = async () => {
    const movies = await fetchMovies();
    const tvShows = await fetchTvShows(); 
    
    const combinedItems = [...movies, ...tvShows].sort(() => Math.random() - 0.5);//random display
    const slidesHTML = await Promise.all(
      combinedItems.map(async (item) => {
        const genreNames = item.genre_ids
          ?item.genre_ids.map((id) => genreList[id] || "Unknown")
          .join(", "): "Unknown";
        const videoUrl = await fetchVideos(item.id);
        const title = item.title || item.name;
        
        const type = item.title ? "movie" : "tv";  // Check if it's a movie or tv show
        
        return `
        <div class="slide">
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${title}" data-id="${item.id}" data-type="${type}">
        <div class="content">
          <div class="title">${title}</div>
          <div class="genre">${genreNames}</div>
          <div class="overview">${item.overview}</div>
          <div class="trailer">
          <p>Watch Trailer</p>${videoUrl ? `<a href="${videoUrl}" target="_blank"><i class="fa-solid fa-play"></i></a>` : "Sorry no trailer"}
          </div>
        </div>
      </div>
      `;
      })
    );
  
    slideContainer.innerHTML = slidesHTML.join("");
    thumbnailSlider.innerHTML = slidesHTML.join("");
  };
  // Categories
  const displayVideos = async () => {
    const container = document.getElementById("categories-container");
    container.innerHTML = ""; // Clear previous content if any
  
    for (const category of categories) {
      const movies = await fetchCategories(category.id, category.type);
      if (movies.length === 0) {
      
        continue; // Skip empty categories
      }
  
      const categorySection = document.createElement("div");
      categorySection.classList.add("movie-category");

      categorySection.innerHTML = `
        <h2>${category.name}</h2>
        <div class="movies">
          ${movies
            .map(
              (movie) => `
            <div class="movie">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title || movie.name}" data-id="${movie.id}" data-type=${category.type}>
              <div class="movie-info">
              <p><i class="fa-solid fa-star"></i>${movie.vote_average.toFixed(
                1
              )}</p>
              <h3>${movie.title || movie.name}</h3>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      container.appendChild(categorySection);
    }
    //allow scrolling through the images
    const scrollContainers = document.getElementsByClassName("movies");

    Array.from(scrollContainers).forEach((container) => {
      container.addEventListener("wheel", (event) => {
        event.preventDefault(); // Prevent vertical scroll
        container.scrollLeft += event.deltaY * 1.5;
      });
    });
    //Go to movie-details page
    const images = document.querySelectorAll('img[data-id]');
  images.forEach((img) => {
    img.addEventListener('click', (event) => {
      const id = event.target.dataset.id;
      const type = event.target.dataset.type; // 'movie' or 'tv'
      window.location.href = `movie-details.html?id=${id}&type=${type}`;
    });
    });
  };

  await generateSlides();
  await displayVideos();

  nextDom.onclick = function () {
    showSlider("next");
  };

  prevDom.onclick = function () {
    showSlider("prev");
  };

  let timeRunning = 3000;
  let timeAutoNext = 5000;
  let runTimeOut;
  let runNextAuto;
  const startAutoNext = () => {
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
      nextDom.click(); // Use nextDom here
    }, timeAutoNext);
  };
  const stopAutoNext = () => {
    clearTimeout(runNextAuto);
  };

  function showSlider(type) {
    let sliderItem = document.querySelectorAll(
      ".hero-section #hero-slide .slide"
    );
    let thumbnailItem = document.querySelectorAll(
      ".hero-section #thumbnail-slide .slide"
    );

    if (type === "next") {
      sliderDom.appendChild(sliderItem[0]);
      thumbnailDom.appendChild(thumbnailItem[0]);
      heroDom.classList.add("next");
    } else {
      sliderDom.prepend(sliderItem[sliderItem.length - 1]);
      thumbnailDom.prepend(thumbnailItem[thumbnailItem.length - 1]);
      heroDom.classList.add("prev");
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
      heroDom.classList.remove("next");
      heroDom.classList.remove("prev");
    }, timeRunning);

    thumbnailDom.addEventListener("mouseenter", stopAutoNext); // Stop auto slide on hover
    thumbnailDom.addEventListener("mouseleave", startAutoNext);
  }
  startAutoNext();
});
