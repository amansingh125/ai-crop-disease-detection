import os
import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.models import AnalyzeRequest, PredictionRecord
from backend.gemini_service import analyze_crop_leaf

app = FastAPI(
    title="AI Crop Disease Detection System API",
    description="FastAPI Backend for Crop Disease Diagnosis using Google Gemini AI and MongoDB",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store fallback if MongoDB is not active
history_db = []

@app.get("/")
def read_root():
    return {"message": "AI Crop Disease Detection API is running"}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_key_set": bool(os.getenv("GEMINI_API_KEY")),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/analyze")
async def analyze_leaf(request: AnalyzeRequest):
    try:
        result_dict = analyze_crop_leaf(
            image_base64=request.imageBase64,
            mime_type=request.mimeType or "image/jpeg",
            language=request.language or "en"
        )
        
        record = {
            "id": f"scan-{uuid.uuid4().hex[:8]}",
            "timestamp": datetime.utcnow().isoformat(),
            "cropName": result_dict.get("cropName", "Unknown"),
            "diseaseName": result_dict.get("diseaseName", "Unidentified"),
            "severity": result_dict.get("severity", "Medium"),
            "isHealthy": result_dict.get("isHealthy", False),
            "confidence": result_dict.get("confidence", 90),
            "language": request.language or "en",
            "imagePreview": request.imageBase64[:100] + "...",
            "analysis": result_dict
        }
        
        history_db.insert(0, record)
        return {"success": True, "record": record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history(search: str = Query(None), crop: str = Query("all"), severity: str = Query("all")):
    filtered = history_db
    if search:
        q = search.lower()
        filtered = [r for r in filtered if q in r["cropName"].lower() or q in r["diseaseName"].lower()]
    if crop != "all":
        filtered = [r for r in filtered if r["cropName"].lower() == crop.lower()]
    if severity != "all":
        filtered = [r for r in filtered if r["severity"].lower() == severity.lower()]
    
    return {"success": True, "count": len(filtered), "records": filtered}

@app.delete("/api/history/{record_id}")
def delete_record(record_id: str):
    global history_db
    history_db = [r for r in history_db if r["id"] != record_id]
    return {"success": True, "message": "Record deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
