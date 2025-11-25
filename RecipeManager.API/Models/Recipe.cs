namespace RecipeManager.API.Models;

public class Recipe
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Ingredients { get; set; } = new();
    public List<string> Steps { get; set; } = new();
    public string Difficulty { get; set; } = string.Empty;
    public string EstimatedTime { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = "Other";
    public List<Comment> Comments { get; set; } = new();
}
