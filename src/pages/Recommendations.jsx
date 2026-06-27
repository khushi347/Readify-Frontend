import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, ArrowRight, CheckCircle, Plus } from 'lucide-react';
import Book3D from '../components/Book3D';
import './Recommendations.css';

const RECOMMENDATIONS_DB = {
  reflective: [
    {
      id: 201,
      title: "The Midnight Library",
      author: "Matt Haig",
      coverColor: "linear-gradient(135deg, #101c38 0%, #1e3c72 100%)",
      genre: "Fiction",
      synopsis: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
      whyRead: "Perfect for times of transition or self-reflection, questioning choices, and finding peace in the present."
    },
    {
      id: 202,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      coverColor: "linear-gradient(135deg, #e4a853 0%, #b85c38 100%)",
      genre: "Sci-Fi",
      synopsis: "Klara, an Artificial Friend with outstanding observational qualities, watches the behavior of those who come in to browse.",
      whyRead: "A gentle yet profound look at love, humanity, and whether human hearts are truly unique."
    }
  ],
  analytical: [
    {
      id: 203,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      coverColor: "linear-gradient(135deg, #4b5320 0%, #2e3b1c 100%)",
      genre: "Non-Fiction",
      synopsis: "Harari spans the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.",
      whyRead: "For readers seeking a grand, unified overview of how cognitive myths shaped modern human societies."
    },
    {
      id: 204,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      coverColor: "linear-gradient(135deg, #3d348b 0%, #7678ed 100%)",
      genre: "Non-Fiction",
      synopsis: "Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.",
      whyRead: "Crucial reading for understanding cognitive biases, systematic thinking errors, and decision-making logic."
    }
  ],
  escapist: [
    {
      id: 205,
      title: "Dune",
      author: "Frank Herbert",
      coverColor: "linear-gradient(135deg, #a86b32 0%, #6e401c 100%)",
      genre: "Sci-Fi",
      synopsis: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the Messiah of a hostile world.",
      whyRead: "An epochal planetary romance blending environmental theology, empire politics, and spice-trade wars."
    },
    {
      id: 206,
      title: "The Shadow of the Wind",
      author: "Carlos Ruiz Zafón",
      coverColor: "linear-gradient(135deg, #1C120C 0%, #4D331F 100%)",
      genre: "Mystery",
      synopsis: "Daniel Sempere is initiated into a secret vault where books are preserved, choosing a title that pulls him into dark Barcelona secrets.",
      whyRead: "A love letter to storytelling itself, rich in Gothic atmospheric detail, romance, and mystery."
    }
  ],
  compelling: [
    {
      id: 207,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverColor: "linear-gradient(135deg, #112d32 0%, #254b50 100%)",
      genre: "Classics",
      synopsis: "A portrait of the Jazz Age, following Jay Gatsby's obsessive pursuit of his former lover, Daisy Buchanan.",
      whyRead: "A slim volume packed with stunning prose and tragic narrative speed that demands to be read in a single sitting."
    },
    {
      id: 208,
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      coverColor: "linear-gradient(135deg, #9C3333 0%, #4C1212 100%)",
      genre: "Sci-Fi",
      synopsis: "Montag is a fireman whose job is to burn books, until he meets a young girl who shows him the beauty of ideas.",
      whyRead: "A fiery, urgent classic warning against intellectual apathy and mass culture control."
    }
  ]
};

const Recommendations = ({ libraryBooks, onAddBookToLibrary }) => {
  const [selectedMood, setSelectedMood] = useState('reflective');

  const moods = [
    { id: 'reflective', label: 'Reflective', desc: 'Poetic, gentle, and deep' },
    { id: 'analytical', label: 'Analytical', desc: 'Fact-driven, logical, and structured' },
    { id: 'escapist', label: 'Escapist', desc: 'Grand scale fantasy, sci-fi, and myth' },
    { id: 'compelling', label: 'Compelling', desc: 'Fast, urgent classics and dramas' }
  ];

  const handleAddRecommendation = (book) => {
    onAddBookToLibrary({
      ...book,
      progress: 0,
      pagesRead: 0,
      totalPages: 350, // default placeholder depth for recommendations
      rating: 0,
      highlights: [],
      category: 'to-read'
    });
  };

  const isBookInLibrary = (bookId) => {
    return libraryBooks.some(b => b.id === bookId);
  };

  return (
    <div className="recommendations-container container">
      
      <div className="recs-header">
        <span className="db-sub">Literary Oracle</span>
        <h2>Curated Recommendations</h2>
        <p>Declare your current reading disposition, and let Readify suggest your next volume.</p>
      </div>

      {/* Mood Selector row */}
      <div className="mood-selectors-grid">
        {moods.map((mood) => (
          <button 
            key={mood.id} 
            className={`mood-button ${selectedMood === mood.id ? 'active' : ''}`}
            onClick={() => setSelectedMood(mood.id)}
          >
            <Compass size={18} className="mood-icon" />
            <div className="mood-btn-text">
              <strong>{mood.label}</strong>
              <span>{mood.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Recommendations Display Panel */}
      <div className="recs-viewport">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedMood}
            className="recs-cards-row"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {RECOMMENDATIONS_DB[selectedMood].map((book) => {
              const added = isBookInLibrary(book.id);
              return (
                <div key={book.id} className="rec-card-box">
                  <div className="rec-card-body">
                    
                    <div className="rec-card-left">
                      <div className="rec-book-visual-wrapper">
                        <Book3D 
                          title={book.title} 
                          author={book.author} 
                          coverColor={book.coverColor} 
                          progress={0}
                          isOpen={false}
                        />
                      </div>
                    </div>

                    <div className="rec-card-right">
                      <span className="rec-editorial-stamp">
                        <Sparkles size={12} /> Editorial Choice
                      </span>
                      <h3>{book.title}</h3>
                      <span className="rec-author">By {book.author}</span>
                      
                      <div className="editorial-divider" style={{ margin: '1rem 0' }} />
                      
                      <p className="rec-synopsis">{book.synopsis}</p>
                      
                      <div className="rec-why-box">
                        <strong>Why you should read this:</strong>
                        <p>{book.whyRead}</p>
                      </div>

                      <div className="rec-actions">
                        {added ? (
                          <button className="btn-primary rec-add-btn added" disabled>
                            <CheckCircle size={14} /> Added to Shelf
                          </button>
                        ) : (
                          <button className="btn-primary rec-add-btn" onClick={() => handleAddRecommendation(book)}>
                            <Plus size={14} /> Add to Shelf <ArrowRight size={12} style={{ marginLeft: '4px' }} />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Recommendations;
