from google import genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Make sure your GEMINI_API_KEY is set in environment variables
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# List all available models for your key
available_models = client.models.list()

print("Available models for your key:")
for m in available_models:
    print(f"- {m.name}: {m.description}")