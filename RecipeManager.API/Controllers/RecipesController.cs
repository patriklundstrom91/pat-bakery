using Microsoft.AspNetCore.Mvc;
using RecipeManager.API.Models;
using RecipeManager.API.Services;

namespace RecipeManager.API.Controllers;

[ApiController]
[Route("[controller]")]
public class RecipesController : ControllerBase
{
    private readonly RecipeService _recipeService;

    public RecipesController(RecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    [HttpGet]
    public ActionResult<List<Recipe>> GetAll()
    {
        return Ok(_recipeService.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<Recipe> GetById(int id)
    {
        var recipe = _recipeService.GetById(id);
        if (recipe == null) return NotFound();
        return Ok(recipe);
    }

    [HttpPost]
    public ActionResult<Recipe> Create(Recipe recipe)
    {
        var created = _recipeService.Add(recipe);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Recipe recipe)
    {
        if (id != recipe.Id && recipe.Id != 0) return BadRequest("ID mismatch");
        
        var updated = _recipeService.Update(id, recipe);
        if (!updated) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _recipeService.Delete(id);
        if (!deleted) return NotFound();
        
        return NoContent();
    }

    [HttpPost("upload-image")]
    public async Task<ActionResult<string>> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only jpg, jpeg, png, and gif are allowed.");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadsFolder = Path.Combine("wwwroot", "images");
        
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/{fileName}";
        return Ok(new { imageUrl });
    }

    [HttpPost("{id}/comments")]
    public ActionResult AddComment(int id, Comment comment)
    {
        var success = _recipeService.AddComment(id, comment);
        if (!success) return NotFound();
        return Ok(comment);
    }

    [HttpDelete("{id}/comments/{commentId}")]
    public IActionResult DeleteComment(int id, int commentId)
    {
        var success = _recipeService.DeleteComment(id, commentId);
        if (!success) return NotFound();
        return NoContent();
    }
}
