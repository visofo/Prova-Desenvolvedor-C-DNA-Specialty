using System.ComponentModel.DataAnnotations;

namespace AngularDNA.Server.Models;

public class Produto
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "O Nome do Produto é obrigatório.")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O Preço do Produto é obrigatório.")]
    public decimal Preco { get; set; }
}