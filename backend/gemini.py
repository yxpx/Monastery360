import os
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

"""
FastAPI server for generating trip plans using Google Gemini AI.
"""
# Load environment variables and configure Gemini API
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not set in environment")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash-lite")

# Initialize FastAPI app with CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlanRequest(BaseModel):
    budget: str
    days: str
    travelers: str
    interests: str
    accommodation: str
    transport: str | None = None

@app.post("/generate-plan")
async def generate_plan(req: PlanRequest):
    """
    Generate a trip plan using Gemini AI based on request parameters.
    """
    transport_info = f" Transport preference: {req.transport}." if req.transport else ""
    
    prompt = f"""
Create a detailed {req.days}-day Sikkim monastery tour itinerary for {req.travelers} travelers with a budget of ₹{req.budget}.
Interests: {req.interests}
Accommodation: {req.accommodation}{transport_info}

Please format your response in clean, well-structured markdown with the following sections:

# 🏔️ {req.days}-Day Sikkim Monastery Tour

## 📋 Trip Overview
- **Duration**: {req.days} days
- **Travelers**: {req.travelers}
- **Budget**: ₹{req.budget}
- **Accommodation**: {req.accommodation}
- **Interests**: {req.interests}

## 📅 Daily Itinerary

For each day, use this format:
### Day X - [Location/Theme]

**🌅 Morning (6:00 AM - 12:00 PM)**
- Time slots with activities
- Include monastery visits, travel times
- Adventure elements if applicable

**🌞 Afternoon (12:00 PM - 6:00 PM)**  
- Detailed activities
- Local cuisine recommendations
- Cultural experiences

**🌙 Evening (6:00 PM onwards)**
- Evening activities
- Where to stay
- Local tips

## 💰 Budget Breakdown
Provide a detailed cost analysis including:
- Accommodation costs per day
- Transportation expenses
- Monastery entrance fees
- Food and dining
- Adventure activities
- Miscellaneous expenses

## 🎒 Essential Tips
- Weather considerations
- What to pack
- Local customs and etiquette
- Best photography spots
- Safety guidelines

## 🍽️ Local Cuisine Highlights
- Must-try Sikkimese dishes
- Recommended restaurants
- Food budget estimates

Make the content engaging, informative, and well-organized with proper spacing, bullet points, and emojis for visual appeal.
"""
    
    chat = model.start_chat()
    response = chat.send_message(prompt)
    
    try:
        # Try to parse as JSON first
        json_response = response.json()
        return {"text": json_response.get("text", response.text), "formatted": True}
    except Exception:
        # Return raw text with formatting flag
        return {"text": response.text, "formatted": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


