import type { Recipe } from '../types/Recipe.ts';

const API_URL = 'http://localhost:5247/recipes';

export const getRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch recipe');
  return response.json();
};

export const createRecipe = async (recipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) throw new Error('Failed to create recipe');
  return response.json();
};

export const updateRecipe = async (id: number, recipe: Recipe): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) throw new Error('Failed to update recipe');
};

export const deleteRecipe = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete recipe');
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:5247/recipes/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload image');
  
  const data = await response.json();
  return data.imageUrl;
};

export const addComment = async (recipeId: number, author: string, text: string): Promise<void> => {
  const response = await fetch(`http://localhost:5247/recipes/${recipeId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
};

export const deleteComment = async (recipeId: number, commentId: number): Promise<void> => {
  const response = await fetch(`http://localhost:5247/recipes/${recipeId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete comment');
};
