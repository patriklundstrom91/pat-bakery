using System.Text.Json;
using RecipeManager.API.Models;

namespace RecipeManager.API.Services;

public class RecipeService
{
    private readonly List<Recipe> _recipes = new();
    private int _nextId = 1;
    private readonly string _dataFilePath = "Data/recipes.json";

    public RecipeService()
    {
        LoadRecipes();
    }

    private void LoadRecipes()
    {
        try
        {
            if (File.Exists(_dataFilePath))
            {
                var json = File.ReadAllText(_dataFilePath);
                var recipes = JsonSerializer.Deserialize<List<Recipe>>(json);
                if (recipes != null && recipes.Count > 0)
                {
                    _recipes.AddRange(recipes);
                    _nextId = recipes.Max(r => r.Id) + 1;
                    return;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading recipes: {ex.Message}");
        }

        // Seed data if no file exists or loading failed
        SeedData();
    }

    private void SeedData()
    {
        Add(new Recipe
        {
            Title = "Grandma's Apple Pie",
            Description = "A classic apple pie recipe passed down through generations.",
            Ingredients = new List<string> { "Apples", "Flour", "Sugar", "Butter", "Cinnamon" },
            Steps = new List<string> { "Peel and slice apples", "Mix dough", "Fill pie", "Bake at 180C for 45 mins" },
            Difficulty = "Medium",
            EstimatedTime = "90 mins",
            Category = "Pastry"
        });
        
        Add(new Recipe
        {
            Title = "Simple Pancakes",
            Description = "Fluffy pancakes for a perfect breakfast.",
            Ingredients = new List<string> { "Flour", "Milk", "Eggs", "Baking Powder", "Sugar" },
            Steps = new List<string> { "Mix dry ingredients", "Whisk wet ingredients", "Combine", "Cook on griddle" },
            Difficulty = "Easy",
            EstimatedTime = "20 mins",
            Category = "No-Bake"
        });
    }

    private void SaveRecipes()
    {
        try
        {
            var directory = Path.GetDirectoryName(_dataFilePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(_recipes, options);
            File.WriteAllText(_dataFilePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving recipes: {ex.Message}");
        }
    }

    public List<Recipe> GetAll() => _recipes;

    public Recipe? GetById(int id) => _recipes.FirstOrDefault(r => r.Id == id);

    public Recipe Add(Recipe recipe)
    {
        recipe.Id = _nextId++;
        _recipes.Add(recipe);
        SaveRecipes();
        return recipe;
    }

    public bool Update(int id, Recipe updatedRecipe)
    {
        var existing = GetById(id);
        if (existing == null) return false;

        existing.Title = updatedRecipe.Title;
        existing.Description = updatedRecipe.Description;
        existing.Ingredients = updatedRecipe.Ingredients;
        existing.Steps = updatedRecipe.Steps;
        existing.Difficulty = updatedRecipe.Difficulty;
        existing.EstimatedTime = updatedRecipe.EstimatedTime;
        existing.ImageUrl = updatedRecipe.ImageUrl;
        existing.Category = updatedRecipe.Category;

        SaveRecipes();
        return true;
    }

    public bool Delete(int id)
    {
        var recipe = GetById(id);
        if (recipe == null) return false;
        _recipes.Remove(recipe);
        SaveRecipes();
        return true;
    }

    public bool AddComment(int recipeId, Comment comment)
    {
        var recipe = GetById(recipeId);
        if (recipe == null) return false;

        comment.Id = recipe.Comments.Count > 0 ? recipe.Comments.Max(c => c.Id) + 1 : 1;
        comment.CreatedAt = DateTime.UtcNow;
        recipe.Comments.Add(comment);
        SaveRecipes();
        return true;
    }

    public bool DeleteComment(int recipeId, int commentId)
    {
        var recipe = GetById(recipeId);
        if (recipe == null) return false;

        var comment = recipe.Comments.FirstOrDefault(c => c.Id == commentId);
        if (comment == null) return false;

        recipe.Comments.Remove(comment);
        SaveRecipes();
        return true;
    }
}
