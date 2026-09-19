using System.Text;
using DyplomBooking2026.Data;
using DyplomBooking2026.Models;
using DyplomBooking2026.Services;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ---- Controllers / Swagger ----
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "WayGo API",
            Version = "v1"
        });

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Description = "JWT токен у форматі: Bearer {token}",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});

// ---- Forwarded headers ----
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// ---- Database ----
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString(
            "DefaultConnection")));

// ---- Identity ----
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ---- JWT + Google Authentication ----
var jwtSection =
    builder.Configuration.GetSection("Jwt");

var authBuilder = builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSection["Issuer"],
                ValidAudience = jwtSection["Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSection["Key"]!))
            };

        // Детальний лог помилок JWT — лише для Development,
        // щоб не засмічувати консоль/логи в проді і не світити
        // деталі валідації токена стороннім спостерігачам.
        if (builder.Environment.IsDevelopment())
        {
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    Console.WriteLine(
                        "===== JWT AUTH FAILED =====");

                    Console.WriteLine(
                        context.Exception.GetType().Name);

                    Console.WriteLine(
                        context.Exception.Message);

                    Console.WriteLine(
                        "===========================");

                    return Task.CompletedTask;
                },

                OnChallenge = context =>
                {
                    Console.WriteLine(
                        "===== JWT CHALLENGE =====");

                    Console.WriteLine(
                        $"Error: {context.Error}");

                    Console.WriteLine(
                        $"Description: {context.ErrorDescription}");

                    Console.WriteLine(
                        "=========================");

                    return Task.CompletedTask;
                }
            };
        }
    });

// ---- Google / Facebook OAuth (умовна реєстрація) ----
// ВАЖЛИВО: AddGoogle/AddFacebook викликають Options.Validate() для
// СВОЄЇ схеми одразу при першому зверненні до authentication-стека —
// а це відбувається навіть для звичайних JWT-запитів і для Swagger UI
// (AuthenticationHandlerProvider ініціалізує всі зареєстровані схеми).
// Якщо ClientId/AppId порожній (не задано ані в appsettings, ані в
// user-secrets), Validate() кидає ArgumentException "The value cannot
// be an empty string. (Parameter 'AppId'/'ClientId')" — і падає
// НАВІТЬ ЗАПИТ, що не має жодного стосунку до Google/Facebook.
//
// Тому реєструємо кожен провайдер, лише якщо для нього реально задано
// креденшели. Якщо ви ще не налаштували Google/Facebook OAuth App —
// просто не викликайте dotnet user-secrets для нього, і бекенд
// стартуватиме нормально; кнопки "Увійти через Google/Facebook" на
// фронтенді при цьому поверне 404 на неіснуючий ендпоінт — це очікувано.
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

if (!string.IsNullOrWhiteSpace(googleClientId) &&
    !string.IsNullOrWhiteSpace(googleClientSecret))
{
    authBuilder.AddGoogle(options =>
    {
        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
        options.CallbackPath = "/signin-google";
    });
}
else if (builder.Environment.IsDevelopment())
{
    Console.WriteLine(
        "[Auth] Google OAuth пропущено: не задано " +
        "Authentication:Google:ClientId/ClientSecret.");
}

var facebookAppId = builder.Configuration["Authentication:Facebook:AppId"];
var facebookAppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];

if (!string.IsNullOrWhiteSpace(facebookAppId) &&
    !string.IsNullOrWhiteSpace(facebookAppSecret))
{
    authBuilder.AddFacebook(options =>
    {
        options.AppId = facebookAppId;
        options.AppSecret = facebookAppSecret;
        options.CallbackPath = "/signin-facebook";
    });
}
else if (builder.Environment.IsDevelopment())
{
    Console.WriteLine(
        "[Auth] Facebook OAuth пропущено: не задано " +
        "Authentication:Facebook:AppId/AppSecret.");
}

builder.Services.AddAuthorization();

// ---- CORS ----
// Origin'и фронтенду беремо з конфігурації (Cors:AllowedOrigins),
// а не AllowAnyOrigin(): з wildcard-origin неможливо в майбутньому
// додати AllowCredentials() (куки/refresh-токени), і будь-який сайт
// міг би смикати наш публічний API з браузера користувача.
var allowedOrigins =
    builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// ---- Services ----
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PhotoService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<PaymentService>();

var app = builder.Build();

app.UseForwardedHeaders();
app.UseStaticFiles();


// ---- Database seed ----
using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    await DbCarSeeder.SeedAsync(context);
    await DbExcursionSeeder.SeedAsync(context);
}

using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

    var roleManager =
        scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

    var userManager =
        scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

    await DbSeeder.SeedAsync(
        context,
        roleManager,
        userManager);
}

// ---- Review seed ----
await ReviewSeeder.SeedAsync(app.Services);

// ---- Middleware ----
if (app.Environment.IsDevelopment()){
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseStaticFiles();

// Порядок важливий: CORS -> Authentication -> Authorization.
// Authentication має йти до Authorization, інакше [Authorize]
// відпрацьовує раніше, ніж встановлено User/Principal з токена.
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
