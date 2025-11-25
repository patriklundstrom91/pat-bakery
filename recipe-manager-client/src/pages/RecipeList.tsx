import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types/Recipe';
import { getRecipes } from '../services/api';

export const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch(() => setError('Failed to load recipes'))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading) return <div className="spinner"></div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Beloved Recipes</h1>
      
      {/* Filter Section */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {/* Search */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>🔍 Search Recipes</label>
            <input 
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>🍰 Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Cake">Cake</option>
              <option value="Cookies">Cookies</option>
              <option value="No-Bake">No-Bake</option>
              <option value="Bread">Bread</option>
              <option value="Pastry">Pastry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>📊 Difficulty</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--color-warm-brown)' }}>Active filters:</span>
            {searchTerm && (
              <span style={{ 
                backgroundColor: 'var(--color-pastel-pink)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem' }}
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span style={{ 
                backgroundColor: 'var(--color-gold)', 
                color: 'white',
                padding: '0.25rem 0.75rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('All')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem', color: 'white' }}
                >
                  ×
                </button>
              </span>
            )}
            {selectedDifficulty !== 'All' && (
              <span style={{ 
                backgroundColor: 'var(--color-pastel-blue)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {selectedDifficulty}
                <button 
                  onClick={() => setSelectedDifficulty('All')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem' }}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </p>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredRecipes.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card">
                <img 
                  src={recipe.imageUrl ? `http://localhost:5247${recipe.imageUrl}` : '/images/no-image.png'} 
                  alt={recipe.title}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: 'var(--radius-md)', 
                    marginBottom: '1rem' 
                  }}
                />
                {recipe.category && (
                  <span style={{ 
                    display: 'inline-block',
                    backgroundColor: 'var(--color-gold)', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>
                    {recipe.category}
                  </span>
                )}
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{recipe.title}</h2>
                <p style={{ color: '#666', marginBottom: '1rem' }}>{recipe.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#8d6e63' }}>
                  <span>⏱️ {recipe.estimatedTime}</span>
                  <span>📊 {recipe.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No recipes found</p>
          <p>Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};
