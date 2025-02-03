using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AngularDNA.Server.Data;
using AngularDNA.Server.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace AngularDNA.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(DataContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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

        // Gera o token JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:Secret").Value);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, usuario.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        // Retorna o token JWT
        return Ok(new
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Token = tokenString
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        if (string.IsNullOrEmpty(token))
        {
            return BadRequest("Token não fornecido.");
        }

        var jwtToken = new JwtSecurityTokenHandler().ReadToken(token) as JwtSecurityToken;
        if (jwtToken == null)
        {
            return BadRequest("Token inválido.");
        }

        var expiration = jwtToken.ValidTo;
        TokenStore.RevokeToken(token, expiration);

        return Ok("Logout realizado com sucesso.");
    }
}

public class LoginRequest
{
    public string Login { get; set; }
    public string Senha { get; set; }
}