document.addEventListener("DOMContentLoaded", async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const movieId = queryParams.get("id");

  if (!movieId) {
    document.body.innerHTML = "<p>Movie ID not found.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=5e5b8093e7d7736405fb91d83905aaab`
    );
    const data = await res.json();

    const fullCastContainer = document.getElementById("full-cast-container");

    if (data.cast.length > 0) {
      fullCastContainer.innerHTML = data.cast
        .map(
          (member) => `
          <div class="cast-member">
            <img src="https://image.tmdb.org/t/p/w185${member.profile_path || ""}" 
                 alt="${member.name}" title="${member.name}">
            <p>${member.name}</p>
            <p>${member.character}</p>
          </div>
        `
        )
        .join("");
    } else {
      fullCastContainer.innerHTML = "<p>No cast information available.</p>";
    }
  } catch (error) {
    console.error("Error fetching full cast:", error);
    document.body.innerHTML = "<p>Unable to load cast information.</p>";
  }
});
