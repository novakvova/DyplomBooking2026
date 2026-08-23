using System.Net;
using MaxMind.GeoIP2;
using Microsoft.AspNetCore.Mvc;

namespace WayGo.Api.Controllers;

[ApiController]
[Route("api/location")]
public class GeoLocationController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public GeoLocationController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpGet("country")]
    public IActionResult GetCountry()
    {
        var ip = HttpContext.Connection.RemoteIpAddress;

        if (ip == null)
        {
            return Ok(new
            {
                countryCode = (string?)null
            });
        }

        if (ip.IsIPv4MappedToIPv6)
        {
            ip = ip.MapToIPv4();
        }

        // Localhost не можна визначити через GeoIP.
        if (IPAddress.IsLoopback(ip))
        {
            return Ok(new
            {
                countryCode = (string?)null
            });
        }

        var databasePath = Path.Combine(
            _environment.ContentRootPath,
            "GeoIP",
            "GeoLite2-Country.mmdb"
        );

        if (!System.IO.File.Exists(databasePath))
        {
            return Ok(new
            {
                countryCode = (string?)null
            });
        }

        try
        {
            using var reader = new DatabaseReader(databasePath);

            var response = reader.Country(ip);

            return Ok(new
            {
                countryCode = response.Country.IsoCode
            });
        }
        catch (Exception error)
        {
            Console.WriteLine(
                $"GeoIP country detection error: {error.Message}"
            );

            return Ok(new
            {
                countryCode = (string?)null
            });
        }
    }
}