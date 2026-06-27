import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Search as SearchIcon, Compass, User, LogOut, Layout, Menu, X } from 'lucide-react';
import PageTransition from './components/PageTransition';
import './App.css';

// Import Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Bookshelf from './pages/Bookshelf';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';

// Initial Curated Library Database
const INITIAL_BOOKS = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    coverColor: "linear-gradient(135deg, #101c38 0%, #1e3c72 100%)",
    category: "currently-reading",
    genre: "Fiction",
    progress: 64,
    pagesRead: 195,
    totalPages: 304,
    rating: 4,
    synopsis: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    highlights: [
      { text: "It is easy to mourn the lives we aren't living.", date: "2026-06-25T12:00:00Z" },
      { text: "You don't have to understand life, you just have to live it.", date: "2026-06-26T15:30:00Z" }
    ]
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    coverColor: "linear-gradient(135deg, #a86b32 0%, #6e401c 100%)",
    category: "currently-reading",
    genre: "Sci-Fi",
    progress: 28,
    pagesRead: 172,
    totalPages: 617,
    rating: 5,
    synopsis: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the Messiah of a hostile world.",
    highlights: [
      { text: "Fear is the mind-killer.", date: "2026-06-24T09:15:00Z" }
    ]
  },
  {
    id: 3,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    coverColor: "linear-gradient(135deg, #e4a853 0%, #b85c38 100%)",
    category: "to-read",
    genre: "Sci-Fi",
    progress: 0,
    pagesRead: 0,
    totalPages: 320,
    rating: 0,
    synopsis: "Klara, an Artificial Friend with outstanding observational qualities, watches the behavior of those who come in to browse.",
    highlights: []
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    coverColor: "linear-gradient(135deg, #4b5320 0%, #2e3b1c 100%)",
    category: "completed",
    genre: "Non-Fiction",
    progress: 100,
    pagesRead: 512,
    totalPages: 512,
    rating: 5,
    synopsis: "Harari spans the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.",
    highlights: [
      { text: "History is something that very few people have been doing while everyone else was ploughing fields and carrying water buckets.", date: "2026-06-10T11:20:00Z" }
    ]
  },
  {
    id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverColor: "linear-gradient(135deg, #112d32 0%, #254b50 100%)",
    category: "completed",
    genre: "Classics",
    progress: 100,
    pagesRead: 180,
    totalPages: 180,
    rating: 4,
    synopsis: "A portrait of the Jazz Age, following Jay Gatsby's obsessive pursuit of his former lover, Daisy Buchanan.",
    highlights: [
      { text: "So we beat on, boats against the current, borne back ceaselessly into the past.", date: "2026-06-15T18:45:00Z" }
    ]
  }
];

function App() {
  const [view, setView] = useState('landing'); // landing, auth, dashboard, bookshelf, search, recommendations, profile
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [sanctuaryMode, setSanctuaryMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync Sanctuary Focus mode state from dashboard to App root class
  useEffect(() => {
    // Check if the current view is dashboard, otherwise clean up classes
    if (view !== 'dashboard') {
      document.body.classList.remove('sanctuary-dark');
      setSanctuaryMode(false);
    }
    // Close mobile menu when view changes
    setIsMobileMenuOpen(false);
  }, [view]);

  // Log progress updates
  const handleUpdateBookProgress = (bookId, pagesRead) => {
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === bookId) {
          const progress = Math.min(100, Math.round((pagesRead / book.totalPages) * 100));
          const updatedCategory = progress === 100 ? 'completed' : book.category;
          return {
            ...book,
            pagesRead,
            progress,
            category: updatedCategory
          };
        }
        return book;
      })
    );
  };

  // Log shelf moves
  const handleUpdateBookStatus = (bookId, status) => {
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === bookId) {
          return {
            ...book,
            category: status,
            // If completed, set progress to 100%
            progress: status === 'completed' ? 100 : status === 'to-read' ? 0 : book.progress,
            pagesRead: status === 'completed' ? book.totalPages : status === 'to-read' ? 0 : book.pagesRead
          };
        }
        return book;
      })
    );
  };

  // Log star ratings
  const handleUpdateBookRating = (bookId, rating) => {
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === bookId) {
          return { ...book, rating };
        }
        return book;
      })
    );
  };

  // Log highlights
  const handleSaveHighlight = (bookId, highlightText) => {
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === bookId) {
          return {
            ...book,
            highlights: [
              ...book.highlights,
              { text: highlightText, date: new Date().toISOString() }
            ]
          };
        }
        return book;
      })
    );
  };

  // Add search book to library
  const handleAddBookToLibrary = (newBook) => {
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  // Calculate dynamic goals progress
  const completedCount = books.filter(b => b.category === 'completed').length;
  const yearlyGoalData = {
    read: completedCount,
    target: 8
  };

  const handleSanctuaryToggleFromDashboard = (isFocused) => {
    setSanctuaryMode(isFocused);
  };

  return (
    <>
      {/* Global Editorial Header (Navigation Bar) */}
      {user && !document.body.classList.contains('sanctuary-dark') && (
        <header className="global-editorial-header">
          <div className="nav-container container">
            <div className="nav-logo" onClick={() => setView('dashboard')}>
              <span className="logo-initial">R</span>
              <span className="logo-text">Readify</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="nav-links desktop-only">
              <button 
                className={`nav-link-btn ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => setView('dashboard')}
              >
                <Layout size={14} className="nav-icon" />
                <span className="nav-text">Dashboard</span>
                {view === 'dashboard' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'bookshelf' ? 'active' : ''}`}
                onClick={() => setView('bookshelf')}
              >
                <BookOpen size={14} className="nav-icon" />
                <span className="nav-text">Bookshelf</span>
                {view === 'bookshelf' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'search' ? 'active' : ''}`}
                onClick={() => setView('search')}
              >
                <SearchIcon size={14} className="nav-icon" />
                <span className="nav-text">Search</span>
                {view === 'search' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'recommendations' ? 'active' : ''}`}
                onClick={() => setView('recommendations')}
              >
                <Compass size={14} className="nav-icon" />
                <span className="nav-text">Recommendations</span>
                {view === 'recommendations' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'profile' ? 'active' : ''}`}
                onClick={() => setView('profile')}
              >
                <User size={14} className="nav-icon" />
                <span className="nav-text">Profile</span>
                {view === 'profile' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </nav>

            {/* Desktop Profile Section */}
            <div className="nav-profile-control desktop-only">
              <div className="nav-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="nav-profile-info">
                <span className="nav-user-name">{user.name}</span>
                <span className="nav-user-role">Bibliophile</span>
              </div>
              <button className="nav-logout-btn" onClick={handleLogout} title="Log Out">
                <LogOut size={14} />
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Drawer (Drop-down Navigation) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="mobile-nav-drawer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <nav className="mobile-nav-links">
                  <button 
                    className={`mobile-nav-link-btn ${view === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setView('dashboard')}
                  >
                    <Layout size={16} className="nav-icon" />
                    <span className="nav-text">Dashboard</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'bookshelf' ? 'active' : ''}`}
                    onClick={() => setView('bookshelf')}
                  >
                    <BookOpen size={16} className="nav-icon" />
                    <span className="nav-text">Bookshelf</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'search' ? 'active' : ''}`}
                    onClick={() => setView('search')}
                  >
                    <SearchIcon size={16} className="nav-icon" />
                    <span className="nav-text">Search</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'recommendations' ? 'active' : ''}`}
                    onClick={() => setView('recommendations')}
                  >
                    <Compass size={16} className="nav-icon" />
                    <span className="nav-text">Recommendations</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'profile' ? 'active' : ''}`}
                    onClick={() => setView('profile')}
                  >
                    <User size={16} className="nav-icon" />
                    <span className="nav-text">Profile</span>
                  </button>
                </nav>
                
                <div className="mobile-nav-profile">
                  <div className="mobile-profile-left">
                    <div className="nav-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="nav-profile-info">
                      <span className="nav-user-name">{user.name}</span>
                      <span className="nav-user-role">Bibliophile</span>
                    </div>
                  </div>
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* Main View Router */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <PageTransition key="landing">
            <LandingPage onEnterApp={() => setView('auth')} />
          </PageTransition>
        )}

        {view === 'auth' && (
          <PageTransition key="auth">
            <AuthPage onLogin={handleLogin} />
          </PageTransition>
        )}

        {view === 'dashboard' && (
          <PageTransition key="dashboard">
            <Dashboard 
              user={user}
              books={books}
              onUpdateBookProgress={handleUpdateBookProgress}
              onSaveHighlight={handleSaveHighlight}
              goals={yearlyGoalData}
            />
          </PageTransition>
        )}

        {view === 'bookshelf' && (
          <PageTransition key="bookshelf">
            <Bookshelf 
              books={books}
              onUpdateBookProgress={handleUpdateBookProgress}
              onUpdateBookStatus={handleUpdateBookStatus}
              onUpdateBookRating={handleUpdateBookRating}
            />
          </PageTransition>
        )}

        {view === 'search' && (
          <PageTransition key="search">
            <Search 
              libraryBooks={books}
              onAddBookToLibrary={handleAddBookToLibrary}
            />
          </PageTransition>
        )}

        {view === 'recommendations' && (
          <PageTransition key="recommendations">
            <Recommendations 
              libraryBooks={books}
              onAddBookToLibrary={handleAddBookToLibrary}
            />
          </PageTransition>
        )}

        {view === 'profile' && (
          <PageTransition key="profile">
            <Profile 
              user={user}
              books={books}
            />
          </PageTransition>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
