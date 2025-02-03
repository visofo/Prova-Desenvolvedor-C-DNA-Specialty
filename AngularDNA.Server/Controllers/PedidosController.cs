using AngularDNA.Server.Models;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AngularDNA.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularDNA.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly DataContext _context;

    public PedidosController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("Create")]
    //[Authorize]
    public async Task<ActionResult<Pedido>> CreatePedido([FromBody] PedidoInputModel pedidoInput)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(pedidoInput.ClienteId);
            if (cliente == null)
            {
                return BadRequest("Cliente inválido.");
            }

            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.Name)?.Value);

            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                return BadRequest("Usuário inválido.");
            }
            var pedido = new Pedido
            {
                ClienteId = pedidoInput.ClienteId,
                UsuarioId = usuarioId,
                DataPedido = DateTime.Now,
                ItensPedido = new List<ItemPedido>()
            };
            decimal total = 0;
            foreach (var itemInput in pedidoInput.Itens)
            {
                var produto = await _context.Produtos.FindAsync(itemInput.ProdutoId);
                if (produto == null)
                {
                    return BadRequest($"Produto {itemInput.ProdutoId} inválido.");
                }
                var item = new ItemPedido
                {
                    ProdutoId = itemInput.ProdutoId,
                    Quantidade = itemInput.Quantidade
                };
                total += produto.Preco * item.Quantidade;
                pedido.ItensPedido.Add(item);
            }

            pedido.ValorTotal = total;
            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = pedido.Id }, pedido);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Pedido>> GetById(int id)
    {
        var pedido = await _context.Pedidos
            .Include(p => p.Cliente)
            .Include(p => p.Usuario)
            .Include(p => p.ItensPedido)
            .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(p => p.Id == id);

        return pedido == null ? NotFound() : pedido;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<Pedido>>> Get()
    {
        try
        {
            var lista = await _context.Pedidos.Include(x => x.Usuario).Include(x => x.Cliente).Include(x => x.ItensPedido).ToListAsync();
            return Ok(lista);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    //[HttpGet("{id}")]
    //[Authorize]
    //public async Task<ActionResult<Pedido>> Get(int id)
    //{
    //    try
    //    {
    //        var pedido = await _context.Pedidos.Include(x => x.Usuario).Include(x => x.Cliente).Include(x => x.ItensPedido).FirstOrDefaultAsync(x => x.Id == id);
    //        if (pedido == null)
    //        {
    //            return NotFound();
    //        }
    //        return Ok(pedido);
    //    }
    //    catch (Exception ex)
    //    {
    //        return BadRequest(ex.Message);
    //    }
    //}

    [HttpPost]
    //[Authorize]
    public async Task<ActionResult<Pedido>> Post([FromBody] PedidoInputModel pedidoInput)
    {

        try
        {
            var cliente = await _context.Clientes.FindAsync(pedidoInput.ClienteId);
            if (cliente == null)
            {
                return BadRequest("Cliente inválido.");
            }

            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.Name)?.Value);

            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                return BadRequest("Usuário inválido.");
            }
            var pedido = new Pedido
            {
                ClienteId = pedidoInput.ClienteId,
                UsuarioId = usuarioId,
                DataPedido = DateTime.Now,
                ItensPedido = new List<ItemPedido>()
            };
            decimal total = 0;
            foreach (var itemInput in pedidoInput.Itens)
            {
                var produto = await _context.Produtos.FindAsync(itemInput.ProdutoId);
                if (produto == null)
                {
                    return BadRequest($"Produto {itemInput.ProdutoId} inválido.");
                }
                var item = new ItemPedido
                {
                    ProdutoId = itemInput.ProdutoId,
                    Quantidade = itemInput.Quantidade
                };
                total += produto.Preco * item.Quantidade;
                pedido.ItensPedido.Add(item);
            }

            pedido.ValorTotal = total;
            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = pedido.Id }, pedido);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    //[Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] PedidoInputModel pedidoInput)
    {
        try
        {
            if (id != pedidoInput.Id)
            {
                return BadRequest();
            }

            var pedido = await _context.Pedidos.Include(x => x.ItensPedido).FirstOrDefaultAsync(x => x.Id == id);

            if (pedido == null)
                return NotFound();

            var cliente = await _context.Clientes.FindAsync(pedidoInput.ClienteId);
            if (cliente == null)
            {
                return BadRequest("Cliente inválido.");
            }

            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.Name)?.Value);

            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                return BadRequest("Usuário inválido.");
            }
            pedido.ClienteId = pedidoInput.ClienteId;
            pedido.UsuarioId = usuarioId;
            pedido.DataPedido = DateTime.Now;
            decimal total = 0;
            pedido.ItensPedido.Clear();
            foreach (var itemInput in pedidoInput.Itens)
            {
                var produto = await _context.Produtos.FindAsync(itemInput.ProdutoId);
                if (produto == null)
                {
                    return BadRequest($"Produto {itemInput.ProdutoId} inválido.");
                }
                var item = new ItemPedido
                {
                    ProdutoId = itemInput.ProdutoId,
                    Quantidade = itemInput.Quantidade
                };
                total += produto.Preco * item.Quantidade;
                pedido.ItensPedido.Add(item);
            }

            pedido.ValorTotal = total;
            _context.Entry(pedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    //[Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return NotFound();
            }

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private bool PedidoExists(int id)
    {
        return _context.Pedidos.Any(e => e.Id == id);
    }
}
public class PedidoInputModel
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public List<ItemInputModel> Itens { get; set; }
}
public class ItemInputModel
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
}
