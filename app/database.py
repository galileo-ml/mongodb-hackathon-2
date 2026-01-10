"""MongoDB database connection and utilities"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import IndexModel, ASCENDING
from app.config import settings

# Global database client
_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_to_mongodb():
    """Connect to MongoDB Atlas"""
    global _client, _db

    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client.get_default_database()

    # Create indexes (commented out for initial setup - will create manually)
    # await create_indexes()

    print(f"Connected to MongoDB: {_db.name}")


async def close_mongodb_connection():
    """Close MongoDB connection"""
    global _client

    if _client:
        _client.close()
        print("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    """Get the database instance"""
    if _db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongodb() first.")
    return _db


async def create_indexes():
    """Create necessary indexes including vector search index"""
    db = get_database()

    # Create index on nec_codes collection
    await db.nec_codes.create_indexes([
        IndexModel([("section", ASCENDING)], unique=True),
        IndexModel([("chapter", ASCENDING)]),
        IndexModel([("nec_version", ASCENDING)]),
    ])

    # Create index on analyses collection
    await db.analyses.create_indexes([
        IndexModel([("analysis_id", ASCENDING)], unique=True),
        IndexModel([("created_at", ASCENDING)]),
    ])

    print("Database indexes created")


async def create_vector_search_index():
    """
    Create vector search index on nec_codes collection.

    Note: This must be done via MongoDB Atlas UI or Atlas CLI because
    vector search indexes cannot be created via the standard driver API.

    Index definition for Atlas UI:
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
    """
    print("""
    Vector search index must be created manually in MongoDB Atlas:

    1. Go to MongoDB Atlas Console
    2. Navigate to your cluster > Browse Collections
    3. Select your database > nec_codes collection
    4. Click on "Search Indexes" tab
    5. Click "Create Search Index"
    6. Select "JSON Editor" and paste:

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

    7. Name it "nec_vector_index"
    8. Click "Create"
    """)


async def vector_search(
    collection_name: str,
    query_embedding: list[float],
    limit: int = 5,
    filters: dict | None = None
) -> list[dict]:
    """
    Perform vector search on a collection

    Args:
        collection_name: Name of the collection
        query_embedding: Query vector
        limit: Number of results to return
        filters: Optional filters (e.g., {"nec_version": "2023"})

    Returns:
        List of matching documents with scores
    """
    db = get_database()
    collection = db[collection_name]

    # Build pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": limit * 10,
                "limit": limit,
            }
        },
        {
            "$project": {
                "_id": 0,
                "section": 1,
                "title": 1,
                "full_text": 1,
                "chapter": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    # Add filters if provided
    if filters:
        pipeline[0]["$vectorSearch"]["filter"] = filters

    results = await collection.aggregate(pipeline).to_list(length=limit)
    return results


async def rag_search(query_embedding: list[float], limit: int = 10) -> list[dict]:
    """
    RAG: Semantic search for relevant NEC chunks.

    Searches the nec_chunks collection for semantically similar text.

    Args:
        query_embedding: Query vector (from diagram description)
        limit: Number of results to return

    Returns:
        List of matching chunks with text and metadata

    Note: Requires vector index "chunk_vector_index" on nec_chunks.embedding
    Create in MongoDB Atlas UI:
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
    """
    db = get_database()

    pipeline = [
        {
            "$vectorSearch": {
                "index": "chunk_vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": limit * 10,
                "limit": limit,
            }
        },
        {
            "$project": {
                "_id": 0,
                "chunk_id": 1,
                "article": 1,
                "article_title": 1,
                "text": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    try:
        results = await db.nec_chunks.aggregate(pipeline).to_list(length=limit)
        return results
    except Exception as e:
        print(f"RAG search error (vector index may not exist): {e}")
        return []
