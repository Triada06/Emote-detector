using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using GestureDetector.Api.Contracts;
using GestureDetector.Api.Helpers;
using GestureDetector.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace GestureDetector.Api.Services;

public class BlobService : IBlobService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IConfiguration _configuration;
    private readonly string _containerName;

    public BlobService(BlobServiceClient blobServiceClient, IOptions<BlobStorageOptions> options,
        IConfiguration configuration)
    {
        _blobServiceClient = blobServiceClient;
        _configuration = configuration;
        _containerName = options.Value.ContainerName; // Now pulls from IOptions
    }

    public async Task<BlobResponse> GetBlobAsync(string blobName)   //for blob testing
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);
        var blobDownloadInfo = await blobClient.DownloadAsync();

        return new BlobResponse(blobDownloadInfo.Value.Content, blobDownloadInfo.Value.ContentType);
    }


    public async Task UploadBlobAsync(IFormFile file, string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

        var blobClient = containerClient.GetBlobClient(fileName);

        var headers = new BlobHttpHeaders
        {
            ContentType = file.ContentType
        };

        await blobClient.UploadAsync(file.OpenReadStream(), new BlobUploadOptions
        {
            HttpHeaders = headers
        });
    }

    public string GetBlobSasUri(string blobName, int expiryMinutes = 10)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);

        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            BlobName = blobName,
            Resource = "b",
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(expiryMinutes)
        };

        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        var sasUri = blobClient.GenerateSasUri(sasBuilder);
        return sasUri.ToString();
    }
}