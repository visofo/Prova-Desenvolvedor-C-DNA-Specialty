using AngularDNA.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularDNA.Server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItemPedidos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pedido>()
          .HasOne(p => p.Cliente)
          .WithMany()
          .HasForeignKey(p => p.ClienteId)
          .OnDelete(DeleteBehavior.Restrict); // Evitar exclusão em cascata para clientes

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.Usuario)
            .WithMany()
            .HasForeignKey(p => p.UsuarioId)
           .OnDelete(DeleteBehavior.Restrict); // Evitar exclusão em cascata para usuários

        modelBuilder.Entity<ItemPedido>()
            .HasOne(i => i.Produto)
            .WithMany()
           .HasForeignKey(i => i.ProdutoId)
            .OnDelete(DeleteBehavior.Restrict); // Evitar exclusão em cascata para produtos

        modelBuilder.Entity<Produto>()
                .Property(p => p.Preco)
                .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Pedido>()
            .Property(p => p.ValorTotal)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<ItemPedido>()
            .Property(i => i.ValorItem)
            .HasColumnType("decimal(18,2)");
    }
}
