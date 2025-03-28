import { Rate } from 'tdesign-react';
import './BookDetail.less';

const BookDetail = ({ book, notes, expandedNoteIndex, onNoteClick }) => {
  return (
    <div className="books__review">
      <div className="books__review-header">
        <img 
          src={book.cover} 
          alt={`${book.title} 封面`}
          className="books__review-cover"
        />
        <div className="books__review-info">
          <h2>{book.title}</h2>
          {book.subtitle && <p className="books__review-subtitle">{book.subtitle}</p>}
          <p className="books__review-author">{book.author}</p>
          <p className="books__review-publisher">{book.publisher}</p>
          <div className="books__review-rating">
            <Rate value={book.rating} disabled size="small" />
            <span>{book.rating}</span>
          </div>
        </div>
      </div>
      <div className="books__review-content">
        <h3>阅读笔记</h3>
        {notes.map((note, index) => (
          <div 
            key={index} 
            className={`books__review-item ${expandedNoteIndex === index ? 'expanded' : ''}`}
            onClick={() => onNoteClick(index)}
          >
            <div className="books__review-note-header">
              <span className="books__review-note-title">{note.title}</span>
              <span className="books__review-note-date">{note.date}</span>
            </div>
            <div className="books__review-note-content">
              <p className="books__review-text">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetail; 