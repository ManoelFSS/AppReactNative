// services/api.js
import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhODAzMzJlY2Q2NzQ5ODAyM2I2NGM2NzQ5OWZiZDE1MiIsInN1YiI6IjY0MTFhOWY2ZWRlMWIwMjg2MzVkMWRiZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-EYaxTyNfbwbkM_CkkFkQLH7hm0XRyXzGF3vveuhfN8';

export const getMoviesFromDBMovies = async (url) => {
    const options = {
        method: 'GET',
        url: url,
        headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        },
    };

    try {
        const response = await axios.request(options);
        const DATA = response.data.results;

        const formattedData = DATA.map((movie) => ({
        ...movie,
        poster_path: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
        backdrop_path: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }));

        return formattedData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


