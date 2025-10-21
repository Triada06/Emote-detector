Clash Royale Emote Detector 🎮✋
A real-time hand gesture recognition web application that identifies Clash Royale emotes using computer vision and AI. Show a hand gesture to your webcam, and the app will detect which Clash Royale emote you're performing!
🌟 Features

Real-time Hand Tracking: Uses MediaPipe Hands to detect and track hand landmarks in real-time
AI-Powered Recognition: Leverages Google Gemini AI to analyze hand gestures and identify emotes
Interactive UI: Modern, responsive interface with live camera feed and visual feedback
Cloud Storage: Stores emote images in Azure Blob Storage for scalable asset management
Cross-Platform: Works on any device with a webcam and modern browser

🛠️ Technologies Used
Frontend

React with TypeScript - Modern UI framework
Vite - Fast build tool and dev server
Tailwind CSS - Utility-first CSS framework
MediaPipe Hands - Google's hand tracking solution
Lucide React - Icon library

Backend

ASP.NET Core 9 - High-performance web API
C# - Primary programming language
Azure Blob Storage - Cloud storage for emote images
Google Gemini 2.5 Flash - AI model for gesture recognition
Scalar - Modern API documentation

Additional Tools

CORS - Cross-origin resource sharing for frontend-backend communication
JSON Serialization - Data exchange format

📋 Prerequisites

Node.js (v18 or higher)
npm or yarn
.NET 9 SDK
Google Gemini API Key (free tier available)
Azure Storage Account (for blob storage)
Webcam (for gesture detection)

🚀 Getting Started
1. Clone the Repository
bashgit clone [<your-repo-url>](https://github.com/Triada06/Emote-detector)
cd clash-royale-emote-detector
2. Backend Setup
Install Dependencies
bashcd GestureDetector-Api
dotnet restore
Configure Settings
Create or update appsettings.json:
json{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "BaseUrl": "http://localhost:5000",
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY_HERE"
  },
  "AzureStorage": {
    "AzureBlobStorageConString": "YOUR_AZURE_CONNECTION_STRING_HERE",
    "BlobContainerName": "emote-images"
  }
}
Get API Keys

Google Gemini API Key:

Visit https://aistudio.google.com/app/apikey
Sign in with Google account
Create a new API key (free tier: $5 credits)


Azure Storage Connection String:

Create a storage account in Azure Portal
Go to "Access keys" and copy the connection string



Run Backend
bashdotnet run
Backend will be available at:

API: http://localhost:5000
API Documentation: http://localhost:5000/scalar

3. Frontend Setup
Install Dependencies
bashcd clash-royale-emote-detector
npm install
Run Frontend
bashnpm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📁 Project Structure
```
clash-royale-emote-detector/
├── GestureDetector-Api/              # Backend (C# ASP.NET Core)
│   ├── Controllers/
│   │   ├── EmoteController.cs        # Main emote detection endpoint
│   │   └── BlobController.cs         # Image upload endpoint
│   ├── Services/
│   │   ├── AiEmoteService.cs         # Gemini AI integration
│   │   └── BlobService.cs            # Azure Blob Storage service
│   ├── Models/
│   │   ├── HandDataRequest.cs        # Request models
│   │   └── EmoteResponse.cs          # Response models
│   └── Program.cs                    # Application entry point
│
└── clash-royale-emote-detector/      # Frontend (React + TypeScript)
    ├── src/
    │   ├── App.tsx                   # Main application component
    │   ├── index.css                 # Tailwind imports
    │   └── main.tsx                  # Entry point
    ├── public/
    ├── package.json
    └── vite.config.ts
🎯 How It Works

Camera Initialization: The frontend accesses your webcam and starts MediaPipe Hands tracking
Hand Detection: MediaPipe detects hands and extracts 21 landmark points per hand
Gesture Capture: User clicks "Capture Gesture" button when performing an emote
Data Transmission: Hand landmark data is sent to the backend API
AI Analysis: Google Gemini analyzes the hand positions and identifies the emote
Result Display: The detected emote name, image, and confidence score are shown

🎮 Supported Emotes

Crying Face (laughing crying)
Thumbs Up
King Laugh
Angry Face
Dabbing
Shrugging
Blowing Kiss
Clapping
Yawning

⚙️ Configuration
Rate Limiting
The free tier of Google Gemini has a rate limit of 10 requests per minute. The app implements a 3-second cooldown between captures to stay within limits.
CORS
Backend is configured to accept requests from http://localhost:5173. Update in Program.cs if using a different port:
csharppolicy.WithOrigins("http://localhost:5173", "YOUR_OTHER_ORIGIN")
🐛 Troubleshooting
Camera Not Working

Ensure browser has camera permissions
Try using http://localhost instead of 127.0.0.1
Check if another application is using the camera

Gemini API Quota Exceeded

Wait 1 minute for the quota to reset
Free tier allows 10 requests/minute
Consider upgrading to paid tier for higher limits

Azure Blob Upload Fails

Verify connection string is correct
Ensure container name doesn't contain uppercase letters or special characters
Check Azure Storage account has proper access permissions

Backend Connection Refused

Verify backend is running on port 5000
Check firewall settings
Ensure CORS is properly configured

📝 API Endpoints
Emote Detection
httpPOST /api/emote/detect
Content-Type: application/json

{
  "hands": [
    {
      "landmarks": [{ "x": 0.5, "y": 0.3, "z": 0.0 }, ...],
      "handedness": "Right",
      "score": 0.95
    }
  ],
  "timestamp": 1697654321000
}

Health Check
httpGET /api/emote/health

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
This project is open source and available under the MIT License.
🙏 Acknowledgments

MediaPipe - Google's hand tracking solution
Google Gemini - AI-powered gesture recognition
Clash Royale - Original emote designs by Supercell
Azure - Cloud storage infrastructure

📧 Contact
For questions or support, please open an issue on GitHub.
Telegram:
@tr1iada 
@kenaaaaann
