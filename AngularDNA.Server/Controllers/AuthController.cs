using AngularDNA.Server.Data;
using AngularDNA.Server.Helpers;
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
            .FirstOrDefaultAsync(u => u.Login == request.Login);

        if (usuario == null || !PasswordHelper.VerifyPassword(request.Senha, usuario.Senha))
        {
            return Unauthorized("Credenciais inválidas");
        }

        return Ok(new { usuario.Id, usuario.Nome });
    }
}

public class LoginRequest
{
    public string Login { get; set; }
    public string Senha { get; set; }
}