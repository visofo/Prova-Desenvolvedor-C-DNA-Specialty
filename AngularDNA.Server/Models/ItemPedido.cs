using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AngularDNA.Server.Models;

public class ItemPedido
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "O Id do Pedido do Item é obrigatório.")]
    [ForeignKey("PedidoId")]
    public int PedidoId { get; set; }

    public decimal ValorItem { get; set; }
    [JsonIgnore]
    public Pedido Pedido { get; set; }
    [Required(ErrorMessage = "O Id do Produto do Item é obrigatório.")]
    [ForeignKey("ProdutoId")]
    public int ProdutoId { get; set; }
    public Produto Produto { get; set; }
    [Required(ErrorMessage = "A Quantidade do Item é obrigatória.")]
    public int Quantidade { get; set; }
}