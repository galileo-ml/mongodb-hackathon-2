"""Pydantic models for the application"""
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


# =============================================================================
# NEC Code Models (Internal)
# =============================================================================

class NECCode(BaseModel):
    """NEC code section stored in MongoDB"""
    section: str
    title: str
    full_text: str
    embedding: list[float]
    chapter: Optional[int] = None
    nec_version: str = "2023"
    keywords: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# API Request Models
# =============================================================================

class AnalyzeRequest(BaseModel):
    """Request to analyze a diagram"""
    image_base64: str
    nec_version: str = "2023"


# =============================================================================
# API Response Models (Frontend Schema)
# =============================================================================

class DiagramLocation(BaseModel):
    """Location in the diagram where the finding applies"""
    sheet: int = Field(1, description="Sheet/page number in the diagram")
    region: str = Field(..., description="Region or component in the diagram (e.g., 'Generator', 'Main Panel')")


class CodeFinding(BaseModel):
    """Individual code finding matching frontend contract"""
    id: str = Field(..., description="Unique identifier for this finding (e.g., 'rc1', 'rc2')")
    name: str = Field(..., description="Descriptive name of the compliance check")
    status: str = Field(..., description="Status: 'pass', 'warning', 'fail', 'not_applicable'")
    standard: str = Field(..., description="NEC code reference (e.g., 'NEC 445.12')")
    message: str = Field(..., description="Brief result message")
    description: str = Field(..., description="Full description of what the code requires")
    location: DiagramLocation = Field(..., description="Location in diagram where this applies")


class ComplianceSummary(BaseModel):
    """Summary statistics for quick display"""
    total_codes_evaluated: int = Field(..., description="Total applicable codes checked (excludes not_applicable)")
    passing_count: int = Field(..., description="Number of codes passing")
    warning_count: int = Field(..., description="Number of warnings")
    failing_count: int = Field(..., description="Number of violations")
    not_applicable_count: int = Field(0, description="Number of codes not applicable to this system")
    compliance_score: float = Field(..., description="Overall compliance percentage (0-100) based on applicable codes only")


class AnalysisResponse(BaseModel):
    """
    Complete analysis response for frontend consumption.

    This is the main response schema that the frontend will receive.
    """
    # Metadata
    analysis_id: str = Field(..., description="Unique identifier for this analysis")
    status: str = Field(..., description="Analysis status: 'completed', 'error'")
    created_at: str = Field(..., description="ISO 8601 timestamp")
    nec_version: str = Field(..., description="NEC version used for compliance check")
    system_type: str = Field("commercial", description="Detected system type (generator, solar, motor, panel, etc.)")

    # Diagram Analysis
    diagram_description: str = Field(..., description="AI-generated description of the diagram")

    # Compliance Findings - single array with status field
    findings: list[CodeFinding] = Field(default_factory=list, description="All compliance findings with status")

    # Summary
    summary: ComplianceSummary = Field(..., description="Quick summary statistics")

    class Config:
        json_schema_extra = {
            "example": {
                "analysis_id": "d778b28d-ea7a-48c2-a799-027b10457452",
                "status": "completed",
                "created_at": "2024-01-15T10:30:00Z",
                "nec_version": "2023",
                "system_type": "generator",
                "diagram_description": "This is a single-line diagram for a large diesel generator system...",
                "findings": [
                    {
                        "id": "rc1",
                        "name": "Generator Overcurrent Protection",
                        "status": "pass",
                        "standard": "NEC 445.12",
                        "message": "Protective relays (50/51) properly installed",
                        "description": "NEC 445.12 requires generators to be protected against overcurrent",
                        "location": {"sheet": 1, "region": "Generator"}
                    },
                    {
                        "id": "rc2",
                        "name": "Grounding Electrode Conductor",
                        "status": "pass",
                        "standard": "NEC 250.30",
                        "message": "High-impedance grounding with neutral reactor shown",
                        "description": "NEC 250.30 covers grounding of separately derived systems",
                        "location": {"sheet": 1, "region": "Neutral Reactor"}
                    },
                    {
                        "id": "rc3",
                        "name": "Conductor Protection",
                        "status": "warning",
                        "standard": "NEC 240.4",
                        "message": "Conductor sizing not visible, needs field verification",
                        "description": "NEC 240.4 requires conductors to be protected against overcurrent",
                        "location": {"sheet": 1, "region": "Feeders"}
                    },
                    {
                        "id": "rc4",
                        "name": "Solar PV Grounding",
                        "status": "not_applicable",
                        "standard": "NEC 690.47",
                        "message": "This is a generator system, not solar",
                        "description": "NEC 690.47 covers grounding of solar photovoltaic systems",
                        "location": {"sheet": 1, "region": "N/A"}
                    }
                ],
                "summary": {
                    "total_codes_evaluated": 3,
                    "passing_count": 2,
                    "warning_count": 1,
                    "failing_count": 0,
                    "not_applicable_count": 1,
                    "compliance_score": 83.3
                }
            }
        }
