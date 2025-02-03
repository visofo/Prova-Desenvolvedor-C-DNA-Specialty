using AngularDNA.Server.Data;
using AngularDNA.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace AngularDNA.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _configuration;

    public UsuarioController(DataContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    //[Authorize]
    public async Task<ActionResult<List<Usuario>>> Get()
    {
        try
        {
            var lista = await _context.Usuarios.ToListAsync();
            return Ok(lista);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}")]
    //[Authorize]
    public async Task<ActionResult<Usuario>> Get(int id)
    {
        try
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    //[Authorize]
    public async Task<ActionResult<Usuario>> Post([FromBody] Usuario usuario)
    {
        try
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = usuario.Id }, usuario);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    //[Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] Usuario usuario)
    {
        try
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] Usuario usuario)
    {
        try
        {
            var userLogado = await _context.Usuarios.FirstOrDefaultAsync(p => p.Login == usuario.Login && p.Senha == usuario.Senha);

            if (userLogado == null)
                return BadRequest("Login ou senha inválidos!");

            var token = GerarToken(userLogado);
            return Ok(new { token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }


    private string GerarToken(Usuario usuario)
    {
        var key = System.Text.Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:Secret").Value);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
             {
                    new Claim(ClaimTypes.Name, usuario.Id.ToString())
             }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    private bool UsuarioExists(int id)
    {
        return _context.Usuarios.Any(e => e.Id == id);
    }
}