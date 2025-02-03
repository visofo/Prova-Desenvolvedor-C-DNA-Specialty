using AngularDNA.Server.Data;
using AngularDNA.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularDNA.Server.Services;

public class PedidoService
    {
        private readonly DataContext _context;

        public PedidoService(DataContext context)
        {
            _context = context;
        }

        public List<Pedido> ObterTodos()
        {
            return _context.Pedidos
            .Include(o => o.Cliente)
            .Include(o => o.ItensPedido)
            .ThenInclude(oi => oi.Produto)
            .ToList();
        }

        public Pedido ObterPorId(int id)
        {
            return _context.Pedidos
                 .Include(o => o.Cliente)
                 .Include(o => o.ItensPedido)
                 .ThenInclude(oi => oi.Produto)
                .FirstOrDefault(o => o.Id == id);
        }

         public void Criar(Pedido pedido)
        {
            _context.Pedidos.Add(pedido);
            _context.SaveChanges();

              foreach (var item in pedido.ItensPedido)
             {
                 var produto = _context.Produtos.Find(item.ProdutoId);
                 if(produto!=null){
                     item.ValorItem = produto.Preco;
                      item.PedidoId = pedido.Id;
                       _context.ItemPedidos.Add(item);
                      _context.SaveChanges();
                 }

             }
        }
         public void Atualizar(int id, Pedido pedido)
         {
            var pedidoExistente = _context.Pedidos
               .Include(o => o.ItensPedido)
               .FirstOrDefault(o => o.Id == id);

             if (pedidoExistente != null)
             {
                 pedidoExistente.ClienteId = pedido.ClienteId;
                pedidoExistente.ItensPedido.Clear();
                _context.ItemPedidos.RemoveRange(pedidoExistente.ItensPedido);


               foreach (var item in pedido.ItensPedido)
                {
                     var produto = _context.Produtos.Find(item.ProdutoId);
                      if (produto != null)
                    {
                        item.ValorItem = produto.Preco;
                         item.PedidoId = pedidoExistente.Id;
                        _context.ItemPedidos.Add(item);
                       _context.SaveChanges();
                    }

                }
              pedidoExistente.ValorTotal = pedido.ValorTotal;
              _context.Pedidos.Update(pedidoExistente);
               _context.SaveChanges();
            }
        }

          public void Excluir(int id)
        {
             var pedido = _context.Pedidos.Find(id);
            if (pedido != null)
            {
                _context.Pedidos.Remove(pedido);
                _context.SaveChanges();
            }
        }
    }