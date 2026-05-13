using BadmintonShop.Core.Interfaces;
using BadmintonShop.Infrastructure.Data;
using BadmintonShop.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Đăng ký Services (DI)
// =====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "BadmintonShop API",
        Version = "v1",
        Description = "API quản lý cửa hàng cầu lông - .NET 8"
    });
});

// Database (InMemory - chạy ngay không cần SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("BadmintonShopDb"));

// Repository
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// =====================
// Middleware Pipeline
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BadmintonShop API v1");
        c.RoutePrefix = string.Empty; // Swagger ở trang chủ /
    });
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
