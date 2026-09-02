using Microsoft.AspNetCore.Localization;
using System.Globalization;
using PersonalWebCore.Interfaces;
using PersonalWebCore.Services;
using PersonalWebCore.Helpers;
using PersonalWebInfrastructure.ExternalServices;

var builder = WebApplication.CreateBuilder(args);

// ===== CONFIGURAR SERVICIOS =====

// Controllers
builder.Services.AddControllers();

// Configurar localizaci�n
builder.Services.AddLocalization();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[]
    {
        new CultureInfo("es"),
        new CultureInfo("en"),
        new CultureInfo("ca")
    };

    options.DefaultRequestCulture = new RequestCulture("es");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;

    // Detectar idioma desde header Accept-Language
    options.RequestCultureProviders.Insert(0, new AcceptLanguageHeaderRequestCultureProvider());
});

// Registrar servicios de aplicaci�n
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
// Email Service: use Gmail SMTP if password is configured, otherwise console stub (dev only)
var smtpPassword = builder.Configuration["Smtp:Password"];
if (!string.IsNullOrEmpty(smtpPassword))
    builder.Services.AddScoped<IEmailService, SmtpEmailClient>();
else if (builder.Environment.IsDevelopment())
    builder.Services.AddScoped<IEmailService, DevEmailClient>();
else
    throw new InvalidOperationException("Smtp:Password must be configured in production.");
// GitHub Service con HttpClient
builder.Services.AddHttpClient<IGitHubService, GitHubApiClient>();

// Memory Cache para GitHub
builder.Services.AddMemoryCache();

// Configurar CORS - orígenes permitidos vienen de configuración (appsettings / variables de entorno),
// así en producción se ajustan sin tocar código. Ver Cors:AllowedOrigins en appsettings.json.
// NOTA: WithOrigins() no soporta comodines "*" sin SetIsOriginAllowedToAllowWildcardSubdomains();
// por eso aquí se listan orígenes exactos en vez de "https://*.netlify.app".
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .WithMethods("GET", "POST")
            .AllowAnyHeader();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Personal Portfolio API",
        Version = "v1",
        Description = "API REST para portfolio personal con soporte multiidioma"
    });
});

var app = builder.Build();

// ===== INICIALIZAR TextHelpers =====
var localizerFactory = app.Services.GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizerFactory>();
TextHelpers.Initialize(localizerFactory);

// ===== CONFIGURAR PIPELINE HTTP =====

// Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"]  = "nosniff";
    context.Response.Headers["X-Frame-Options"]         = "SAMEORIGIN";
    context.Response.Headers["X-XSS-Protection"]        = "1; mode=block";
    context.Response.Headers["Referrer-Policy"]         = "strict-origin-when-cross-origin";
    context.Response.Headers["Permissions-Policy"]      = "camera=(), microphone=(), geolocation=()";
    await next();
});

// HTTPS redirection (skip in dev so the Vite proxy can reach the API over plain HTTP)
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

// CORS - debe ir antes de Authorization
app.UseCors("AllowFrontend");

// Localizaci�n
app.UseRequestLocalization();

// Autorizaci�n
app.UseAuthorization();

// Mapear controllers
app.MapControllers();

app.Run();