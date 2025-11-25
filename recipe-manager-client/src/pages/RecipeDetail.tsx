import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Recipe } from '../types/Recipe';
import { getRecipeById, deleteRecipe } from '../services/api';
import { CommentSection } from '../components/CommentSection';

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = () => {
    if (id) {
      getRecipeById(Number(id))
        .then(setRecipe)
        .catch(() => setError('Failed to load recipe'))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(Number(id));
        navigate('/');
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (error || !recipe) return <div style={{ color: 'red', textAlign: 'center' }}>{error || 'Recipe not found'}</div>;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Recipes
      </Link>
      {recipe.imageUrl && (
        <img 
          src={`http://localhost:5247${recipe.imageUrl}`}
          alt={recipe.title}
          style={{ 
            width: '100%', 
            maxHeight: '400px', 
            objectFit: 'cover', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem' 
          }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          {recipe.category && (
            <span style={{ 
              display: 'inline-block',
              backgroundColor: 'var(--color-gold)', 
              color: 'white', 
              padding: '0.35rem 1rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.85rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem'
            }}>
              {recipe.category}
            </span>
          )}
          <h1 style={{ marginBottom: '0.5rem' }}>{recipe.title}</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>{recipe.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/edit/${recipe.id}`} className="btn btn-secondary">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: '#8d6e63', fontWeight: 'bold' }}>
        <span>⏱️ Time: {recipe.estimatedTime}</span>
        <span>📊 Difficulty: {recipe.difficulty}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        <div>
          <h3 style={{ borderBottom: '2px solid #F8E1E7', paddingBottom: '0.5rem' }}>Ingredients</h3>
          <ul style={{ paddingLeft: '1.2rem' }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ borderBottom: '2px solid #F8E1E7', paddingBottom: '0.5rem' }}>Instructions</h3>
          <ol style={{ paddingLeft: '1.2rem' }}>
            {recipe.steps.map((step, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <CommentSection 
        recipeId={recipe.id} 
        comments={recipe.comments || []} 
        onCommentAdded={loadRecipe}
      />
    </div>
  );
};
