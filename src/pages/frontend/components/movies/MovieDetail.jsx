import React from 'react';
import { Rate } from 'tdesign-react';
import './MovieDetail.less';

const MovieDetail = ({ movie, notes, expandedNoteIndex, onNoteClick }) => {
  return (
    <div className="movies__review">
      <div className="movies__review-header">
        <img className="movies__review-cover" src={movie.cover} alt={movie.title} />
        <div className="movies__review-info">
          <h2>{movie.title}</h2>
          <div className="movies__review-meta">
            <span className="movies__review-year">{movie.year}</span>
            <span className="movies__review-region">{movie.region}</span>
          </div>
          <div className="movies__review-rating">
            <Rate value={movie.rating} disabled size="small" />
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>
      <div className="movies__review-content">
        <h3>观看笔记</h3>
        {notes.map((note, index) => (
          <div
            key={index}
            className={`movies__review-item ${expandedNoteIndex === index ? 'expanded' : ''}`}
            onClick={() => onNoteClick(index)}
          >
            <div className="movies__review-note-header">
              <div className="movies__review-note-title">{note.title}</div>
              <div className="movies__review-note-date">{note.date}</div>
            </div>
            <div className="movies__review-note-content">
              <p className="movies__review-text">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetail; 