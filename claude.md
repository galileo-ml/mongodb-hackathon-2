# Project Context for Claude

## Project Overview

**Project Name**: NEC Compliance Checker
**Purpose**: MongoDB Hackathon 2 - Multi-Agent Collaboration (Statement Two)
**Goal**: Analyze single-line electrical diagrams (PNG) for compliance with National Electrical Code (NEC)

This is an MVP implementation that demonstrates:
- Vision AI analyzing circuit diagrams
- Vector search for semantic code lookup
- LLM-based compliance checking

**Future Goal**: Expand into a full multi-agent system with specialized agents for task delegation, peer discovery, and collaborative analysis using MongoDB for context management.

## Tech Stack

- **Backend**: Python 3.11+ with FastAPI (async)
- **Database**: MongoDB Atlas with Vector Search
- **AI Provider**: Fireworks AI
  - Vision Model: `qwen2p5-vl-32b-instruct`
  - Text Model: `llama-v3p1-70b-instruct`
  - Embedding Model: `nomic-ai/nomic-embed-text-v1.5` (768 dimensions)
- **PDF Parser**: pymupdf4llm

## Architecture Flow

```
1. PNG Upload
   ↓
2. Vision Model (Fireworks) → Extract electrical components
   ↓
3. For each component:
   - Generate query embedding
   - Vector search MongoDB for relevant NEC codes
   ↓
4. LLM Analysis → Compare components vs NEC requirements
   ↓
5. Generate compliance report with findings
   ↓
6. Store in MongoDB analyses collection
```

## Project Structure

```
mongodb-hackathon-2/
├── app/
│   ├── __init__.py              # Empty package file
│   ├── main.py                  # FastAPI app + 4 API endpoints
│   ├── config.py                # Settings from environment variables
│   ├── database.py              # MongoDB connection + vector search
│   ├── models.py                # Pydantic models for all data types
│   ├── fireworks_client.py      # Fireworks AI client wrapper
│   ├── pdf_parser.py            # NEC PDF → structured sections
│   └── compliance.py            # Core compliance checking logic
├── scripts/
│   └── ingest_nec.py            # CLI script to ingest NEC PDF
├── pyproject.toml               # Python dependencies
├── .env.example                 # Environment variable template
├── .gitignore
├── README.md                    # User-facing documentation
└── claude.md                    # This file - AI context
```

## Key Files Explained

### `app/config.py`
- Uses `pydantic-settings` to load env vars
- All settings centralized: MongoDB URI, Fireworks API key, model names
- Singleton `settings` object used throughout app

### `app/database.py`
- Motor (async MongoDB driver) connection management
- Global `_client` and `_db` instances
- `vector_search()` function for semantic search using `$vectorSearch` aggregation
- Index creation helpers
- **Important**: Vector search index must be created manually in Atlas UI

### `app/fireworks_client.py`
- Wrapper around OpenAI SDK (Fireworks API is OpenAI-compatible)
- Three main methods:
  - `analyze_image()` - Vision model with base64 images
  - `chat()` - Text generation
  - `generate_embedding()` - Convert text to 768-dim vector
- Singleton pattern with `get_fireworks_client()`

### `app/models.py`
- All Pydantic models:
  - `NECCode` - NEC section with embedding
  - `Component` - Electrical component from diagram
  - `DiagramAnalysis` - Vision model output
  - `ComplianceFinding` - Individual compliance issue
  - `ComplianceReport` - Full analysis report
- Models used for API request/response and database storage

### `app/pdf_parser.py`
- `NECPDFParser` class parses NEC PDF into sections
- Uses `pymupdf4llm` for high-quality PDF extraction
- Regex patterns to identify NEC sections (e.g., "240.4", "250.32")
- Falls back to chunking if no structure found
- Each section becomes a separate document in MongoDB

### `app/compliance.py`
- **Core business logic**
- `ComplianceChecker` class with methods:
  1. `analyze_diagram()` - Vision model extracts components
  2. `find_relevant_codes()` - Vector search for each component
  3. `check_compliance()` - LLM compares components vs codes
  4. `generate_report()` - Format final report
  5. `analyze_and_check()` - Full pipeline
- Detailed system prompts for vision and compliance analysis
- JSON parsing with fallbacks for markdown code blocks

### `app/main.py`
- FastAPI application with 4 endpoints:
  - `POST /analyze` - Base64 image input
  - `POST /analyze-file` - File upload input
  - `GET /analysis/{id}` - Get results
  - `POST /ingest-nec` - Upload and parse NEC PDF
- Lifespan context manager for DB connection
- CORS enabled for all origins (dev convenience)

### `scripts/ingest_nec.py`
- Standalone CLI script for NEC PDF ingestion
- Usage: `python scripts/ingest_nec.py /path/to/nec.pdf 2023`
- Parses PDF, generates embeddings, stores in MongoDB
- Prints progress every 10 sections

## MongoDB Collections

### `nec_codes`
Stores NEC code sections with embeddings:
```javascript
{
  section: "240.4(D)",              // Section number
  title: "Small Conductors",        // Section title
  full_text: "...",                 // Full section text
  embedding: [0.023, -0.156, ...],  // 768-dim vector
  chapter: 2,                       // Chapter number
  nec_version: "2023"               // NEC version year
}
```

**Indexes**:
- `section` (unique)
- `chapter`
- `nec_version`
- Vector index `nec_vector_index` on `embedding` field (created manually in Atlas)

### `analyses`
Stores analysis results:
```javascript
{
  analysis_id: "uuid",
  diagram_analysis: {
    components: [...],
    voltage_levels: [...],
    observations: [...]
  },
  findings: [
    {
      component: "breaker (100A)",
      nec_reference: "240.4",
      status: "violation",
      severity: "critical",
      details: "..."
    }
  ],
  summary: {
    total_components: 5,
    violations: 2,
    warnings: 1,
    compliant: 2
  },
  created_at: ISODate,
  nec_version: "2023"
}
```

**Indexes**:
- `analysis_id` (unique)
- `created_at`

## Important Implementation Notes

### Vision Model Prompting
- System prompt instructs model to output JSON with specific structure
- Model can read text/labels on diagrams
- Components include: type, rating, label, connections
- Response parsing handles markdown code blocks (```json...```)

### Vector Search
- Uses MongoDB Atlas `$vectorSearch` aggregation pipeline
- Cosine similarity for matching
- Query: component description → embedding → find similar NEC sections
- Filters can be applied (e.g., NEC version, chapter)
- Returns top N results with relevance scores

### Compliance Checking
- LLM receives:
  - Diagram analysis (components, voltages, observations)
  - Relevant NEC code sections for each component
- LLM outputs JSON array of findings
- Each finding includes: component, NEC reference, status, severity, details

### Error Handling
- JSON parsing has try/except with fallbacks
- Vision/LLM errors return empty/error findings rather than crashing
- Database errors printed to console

## Setup Requirements

### 1. MongoDB Atlas
- Create cluster (free M0 tier works)
- Get connection string
- **Critical**: Must manually create vector search index via Atlas UI:
  ```json
  {
    "fields": [{
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    }]
  }
  ```
  Name: `nec_vector_index`

### 2. Fireworks AI
- Sign up at fireworks.ai
- Get API key (starts with `fw_`)
- Requires access to vision models

### 3. NEC PDF
- Need NEC 2023 (or other version) PDF
- Will be parsed and embedded during ingestion

### 4. Environment Variables
Required in `.env`:
```
MONGODB_URI=mongodb+srv://...
FIREWORKS_API_KEY=fw_...
```

## Running the System

1. **Install dependencies**:
   ```bash
   pip install -e .
   ```

2. **Ingest NEC PDF** (one time):
   ```bash
   python scripts/ingest_nec.py /path/to/nec.pdf 2023
   ```

3. **Start server**:
   ```bash
   python app/main.py
   # or: uvicorn app.main:app --reload
   ```

4. **Test**:
   ```bash
   curl -X POST http://localhost:8000/analyze-file \
     -F "file=@diagram.png"
   ```

## Future Multi-Agent Expansion

This MVP can be expanded into the full hackathon vision:

### Planned Agents
1. **Orchestrator Agent** - Task decomposition, agent discovery, result aggregation
2. **Vision Analyst Agent** - Diagram analysis specialist
3. **Compliance Checker Agent** - Code lookup and violation detection

### Additional MongoDB Collections
- `agent_registry` - Agent capabilities and status
- `task_queue` - Task assignments and dependencies
- `conversations` - Agent context and message history

### Agent Communication
- Message-based protocol with MongoDB as broker
- Context compression for token efficiency
- Skill-based agent discovery
- Task handoff and collaboration tracking

See `/Users/vatsalbajaj/.claude/plans/streamed-exploring-yao.md` for original multi-agent design.

## Known Limitations

1. **Vector Index**: Must be created manually in Atlas (driver doesn't support creation)
2. **No Authentication**: API is completely open (add auth for production)
3. **Synchronous Analysis**: Analysis blocks request (should be async with job queue)
4. **No Rate Limiting**: Fireworks API calls are not rate-limited
5. **Limited Error Details**: API returns 500 with string on errors (should be structured)
6. **No Image Validation**: Doesn't verify image is actually a circuit diagram
7. **PDF Parsing Fallback**: If NEC structure not recognized, falls back to chunking

## Development Notes

### Adding New Endpoints
1. Add route function in `app/main.py`
2. Create request/response models in `app/models.py` if needed
3. Use dependency injection: `db = get_database()`, `fireworks = get_fireworks_client()`

### Modifying Vision Analysis
- Edit `VISION_SYSTEM_PROMPT` in `app/compliance.py`
- Adjust `Component` model in `app/models.py` if output schema changes
- Update JSON parsing in `analyze_diagram()` method

### Modifying Compliance Logic
- Edit `COMPLIANCE_SYSTEM_PROMPT` in `app/compliance.py`
- Adjust `ComplianceFinding` model if output schema changes
- Modify `_build_compliance_context()` to change LLM input

### Debugging
- Check console output for detailed logs
- Each analysis prints progress: `[analysis_id] Analyzing diagram...`
- JSON parsing errors show the raw response content
- Database errors are caught and printed

## Testing Checklist

- [ ] MongoDB connection works (`GET /health`)
- [ ] NEC codes ingested (check `nec_codes_count` in health endpoint)
- [ ] Vector search index created in Atlas
- [ ] Fireworks API key valid
- [ ] Vision model can analyze test image
- [ ] Vector search returns relevant codes
- [ ] LLM generates compliance findings
- [ ] Results stored in MongoDB
- [ ] Can retrieve analysis by ID

## Contact & Resources

- **MongoDB Atlas**: https://cloud.mongodb.com
- **Fireworks AI**: https://fireworks.ai
- **Hackathon Prompt**: Multi-Agent Collaboration (Statement Two)
- **Plan File**: `/Users/vatsalbajaj/.claude/plans/streamed-exploring-yao.md`

---

Last Updated: 2026-01-10
