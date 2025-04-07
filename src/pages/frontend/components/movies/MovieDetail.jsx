import React, { useState } from 'react';
import { Rate, Dialog, Button, Space } from 'tdesign-react';
import './MovieDetail.less';

const MovieDetail = ({ movie, notes, expandedNoteIndex, onNoteClick }) => {
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
            <span>{movie.rating === 0 ? '未评分' : movie.rating}</span>
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
              <p className="movies__review-text">
                {truncateText(note.content)}
                <span 
                  className="movies__review-view-more"
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
            <div className="movies__review-toolbar">
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

export default MovieDetail; 