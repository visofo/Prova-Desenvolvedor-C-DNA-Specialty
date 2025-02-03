using AngularDNA.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularDNA.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DataContext _context;

    public AuthController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Login == request.Login && u.Senha == request.Senha);

        return usuario == null
            ? Unauthorized("Credenciais inválidas")
            : Ok(new { usuario.Id, usuario.Nome });
    }
}

public class LoginRequest
{
    public string Login { get; set; }
    public string Senha { get; set; }
}