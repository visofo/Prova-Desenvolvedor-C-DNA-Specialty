using System.Collections.Generic;
using System.Linq;
using AngularDNA.Server.Data;
using AngularDNA.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularDNA.Server.Services
{
    public class UsuarioService
    {
        private readonly DataContext _context;

        public UsuarioService(DataContext context)
        {
            _context = context;
        }

         public List<Usuario> ObterTodos()
        {
            return _context.Usuarios.ToList();
        }

        public Usuario ObterPorId(int id)
        {
            return _context.Usuarios.Find(id);
        }

        public void Criar(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
        }

        public void Atualizar(int id, Usuario usuario)
        {
            var usuarioExistente = _context.Usuarios.Find(id);
            if (usuarioExistente != null)
            {
                usuarioExistente.Nome = usuario.Nome;
                usuarioExistente.CPF = usuario.CPF;
                usuarioExistente.Login = usuario.Login;
                usuarioExistente.Senha = usuario.Senha;
                 _context.Usuarios.Update(usuarioExistente);
                _context.SaveChanges();
            }
        }

         public void Excluir(int id)
        {
            var usuario = _context.Usuarios.Find(id);
            if (usuario != null)
            {
                _context.Usuarios.Remove(usuario);
                _context.SaveChanges();
            }
        }
    }
}