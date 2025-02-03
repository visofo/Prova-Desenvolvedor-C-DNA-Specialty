using System.ComponentModel.DataAnnotations;

namespace AngularDNA.Server.Models;

public class Cliente
{
    [Key]
    public int Id { get; set; }
    [Required(ErrorMessage = "O CNPJ do Cliente é obrigatório.")]
    public string CNPJ { get; set; }

    [Required(ErrorMessage = "A Razão Social do Cliente é obrigatória.")]
    public string RazaoSocial { get; set; }
}
