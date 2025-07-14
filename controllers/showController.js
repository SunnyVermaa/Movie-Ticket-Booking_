import axios from "axios";
import Movie from "../models/movie.js";
import Show from "../models/show.js";

//api to show now-playing movies list using tmdb
export const getNowPlayingMovie = async (req , res) => {
    try {
        const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies = data.results;
        res.json({success: true, movies:movies})
    } catch (error) {
        console.error('show controller erroe' , error)
        res.json({success: false, message : error.message})
    }
}

// api to add new show to the database using tmdb

export const addShow = async(req, res) =>{
    try {
        const {movieId, showsInput, showPrice} = req.body;

        let movie = await Movie.findById(movieId);

        if(!movie){
            //fetch movie from tmbd credits and details
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} })
            ]);
            
            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            const movieDetails = {
                _id : movieId,
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path : movieApiData.poster_path,
                backdrop_path : movieApiData.backdrop_path,
                genres : movieApiData.genres,
                casts : movieApiData.casts,
                release_date : movieApiData.release_date,
                original_language : movieApiData.original_language,
                tagline : movieApiData.tagline || " ",
                vote_average : movieApiData.vote_average,
                runtime : movieApiData.runtime,
            }

            // add movies to database

            movie = await Movie.create(movieDetails);
        }

        const showToCreate =[]
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString =`${showDate}T${time}`;
                showToCreate.push({
                    movie : movieId,
                    showDateTime : new Date(dateTimeString),
                    showPrice,
                    occupiedSeats : {}
                })
            })
        })

        if(showToCreate.length > 0) {
            await Show.insertMany(showToCreate)
        }
        res.json({ success : true, message : 'show added successfully'})

    } catch (error) {
        console.log('add show error' ,error);

        res.json({ success : false, message : error.message})
    }
}