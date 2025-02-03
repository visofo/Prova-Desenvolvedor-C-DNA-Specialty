using System.Collections.Generic;
using System.Linq;
using AngularDNA.Server.Data;
using AngularDNA.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularDNA.Server.Services
{
    public class ProdutoService
    {
        private readonly DataContext _context;

        public ProdutoService(DataContext context)
        {
            _context = context;
        }

         public List<Produto> ObterTodos()
        {
            return _context.Produtos.ToList();
        }

        public Produto ObterPorId(int id)
        {
            return _context.Produtos.Find(id);
        }

        public void Criar(Produto produto)
        {
            _context.Produtos.Add(produto);
            _context.SaveChanges();
        }

        public void Atualizar(int id, Produto produto)
        {
            var produtoExistente = _context.Produtos.Find(id);
            if (produtoExistente != null)
            {
                produtoExistente.Nome = produto.Nome;
                produtoExistente.Preco = produto.Preco;
                _context.Produtos.Update(produtoExistente);
                _context.SaveChanges();
            }
        }

          public void Excluir(int id)
        {
             var produto = _context.Produtos.Find(id);
            if (produto != null)
            {
                _context.Produtos.Remove(produto);
                _context.SaveChanges();
            }
        }
    }
}