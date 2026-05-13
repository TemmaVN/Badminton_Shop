using BadmintonShop.Core.Entities;
using BadmintonShop.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;

    public ProductsController(IProductRepository repository)
    {
        _repository = repository;
    }

    /// <summary>Lấy danh sách tất cả sản phẩm</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        => Ok(await _repository.GetAllAsync());

    /// <summary>Lấy sản phẩm theo ID</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await _repository.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    /// <summary>Lấy sản phẩm theo danh mục</summary>
    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategory(string category)
        => Ok(await _repository.GetByCategoryAsync(category));

    /// <summary>Tạo sản phẩm mới</summary>
    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] Product product)
    {
        var created = await _repository.CreateAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Cập nhật sản phẩm</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> Update(int id, [FromBody] Product product)
    {
        var updated = await _repository.UpdateAsync(id, product);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>Xóa sản phẩm</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repository.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
