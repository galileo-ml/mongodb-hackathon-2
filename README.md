# NEC Compliance Checker

An AI-powered system that analyzes single-line electrical diagrams for compliance with the National Electrical Code (NEC) using MongoDB Atlas Vector Search and Fireworks AI.

## Features

- **Vision AI Analysis**: Extracts components from electrical diagrams using Fireworks vision models
- **Vector Search**: Semantic search of NEC codes using MongoDB Atlas Vector Search
- **Compliance Checking**: Automated compliance analysis with detailed findings and recommendations
- **RESTful API**: FastAPI-based backend with async support

## Architecture

```
PNG Upload → Vision Model → Component Extraction → Vector Search → NEC Codes → LLM Analysis → Compliance Report
```

## Tech Stack

- **Backend**: Python 3.11+ with FastAPI
- **Database**: MongoDB Atlas with Vector Search
- **AI Models**: Fireworks AI
  - Vision: `qwen2p5-vl-32b-instruct`
  - Text: `llama-v3p1-70b-instruct`
  - Embeddings: `nomic-embed-text-v1.5`
- **PDF Parsing**: pymupdf4llm

## Setup

### 1. Prerequisites

- Python 3.11 or higher
- MongoDB Atlas account (free tier works)
- Fireworks AI API key

### 2. Clone and Install

```bash
git clone <repo-url>
cd mongodb-hackathon-2
pip install -e .
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nec_compliance
FIREWORKS_API_KEY=fw_your_api_key_here
```

### 4. Set Up MongoDB Atlas Vector Search Index

1. Go to MongoDB Atlas Console
2. Navigate to your cluster → Browse Collections
3. Select your database → `nec_codes` collection
4. Click "Search Indexes" tab
5. Click "Create Search Index"
6. Select "JSON Editor" and paste:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    }
  ]
}
```

7. Name it `nec_vector_index`
8. Click "Create"

### 5. Ingest NEC PDF

```bash
python scripts/ingest_nec.py /path/to/nec.pdf 2023
```

This will:
- Parse the NEC PDF into sections
- Generate embeddings for each section
- Store in MongoDB with vector embeddings

## Usage

### Start the API Server

```bash
python app/main.py
```

Or with uvicorn:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### API Endpoints

#### 1. Analyze Diagram (Base64)

```bash
POST /analyze
Content-Type: application/json

{
  "image_base64": "<base64-encoded-png>",
  "nec_version": "2023"
}
```

Response:
```json
{
  "analysis_id": "uuid",
  "status": "completed",
  "message": "Analysis completed successfully"
}
```

#### 2. Analyze Diagram (File Upload)

```bash
POST /analyze-file
Content-Type: multipart/form-data

file: <diagram.png>
nec_version: 2023
```

#### 3. Get Analysis Results

```bash
GET /analysis/{analysis_id}
```

Response:
```json
{
  "analysis_id": "uuid",
  "status": "completed",
  "report": {
    "diagram_analysis": {
      "components": [
        {
          "type": "breaker",
          "rating": "100A",
          "label": "Main Panel"
        }
      ],
      "voltage_levels": ["480V"],
      "observations": []
    },
    "findings": [
      {
        "component": "breaker (100A)",
        "nec_reference": "240.4",
        "requirement": "Overcurrent protection requirements",
        "status": "compliant",
        "details": "Component meets NEC requirements"
      }
    ],
    "summary": {
      "total_components": 5,
      "violations": 0,
      "warnings": 1,
      "compliant": 4
    }
  }
}
```

#### 4. Health Check

```bash
GET /health
```

### Example with cURL

```bash
# Analyze a diagram
curl -X POST http://localhost:8000/analyze-file \
  -F "file=@single_line_diagram.png" \
  -F "nec_version=2023"

# Get results
curl http://localhost:8000/analysis/your-analysis-id
```

## Project Structure

```
mongodb-hackathon-2/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app + routes
│   ├── config.py            # Settings
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models
│   ├── fireworks_client.py  # Fireworks AI client
│   ├── pdf_parser.py        # NEC PDF parser
│   └── compliance.py        # Compliance logic
├── scripts/
│   └── ingest_nec.py        # NEC PDF ingestion
├── pyproject.toml
├── .env.example
└── README.md
```

## Development

### Install Development Dependencies

```bash
pip install -e ".[dev]"
```

### Run Tests

```bash
pytest
```

## MongoDB Collections

### `nec_codes`
Stores NEC code sections with vector embeddings:
```javascript
{
  section: "240.4(D)",
  title: "Small Conductors",
  full_text: "...",
  embedding: [...],  // 768-dimensional vector
  chapter: 2,
  nec_version: "2023"
}
```

### `analyses`
Stores analysis results:
```javascript
{
  analysis_id: "uuid",
  diagram_analysis: {...},
  findings: [...],
  summary: {...},
  created_at: ISODate
}
```

## How It Works

1. **Upload**: User uploads a PNG single-line diagram
2. **Vision Analysis**: Fireworks vision model extracts electrical components
3. **Vector Search**: For each component, semantic search finds relevant NEC codes
4. **Compliance Check**: LLM compares components against NEC requirements
5. **Report**: Generate detailed compliance report with violations and recommendations

## License

MIT