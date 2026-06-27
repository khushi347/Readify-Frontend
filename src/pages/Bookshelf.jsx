import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Edit, MessageSquare, Tag, Check, Award } from 'lucide-react';
import Book3D from '../components/Book3D';
import './Bookshelf.css';

const Bookshelf = ({ books, onUpdateBookProgress, onUpdateBookStatus, onUpdateBookRating }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [editProgress, setEditProgress] = useState(false);
  const [newPageProgress, setNewPageProgress] = useState('');

  const shelves = [
    { id: 'currently-reading', name: 'Currently Reading' },
    { id: 'to-read', name: 'To Read' },
    { id: 'completed', name: 'Completed' }
  ];

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setNewPageProgress(book.pagesRead.toString());
    setEditProgress(false);
  };

  const handleClose = () => {
    setSelectedBook(null);
  };

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    const pages = parseInt(newPageProgress);
    if (isNaN(pages) || pages < 0 || pages > selectedBook.totalPages) return;
    
    onUpdateBookProgress(selectedBook.id, pages);
    // Update local state to show correct value
    setSelectedBook({
      ...selectedBook,
      pagesRead: pages,
      progress: Math.round((pages / selectedBook.totalPages) * 100)
    });
    setEditProgress(false);
  };

  const handleStatusChange = (status) => {
    onUpdateBookStatus(selectedBook.id, status);
    setSelectedBook({ ...selectedBook, category: status });
  };

  const handleRatingChange = (rating) => {
    onUpdateBookRating(selectedBook.id, rating);
    setSelectedBook({ ...selectedBook, rating });
  };

  return (
    <div className="bookshelf-container container">
      <div className="bookshelf-header">
        <span className="db-sub">Personal Library</span>
        <h2>Your Curated Shelf</h2>
        <p>Hover over spines to slide volumes out, click to open their records.</p>
      </div>

      {/* Render Shelves */}
      <div className="shelves-wrapper">
        {shelves.map((shelf) => {
          const shelfBooks = books.filter(b => b.category === shelf.id);
          return (
            <div key={shelf.id} className="bookshelf-shelf">
              <div className="shelf-header">
                <h3>{shelf.name}</h3>
                <span className="shelf-count">{shelfBooks.length} volumes</span>
              </div>
              
              <div className="shelf-books-grid">
                {shelfBooks.map((book) => (
                  <motion.div 
                    key={book.id} 
                    className="shelf-book-item-wrapper"
                    whileHover={{ y: -15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Book3D 
                      title={book.title} 
                      author={book.author} 
                      coverColor={book.coverColor} 
                      progress={book.progress}
                      isOpen={false}
                      onClick={() => handleBookClick(book)}
                    />
                    <div className="book-shadow-reflection" />
                  </motion.div>
                ))}
                {shelfBooks.length === 0 && (
                  <div className="shelf-empty">
                    <span className="empty-slot-outline" />
                    <p className="empty-slot-text">Empty Shelf Slot</p>
                  </div>
                )}
              </div>
              <div className="wooden-shelf-plank" />
            </div>
          );
        })}
      </div>

      {/* Book Detail Overlay Drawer */}
      <AnimatePresence>
        {selectedBook && (
          <div className="bookshelf-overlay">
            
            {/* Backdrop */}
            <motion.div 
              className="bookshelf-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Content Drawer */}
            <motion.div 
              className="bookshelf-drawer"
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              
              {/* Drawer Top controls */}
              <div className="drawer-actions">
                <button className="close-drawer-btn" onClick={handleClose}>
                  <X size={20} />
                </button>
              </div>

              <div className="drawer-scroll-content">
                
                {/* 3D Book Stage inside Modal */}
                <div className="drawer-book-stage">
                  <div className="drawer-book-wrapper">
                    <Book3D 
                      title={selectedBook.title}
                      author={selectedBook.author}
                      coverColor={selectedBook.coverColor}
                      progress={selectedBook.progress}
                      isOpen={true}
                      showBookmark={true}
                    />
                  </div>
                </div>

                {/* Editorial Details */}
                <div className="drawer-editorial-pane">
                  <div className="drawer-section">
                    <span className="drawer-sub">Literary Record</span>
                    <h2 className="drawer-title">{selectedBook.title}</h2>
                    <p className="drawer-author">By {selectedBook.author}</p>
                  </div>

                  <div className="editorial-divider" />

                  {/* Synopsis */}
                  <div className="drawer-section">
                    <h4 className="drawer-sec-title">Synopsis</h4>
                    <p className="drawer-synopsis">{selectedBook.synopsis}</p>
                  </div>

                  {/* Reading Status & Progress */}
                  <div className="drawer-section grid-section">
                    
                    <div className="sec-column">
                      <h4 className="drawer-sec-title">Shelf Placement</h4>
                      <select 
                        className="drawer-select"
                        value={selectedBook.category} 
                        onChange={(e) => handleStatusChange(e.target.value)}
                      >
                        <option value="currently-reading">Currently Reading</option>
                        <option value="to-read">To Read</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="sec-column">
                      <h4 className="drawer-sec-title">Personal Rating</h4>
                      <div className="drawer-rating-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={18}
                            className={`star-icon ${star <= selectedBook.rating ? 'filled' : ''}`}
                            onClick={() => handleRatingChange(star)}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Progress Logger */}
                  <div className="drawer-section">
                    <h4 className="drawer-sec-title">Reading Timeline</h4>
                    <div className="drawer-progress-logger-box">
                      <div className="logger-stats">
                        <div className="logger-percent">{selectedBook.progress}% Read</div>
                        <div className="logger-pages">{selectedBook.pagesRead} of {selectedBook.totalPages} pages</div>
                      </div>
                      <div className="logger-bar">
                        <div className="logger-bar-fill" style={{ width: `${selectedBook.progress}%` }} />
                      </div>

                      {editProgress ? (
                        <form onSubmit={handleProgressSubmit} className="progress-edit-form">
                          <input 
                            type="number" 
                            className="progress-edit-input"
                            value={newPageProgress}
                            onChange={(e) => setNewPageProgress(e.target.value)}
                            max={selectedBook.totalPages}
                            min="0"
                            required
                          />
                          <button type="submit" className="progress-edit-submit-btn">
                            <Check size={14} /> Save
                          </button>
                        </form>
                      ) : (
                        <button className="progress-edit-trigger-btn" onClick={() => setEditProgress(true)}>
                          <Edit size={12} /> Log Reading Session
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Highlights section inside drawer */}
                  <div className="drawer-section">
                    <h4 className="drawer-sec-title">Logged Reflections</h4>
                    <div className="drawer-highlights-list">
                      {selectedBook.highlights && selectedBook.highlights.length > 0 ? (
                        selectedBook.highlights.map((h, i) => (
                          <div key={i} className="drawer-highlight-item">
                            <p>“{h.text}”</p>
                            <span className="date">{new Date(h.date).toLocaleDateString()}</span>
                          </div>
                        ))
                      ) : (
                        <p className="no-highlights-text">No highlights registered. Open Sanctuary mode on the dashboard to scribble reflections.</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookshelf;
