import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Recipe } from '../types/Recipe';
import { createRecipe, getRecipeById, updateRecipe, uploadImage } from '../services/api';

export const RecipeForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    difficulty: 'Medium',
    estimatedTime: '',
    imageUrl: undefined,
    category: 'Other',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getRecipeById(Number(id)).then((recipe) => {
        setFormData({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          difficulty: recipe.difficulty,
          estimatedTime: recipe.estimatedTime,
          imageUrl: recipe.imageUrl,
          category: recipe.category || 'Other',
        });
        if (recipe.imageUrl) {
          setImagePreview(`http://localhost:5247${recipe.imageUrl}`);
        }
      });
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (index: number, value: string, field: 'ingredients' | 'steps') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'ingredients' | 'steps') => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index: number, field: 'ingredients' | 'steps') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new file was selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const recipeData = { ...formData, imageUrl };

      if (isEdit && id) {
        await updateRecipe(Number(id), { ...recipeData, id: Number(id) });
      } else {
        await createRecipe(recipeData);
      }
      navigate('/');
    } catch (err) {
      alert('Failed to save recipe');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Recipes
      </Link>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isEdit ? 'Edit Recipe' : 'New Recipe'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div className="input-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
        </div>

        <div className="input-group">
          <label>Recipe Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            style={{ marginBottom: '1rem' }}
          />
          {imagePreview && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Estimated Time</label>
            <input name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} placeholder="e.g. 45 mins" required />
          </div>
          <div className="input-group">
            <label>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="input-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Cake">Cake</option>
              <option value="Cookies">Cookies</option>
              <option value="No-Bake">No-Bake</option>
              <option value="Bread">Bread</option>
              <option value="Pastry">Pastry</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                value={ingredient}
                onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
                placeholder={`Ingredient ${index + 1}`}
                required
              />
              <button type="button" onClick={() => removeArrayItem(index, 'ingredients')} className="btn btn-danger" style={{ padding: '0 1rem' }}>X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('ingredients')} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>+ Add Ingredient</button>
        </div>

        <div className="input-group">
          <label>Steps</label>
          {formData.steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <textarea
                value={step}
                onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
                placeholder={`Step ${index + 1}`}
                rows={2}
                required
              />
              <button type="button" onClick={() => removeArrayItem(index, 'steps')} className="btn btn-danger" style={{ padding: '0 1rem' }}>X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('steps')} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>+ Add Step</button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }} disabled={uploading}>
            {uploading ? 'Uploading...' : (isEdit ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </div>
      </form>
    </div>
  );
};
