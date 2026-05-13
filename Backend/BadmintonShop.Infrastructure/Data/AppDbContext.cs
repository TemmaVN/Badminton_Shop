using BadmintonShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BadmintonShop.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Vợt Yonex Astrox 99 Pro", Brand = "Yonex", Category = "Vợt cầu lông", Description = "Vợt tấn công chuyên nghiệp, cứng đầu vợt", Price = 4500000, Stock = 15 },
            new Product { Id = 2, Name = "Vợt Victor Thruster K 9900", Brand = "Victor", Category = "Vợt cầu lông", Description = "Vợt cao cấp dành cho người chơi tốc độ", Price = 3800000, Stock = 10 },
            new Product { Id = 3, Name = "Cầu lông Yonex AS-50", Brand = "Yonex", Category = "Cầu lông", Description = "Cầu lông lông ngỗng cao cấp thi đấu", Price = 850000, Stock = 100 },
            new Product { Id = 4, Name = "Giày Yonex Power Cushion 65Z3", Brand = "Yonex", Category = "Giày cầu lông", Description = "Giày thi đấu chuyên nghiệp, đệm khí", Price = 3200000, Stock = 20 },
            new Product { Id = 5, Name = "Túi vợt Victor BR9212", Brand = "Victor", Category = "Phụ kiện", Description = "Túi đựng vợt 9 ngăn chống nước", Price = 1200000, Stock = 30 },
            new Product { Id = 6, Name = "Dây căng Yonex BG80", Brand = "Yonex", Category = "Phụ kiện", Description = "Dây căng chịu lực cao, kiểm soát tốt", Price = 150000, Stock = 200 }
        );
    }
}
