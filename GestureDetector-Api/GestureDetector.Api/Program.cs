using GestureDetector.Api;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Services
builder.Services
    .AddOpenApi()
    .AddApplicationServices(config);
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => { options.Theme = ScalarTheme.BluePlanet; });
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
app.Run();