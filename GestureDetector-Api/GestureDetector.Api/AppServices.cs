using Azure.Storage.Blobs;
using GestureDetector.Api.Helpers;
using GestureDetector.Api.Services;
using GestureDetector.Api.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GestureDetector.Api;

public static class AppServices
{
    public  static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<IBlobService, BlobService>();
        services.AddHttpClient<AiEmoteService>();

        services.Configure<BlobStorageOptions>(options =>
            options.ContainerName = config["AzureStorage:BlobContainerName"]);

        services.AddSingleton(_ =>
            new BlobServiceClient(config["AzureStorage:AzureBlobStorageConString"]));

        return services;
    }
}