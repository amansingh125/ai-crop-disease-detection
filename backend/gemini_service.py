import os
import json
import base64
from google import genai
from google.genai import types

def analyze_crop_leaf(image_base64: str, mime_type: str = "image/jpeg", language: str = "en") -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not configured.")

    client = genai.Client(api_key=api_key)

    # Remove data URL header if present
    if ";base64," in image_base64:
        image_base64 = image_base64.split(";base64,")[1]

    image_bytes = base64.b64decode(image_base64)

    prompt = """
    You are an expert agronomist and plant pathologist. Analyze this crop leaf image.
    Identify crop type, disease, severity level (Low, Medium, High, None), symptoms, organic and chemical treatments, and preventive measures.
    Provide output in JSON format with both English and Hindi translations.
    """

    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    if response.text:
        return json.loads(response.text)
    
    raise ValueError("Failed to get response from Gemini AI.")
