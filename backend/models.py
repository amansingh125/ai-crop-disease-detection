from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AnalysisResultSchema(BaseModel):
    cropName: str
    cropNameHindi: str
    diseaseName: str
    diseaseNameHindi: str
    isHealthy: bool
    confidence: int
    severity: str # Low, Medium, High, None
    symptoms: List[str]
    symptomsHindi: List[str]
    organicTreatment: List[str]
    organicTreatmentHindi: List[str]
    chemicalTreatment: List[str]
    chemicalTreatmentHindi: List[str]
    preventiveMeasures: List[str]
    preventiveMeasuresHindi: List[str]
    summary: str
    summaryHindi: str

class AnalyzeRequest(BaseModel):
    imageBase64: str
    mimeType: Optional[str] = "image/jpeg"
    language: Optional[str] = "en"

class PredictionRecord(BaseModel):
    id: str
    timestamp: str
    cropName: str
    diseaseName: str
    severity: str
    isHealthy: bool
    confidence: int
    language: str
    imagePreview: str
    analysis: AnalysisResultSchema
