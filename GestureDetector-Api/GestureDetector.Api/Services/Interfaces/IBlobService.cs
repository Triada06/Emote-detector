using GestureDetector.Api.Contracts;

namespace GestureDetector.Api.Services.Interfaces;

public interface IBlobService
{
    public string GetBlobSasUri(string blobName, int expiryMinutes = 10);
    public Task UploadBlobAsync(IFormFile file,string fileName);        //for future scaling 
}