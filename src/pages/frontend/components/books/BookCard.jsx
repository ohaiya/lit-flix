import { Rate } from 'tdesign-react';
import './BookCard.less';

const BookCard = ({ book, onClick }) => {
  return (
    <div 
      className="books__card"
      onClick={() => onClick(book)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick(book)}
    >
      <div className="books__cover">
        <img 
          src={book.cover} 
          alt={`${book.title} 封面`}
          loading="lazy"
        />
        <div className="books__cover-info">
          <h3 className="books__title">{book.title}</h3>
          {book.subtitle && <p className="books__subtitle">{book.subtitle}</p>}
        </div>
      </div>
      <div className="books__info">
        <p className="books__author">{book.author}</p>
        <p className="books__publisher">{book.publisher}</p>
        <div className="books__rating">
          <Rate value={book.rating} disabled size="small" />
          <span className="books__rating-value">{book.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 