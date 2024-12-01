document.addEventListener("DOMContentLoaded", async () => {


  const genreList = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary",
    18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 
    10752: "War", 37: "Western"
  };
  const categories = [
    { id: "now_playing", name: "Now Playing" },
    { id: "popular", name: "Popular" },
    { id: "top_rated", name: "Top Rated" },
    { id: "upcoming", name: "Upcoming" },
  ];


  const slideContainer = document.getElementById("hero-slide");
  const thumbnailSlider = document.getElementById("thumbnail-slide");


  let nextDom = document.getElementById("next");
  let prevDom = document.getElementById('prev');
  let heroDom = document.querySelector('.hero-section')
  let sliderDom = document.querySelector('.hero-section #hero-slide')
  let thumbnailDom = document.querySelector('.hero-section #thumbnail-slide')

//fetch search

  const fetchMovies = async () => {
    try {
      const res = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=5e5b8093e7d7736405fb91d83905aaab");
      const data = await res.json();
      console.log(data)
      return data.results;
    
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  const fetchCategories = async (categoryId)=>{
    try {
      const res = await fetch (`https://api.themoviedb.org/3/movie/${categoryId}?api_key=5e5b8093e7d7736405fb91d83905aaab`)
      const data = await res.json();
      // console.log(data);
      return data.results.slice(0,10);
      
    } catch (error) {
      console.log("Can not display categories: ", error)
      return[];
    }
  }
  const fetchVideos = async (movieId) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=5e5b8093e7d7736405fb91d83905aaab`);
      const data = await res.json();
      return data.results.length > 0 ? `https://www.youtube.com/watch?v=${data.results[0].key}` : '';
    } catch (error) {
      console.error("Error fetching video:", error);
      return '';
    }
  };

  const generateSlides = async () => {
    const movies = await fetchMovies();
    const slidesHTML = await Promise.all(movies.map(async (movie) => {
      const genreNames = movie.genre_ids.map(id => genreList[id] || "Unknown").join(", ");
      const videoUrl = await fetchVideos(movie.id);
      return `
        <div class="slide">
          
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" data-id="${movie.id}">
          <div class="content">
            <div class="title">${movie.title}</div>
            <div class="genre">${genreNames}</div>
            <div class="overview">${movie.overview}</div>
            <div class="trailer">
            <p>Watch Trailer</p>${videoUrl ? `<a href="${videoUrl}" target="_blank"><i class="fa-solid fa-play"></i></a>` : ''}</div>
          </div>
        </div>
      `;
    }));

    slideContainer.innerHTML = slidesHTML.join("");
    thumbnailSlider.innerHTML = slidesHTML.join("");

  };
  // Categories
  const displayMovies= async ()=>{
    const container = document.getElementById("categories-container");

    for (const category of categories) {
      const movies = await fetchCategories(category.id);
      const categorySection = document.createElement("div");
      categorySection.classList.add("movie-category");

      categorySection.innerHTML = `
        <h2>${category.name}</h2>
        <div class="movies">
          ${movies.map(movie => `
            <div class="movie">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" data-id="${movie.id}">
              <div class="movie-info">
              <h3>${movie.title}</h3>
              <p><i class="fa-solid fa-star"></i>${movie.vote_average}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `;

      container.appendChild(categorySection);
    }
    //allow scrolling through the images 
    const scrollContainers = document.getElementsByClassName('movies');

    Array.from(scrollContainers).forEach((container) => {
      container.addEventListener("wheel", (event) => {
        event.preventDefault(); // Prevent vertical scroll
        container.scrollLeft += event.deltaY * 1.5; 
      });
    });
    //Go to movie-details page
   const images = document.querySelectorAll("img[data-id]");

  // Add click event listener to each image
  images.forEach((img) => {
    img.addEventListener("click", (event) => {
      const movieId = event.target.dataset.id;
      if (movieId) {
        console.log("Movie ID:", movieId);
        // Redirect to movie details page
        window.location.href = `movie-details.html?id=${movieId}`;
      } else {
        console.error("No movie ID found on this image.");
      }
    });
  });
  }
  
  
  
  await generateSlides();
  await displayMovies()

  nextDom.onclick = function(){
    showSlider('next');
  }

  prevDom.onclick = function(){
    showSlider('prev');
  }
  
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
  

  function showSlider(type){
    let sliderItem = document.querySelectorAll('.hero-section #hero-slide .slide')
    let thumbnailItem = document.querySelectorAll('.hero-section #thumbnail-slide .slide')

    if (type === 'next'){
      sliderDom.appendChild(sliderItem[0]);
      thumbnailDom.appendChild(thumbnailItem[0]);
      heroDom.classList.add('next');
    }else{      
      sliderDom.prepend(sliderItem[sliderItem.length - 1]);
      thumbnailDom.prepend(thumbnailItem[thumbnailItem.length - 1]);
      heroDom.classList.add('prev');     
    }


    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
      heroDom.classList.remove('next');
      heroDom.classList.remove('prev');
    }, timeRunning);
    
    thumbnailDom.addEventListener("mouseenter", stopAutoNext); // Stop auto slide on hover
  thumbnailDom.addEventListener("mouseleave", startAutoNext)

  }
  startAutoNext();

  

  
});


