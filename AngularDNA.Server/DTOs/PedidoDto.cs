using System;
using System.Collections.Generic;

namespace AngularDNA.Server.DTOs
{
    public class PedidoDto
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public DateTime DataPedido { get; set; }
        public int UsuarioId { get; set; }
        public List<ItemPedidoDto> ItensPedido { get; set; }
        public decimal ValorTotal { get; set; }
    }
    public class ItemPedidoDto
    {
        public int Id { get; set; }
        public int PedidoId { get; set; }
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
        public decimal ValorItem { get; set; }
    }
}