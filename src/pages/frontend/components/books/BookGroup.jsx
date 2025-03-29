import BookCard from './BookCard';
import './BookGroup.less';

const BookGroup = ({ title, books, onBookClick }) => {
  return (
    <div className="books__group">
      <div className="books__header">
        <h2>{title}</h2>
        <div className="books__stats">
          <div className="books__stat-item">
            <span className="books__stat-value">{books.length}</span>
            <span className="books__stat-label">本</span>
          </div>
        </div>
      </div>
      
      <div className="books__grid">
        {books.map((book) => (
          <BookCard 
            key={book._id} 
            book={book}
            onClick={onBookClick}
          />
        ))}
      </div>
    </div>
  );
};

export default BookGroup; 