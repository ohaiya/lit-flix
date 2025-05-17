import { Rate, Dialog, Button, Space } from 'tdesign-react';
import { useState } from 'react';
import './BookDetail.less';

const BookDetail = ({ book, notes, expandedNoteIndex, onNoteClick }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteDetailVisible, setNoteDetailVisible] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // 截断文本
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // 调整字体大小
  const adjustFontSize = (delta) => {
    setFontSize(prev => {
      const newSize = prev + delta;
      return Math.min(Math.max(newSize, 12), 24); // 限制字体大小在12-24px之间
    });
  };

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
            <Rate value={book.rating} disabled size="small" allowHalf />
            <span>{book.rating === 0 ? '未评分' : Number(book.rating).toFixed(1)}</span>
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
              <p className="books__review-text">
                {truncateText(note.content)}
                <span 
                  className="books__review-view-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNote(note);
                    setNoteDetailVisible(true);
                  }}
                >
                  查看
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 笔记详情弹窗 */}
      <Dialog
        visible={noteDetailVisible}
        onClose={() => {
          setNoteDetailVisible(false);
          setSelectedNote(null);
          setFontSize(16); // 重置字体大小
        }}
        header="笔记详情"
        width="80%"
        footer={false}
      >
        {selectedNote && (
          <div>
            <div className="books__review-toolbar">
              <Space>
                <Button variant="text" onClick={() => adjustFontSize(-2)}>A-</Button>
                <Button variant="text" onClick={() => adjustFontSize(2)}>A+</Button>
              </Space>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.6',
                fontSize: `${fontSize}px`
              }}>
                {selectedNote.content}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default BookDetail; 