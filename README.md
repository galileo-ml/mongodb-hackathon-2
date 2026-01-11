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

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt
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

### 4. Ingest NEC PDF

```bash
# Basic ingestion (category-based lookup only)
python scripts/ingest_nec.py /path/to/nec.pdf 2023

# With RAG embeddings (recommended)
python scripts/ingest_nec.py /path/to/nec.pdf 2023 --with-rag
```

This will:
- Parse the NEC PDF into sections and full articles
- Store in `nec_codes` and `nec_full_text` collections
- (With --with-rag) Generate embeddings and store in `nec_chunks` collection

### 5. Set Up MongoDB Atlas Vector Search Index

**Only required if using --with-rag:**

1. Go to MongoDB Atlas Console
2. Navigate to your cluster → **Atlas Search** tab
3. Click "Create Search Index"
4. Select **Atlas Vector Search**
5. Choose **JSON Editor**
6. Select the `nec_chunks` collection
7. Name it `chunk_vector_index`
8. Paste this definition:

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

9. Click "Create Search Index"
10. Wait for status to show "Active"

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
├── app/                         # Backend (Python/FastAPI)
│   ├── main.py                  # FastAPI app + routes
│   ├── config.py                # Settings
│   ├── database.py              # MongoDB + vector search
│   ├── models.py                # Pydantic models
│   ├── fireworks_client.py      # Fireworks AI client
│   ├── pdf_parser.py            # NEC PDF parser + chunking
│   └── compliance.py            # Hybrid RAG compliance logic
├── fe/                          # Frontend (Next.js)
│   ├── app/                     # Next.js pages
│   ├── components/              # React components
│   ├── lib/                     # API client + utilities
│   └── types/                   # TypeScript types
├── scripts/
│   └── ingest_nec.py            # NEC PDF ingestion (--with-rag)
├── requirements.txt             # Python dependencies
├── pyproject.toml
├── .env.example
└── README.md
```

## Frontend Setup

```bash
cd fe
npm install
npm run dev
```

Frontend runs on http://localhost:3000

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

1. **Upload**: User uploads a PNG/JPG electrical diagram
2. **Vision Analysis**: Qwen2.5-VL vision model describes diagram and identifies system type
3. **Hybrid RAG Retrieval**:
   - Category lookup (system type → relevant NEC articles)
   - Vector search (semantic similarity on 5000+ chunks)
   - LLM's built-in NEC knowledge
4. **Compliance Check**: Vision model compares actual diagram against NEC codes
5. **Report**: Returns pass/warning/fail/not_applicable for each code with compliance score

## License

MIT