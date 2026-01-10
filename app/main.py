"""FastAPI application for NEC compliance checking"""
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base64

from app.config import settings
from app.database import connect_to_mongodb, close_mongodb_connection, get_database
from app.fireworks_client import get_fireworks_client
from app.compliance import ComplianceChecker
from app.models import AnalyzeRequest, AnalysisResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    await connect_to_mongodb()
    yield
    # Shutdown
    await close_mongodb_connection()


# Create FastAPI app
app = FastAPI(
    title="NEC Compliance Checker",
    description="Analyze single-line electrical diagrams for NEC code compliance",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "NEC Compliance Checker",
        "version": "0.1.0"
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_diagram(request: AnalyzeRequest):
    """
    Analyze a single-line diagram for NEC compliance.

    Upload a base64-encoded PNG image of an electrical single-line diagram
    and receive a compliance analysis against NEC codes.

    Returns categorized findings (passing, warnings, failing) with a compliance score.
    """
    # Generate unique analysis ID
    analysis_id = str(uuid.uuid4())

    try:
        # Initialize compliance checker
        fireworks = get_fireworks_client()
        checker = ComplianceChecker(fireworks)

        # Run analysis and get full result
        result = await checker.analyze_and_check(
            analysis_id=analysis_id,
            image_base64=request.image_base64,
            nec_version=request.nec_version
        )

        return result
    except Exception as e:
        print(f"Error analyzing diagram: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-file", response_model=AnalysisResponse)
async def analyze_diagram_file(
    file: UploadFile = File(...),
    nec_version: str = "2023"
):
    """
    Analyze a single-line diagram from uploaded PNG file.

    Upload a PNG image file of an electrical single-line diagram
    and receive a compliance analysis against NEC codes.

    Returns categorized findings (passing, warnings, failing) with a compliance score.
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Read file and convert to base64
    contents = await file.read()
    image_base64 = base64.b64encode(contents).decode("utf-8")

    # Generate unique analysis ID
    analysis_id = str(uuid.uuid4())

    try:
        # Initialize compliance checker
        fireworks = get_fireworks_client()
        checker = ComplianceChecker(fireworks)

        # Run analysis and get full result
        result = await checker.analyze_and_check(
            analysis_id=analysis_id,
            image_base64=image_base64,
            nec_version=nec_version
        )

        return result
    except Exception as e:
        print(f"Error analyzing diagram: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str):
    """
    Retrieve a previously completed analysis by ID.

    Returns the full analysis result including diagram description,
    compliance findings, and summary statistics.
    """
    db = get_database()

    # Find analysis in database
    result = await db.analyses.find_one({"analysis_id": analysis_id})

    if not result:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Return stored result in standard format
    return {
        "analysis_id": analysis_id,
        "status": result.get("status", "completed"),
        "created_at": result.get("created_at").isoformat() + "Z" if result.get("created_at") else "",
        "nec_version": result.get("nec_version", "2023"),
        "system_type": result.get("system_type", "commercial"),
        "diagram_description": result.get("diagram_description", ""),
        "findings": result.get("findings", []),
        "summary": result.get("summary", {
            "total_codes_evaluated": 0,
            "passing_count": 0,
            "warning_count": 0,
            "failing_count": 0,
            "not_applicable_count": 0,
            "compliance_score": 0.0
        })
    }


@app.post("/ingest-nec")
async def ingest_nec_pdf(file: UploadFile = File(...)):
    """
    Ingest NEC PDF and store as vector embeddings

    Args:
        file: NEC PDF file

    Returns:
        Status message
    """
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        # Save uploaded file temporarily
        import tempfile
        import os

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            contents = await file.read()
            tmp_file.write(contents)
            tmp_file_path = tmp_file.name

        # Import parser and fireworks client
        from app.pdf_parser import NECPDFParser

        parser = NECPDFParser()
        fireworks = get_fireworks_client()
        db = get_database()

        sections_processed = 0

        # Parse and store sections
        for section in parser.parse_pdf(tmp_file_path):
            # Generate embedding
            embedding_text = f"{section.title}. {section.full_text[:1500]}"
            embedding = await fireworks.generate_embedding(embedding_text)

            # Store in database
            await db.nec_codes.update_one(
                {"section": section.section},
                {
                    "$set": {
                        "section": section.section,
                        "title": section.title,
                        "full_text": section.full_text,
                        "embedding": embedding,
                        "chapter": section.chapter,
                        "nec_version": "2023"
                    }
                },
                upsert=True
            )

            sections_processed += 1

        # Clean up temp file
        os.unlink(tmp_file_path)

        return {
            "status": "success",
            "sections_processed": sections_processed,
            "message": f"Ingested {sections_processed} NEC sections"
        }
    except Exception as e:
        print(f"Error ingesting NEC PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Detailed health check"""
    db = get_database()

    # Check database connection
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    # Count NEC codes
    nec_count = await db.nec_codes.count_documents({})

    return {
        "status": "healthy",
        "database": db_status,
        "nec_codes_count": nec_count,
        "fireworks_api_configured": bool(settings.fireworks_api_key)
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
