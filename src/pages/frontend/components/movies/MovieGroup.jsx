import React from 'react';
import MovieCard from './MovieCard';
import './MovieGroup.less';

const MovieGroup = ({ title, movies, onMovieClick }) => {
  return (
    <div className="movies__group">
      <div className="movies__header">
        <h2>{title}</h2>
      </div>
      <div className="movies__grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
};

export default MovieGroup; 