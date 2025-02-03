using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AngularDNA.Server.Models;

public class Usuario
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "O Nome do Usuário é obrigatório.")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O CPF do Usuário é obrigatório.")]
    public string CPF { get; set; }

    [Required(ErrorMessage = "O Login do Usuário é obrigatório.")]
    public string Login { get; set; }

    //[JsonIgnore]
    [Required(ErrorMessage = "A Senha do Usuário é obrigatória.")]
    public string Senha { get; set; }
}