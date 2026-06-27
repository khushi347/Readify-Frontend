import React, { useState } from 'react';
import { Search as SearchIcon, Plus, CheckCircle, Clock, BookOpen } from 'lucide-react';
import Book3D from '../components/Book3D';
import './Search.css';

// Extra mock database of books available to discover & add
const DISCOVERABLE_BOOKS = [
  {
    id: 101,
    title: "The Shadow of the Wind",
    author: "Carlos Ruiz Zafón",
    coverColor: "linear-gradient(135deg, #1C120C 0%, #4D331F 100%)",
    genre: "Mystery",
    totalPages: 487,
    synopsis: "In Barcelona, 1945, Daniel Sempere is taken by his father to the secret Cemetery of Forgotten Books...",
    publishYear: 2001,
  },
  {
    id: 102,
    title: "Invisible Cities",
    author: "Italo Calvino",
    coverColor: "linear-gradient(135deg, #444E4F 0%, #151F20 100%)",
    genre: "Fiction",
    totalPages: 165,
    synopsis: "Kublai Khan listens to Marco Polo describe imaginary cities from his travels across the empire...",
    publishYear: 1972,
  },
  {
    id: 103,
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverColor: "linear-gradient(135deg, #BC7C33 0%, #68380A 100%)",
    genre: "Fiction",
    totalPages: 208,
    synopsis: "A young Andalusian shepherd travels from his homeland in Spain to the Egyptian desert in search of treasure...",
    publishYear: 1988,
  },
  {
    id: 104,
    title: "Meditations",
    author: "Marcus Aurelius",
    coverColor: "linear-gradient(135deg, #8C7550 0%, #3B301B 100%)",
    genre: "Philosophy",
    totalPages: 254,
    synopsis: "The personal journals of Roman Emperor Marcus Aurelius detailing Stoic philosophy...",
    publishYear: 180,
  },
  {
    id: 105,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    coverColor: "linear-gradient(135deg, #9C3333 0%, #4C1212 100%)",
    genre: "Sci-Fi",
    totalPages: 158,
    synopsis: "In a futuristic society, firemen burn books to prevent intellectual questioning...",
    publishYear: 1953,
  }
];

const Search = ({ libraryBooks, onAddBookToLibrary }) => {
  const [query, setQuery] = useState('');
  const [maxPages, setMaxPages] = useState(500);

  const filteredBooks = DISCOVERABLE_BOOKS.filter(book => {
    const matchesQuery = book.title.toLowerCase().includes(query.toLowerCase()) || 
                         book.author.toLowerCase().includes(query.toLowerCase()) ||
                         book.synopsis.toLowerCase().includes(query.toLowerCase());
    const matchesPages = book.totalPages <= maxPages;
    return matchesQuery && matchesPages;
  });

  const isBookInLibrary = (bookId) => {
    return libraryBooks.some(b => b.id === bookId);
  };

  const handleAddBook = (book) => {
    onAddBookToLibrary({
      ...book,
      progress: 0,
      pagesRead: 0,
      rating: 0,
      highlights: [],
      category: 'to-read' // default to to-read
    });
  };

  return (
    <div className="search-container container">
      <div className="search-header">
        <span className="db-sub">Discover Catalog</span>
        <h2>Search Library Archives</h2>
        <p>Browse through volumes of classic and modern literature, and place them on your shelf.</p>
      </div>

      {/* Floating Search Controls */}
      <div className="search-bar-drawer">
        <div className="search-input-wrapper">
          <SearchIcon className="search-bar-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, author, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Page filter slider */}
        <div className="search-filter-pages">
          <div className="filter-label-row">
            <span>Length Limit</span>
            <strong>{maxPages} pages</strong>
          </div>
          <input 
            type="range" 
            min="100" 
            max="600" 
            step="50"
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value))}
            className="filter-range-slider"
          />
        </div>
      </div>

      {/* Results grid */}
      <div className="search-results-grid">
        {filteredBooks.map((book) => {
          const added = isBookInLibrary(book.id);
          return (
            <div key={book.id} className="search-result-card">
              <div className="result-book-visual">
                <Book3D 
                  title={book.title} 
                  author={book.author} 
                  coverColor={book.coverColor} 
                  progress={0}
                  isOpen={false}
                />
              </div>

              <div className="result-info">
                <div className="result-main-meta">
                  <h3>{book.title}</h3>
                  <span className="author">By {book.author}</span>
                  <div className="editorial-divider" style={{ margin: '0.75rem 0' }} />
                  <p className="synopsis">{book.synopsis}</p>
                </div>

                <div className="result-footer-meta">
                  <span className="pages-label">
                    <Clock size={12} /> {book.totalPages} pages
                  </span>
                  
                  {added ? (
                    <button className="add-shelf-btn added" disabled>
                      <CheckCircle size={14} /> Added to Shelf
                    </button>
                  ) : (
                    <button className="add-shelf-btn" onClick={() => handleAddBook(book)}>
                      <Plus size={14} /> Place on Shelf
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <div className="search-empty-state">
            <BookOpen size={32} />
            <h3>No Records Uncovered</h3>
            <p>We couldn't locate any manuscripts fitting your criteria. Try adjusting your query or page constraints.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;
