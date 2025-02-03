using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace AngularDNA.Server.Models;

public class Pedido
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "O Cliente do Pedido é obrigatório.")]
    [ForeignKey("ClienteId")]
    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; }
    [Required(ErrorMessage = "O Usuário do Pedido é obrigatório.")]
    [ForeignKey("UsuarioId")]
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; }
    [Required(ErrorMessage = "O Data do Pedido é obrigatória.")]
    public DateTime DataPedido { get; set; } = DateTime.Now;

    public decimal ValorTotal { get; set; }
    public List<ItemPedido> ItensPedido { get; set; }
}