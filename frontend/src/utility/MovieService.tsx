import axios from "axios";

const API_KEY = "ef1c9eedb88ac226fd038f67c7294250"
export const fetchMovies = async () => {
  try {
    const totalPages = 5; // Adjust as needed
    let allMovies: any[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: API_KEY,
            language: "en-US",
            include_adult: false,
            include_video: false,
            page: page,
            //...(searchTerm && { query: searchTerm }), // Only include query parameter if searchTerm is not empty
          },
        }
      );

      allMovies = allMovies.concat(response.data.results);
    }

    return allMovies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};
