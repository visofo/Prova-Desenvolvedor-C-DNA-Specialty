using System.Collections.Concurrent;

namespace AngularDNA.Server.Helpers;

public static class TokenStore
{
    private static readonly ConcurrentDictionary<string, DateTime> RevokedTokens = new();

    public static void RevokeToken(string token, DateTime expiration)
    {
        RevokedTokens[token] = expiration;
    }

    public static bool IsTokenRevoked(string token)
    {
        return RevokedTokens.ContainsKey(token);
    }

    public static void CleanupExpiredTokens()
    {
        var now = DateTime.UtcNow;
        foreach (var token in RevokedTokens.Keys)
        {
            if (RevokedTokens[token] < now)
            {
                RevokedTokens.TryRemove(token, out _);
            }
        }
    }
}
