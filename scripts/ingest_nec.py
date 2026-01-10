#!/usr/bin/env python3
"""CLI script to ingest NEC PDF - stores sections with categories + full articles + optional RAG chunks"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.pdf_parser import NECPDFParser, chunk_text_for_rag
from app.database import connect_to_mongodb, close_mongodb_connection, get_database
from app.fireworks_client import get_fireworks_client


async def ingest_nec_pdf(pdf_path: str, nec_version: str = "2023", with_rag: bool = False):
    """
    Ingest NEC PDF and store:
    1. Individual sections with article and categories (nec_codes collection)
    2. Full article text (nec_full_text collection)
    3. (Optional) RAG chunks with embeddings (nec_chunks collection)

    Args:
        pdf_path: Path to NEC PDF file
        nec_version: NEC version year
        with_rag: If True, also generate embeddings for RAG chunks
    """
    print(f"Starting NEC PDF ingestion: {pdf_path}")
    print(f"NEC Version: {nec_version}")
    print(f"RAG Embeddings: {'ENABLED' if with_rag else 'disabled'}")
    print("=" * 60)

    # Connect to database
    await connect_to_mongodb()

    try:
        # Initialize parser
        parser = NECPDFParser()
        db = get_database()

        sections_processed = 0
        articles_processed = 0
        errors = 0

        # Step 1: Parse and store individual sections with categories
        print("\n[Step 1/2] Parsing individual code sections...")

        for section in parser.parse_sections(pdf_path):
            try:
                print(f"  Section {section.section}: {section.title[:40]}... (Article {section.article})")

                # Store in database (upsert) - NO EMBEDDINGS
                await db.nec_codes.update_one(
                    {"section": section.section, "nec_version": nec_version},
                    {
                        "$set": {
                            "section": section.section,
                            "title": section.title,
                            "full_text": section.full_text,
                            "article": section.article,
                            "chapter": section.chapter,
                            "categories": section.categories,
                            "nec_version": nec_version
                        }
                    },
                    upsert=True
                )

                sections_processed += 1

                if sections_processed % 20 == 0:
                    print(f"    [{sections_processed} sections processed]")

            except Exception as e:
                print(f"  ERROR processing section {section.section}: {e}")
                errors += 1

        # Step 2: Parse and store full articles
        print(f"\n[Step 2/2] Parsing full articles...")

        for article in parser.parse_articles(pdf_path):
            try:
                print(f"  Article {article.number}: {article.title[:40]}... ({len(article.full_content)} chars)")

                # Store in database (upsert)
                await db.nec_full_text.update_one(
                    {"article": article.number, "nec_version": nec_version},
                    {
                        "$set": {
                            "article": article.number,
                            "article_title": article.title,
                            "full_content": article.full_content,
                            "chapter": article.chapter,
                            "categories": article.categories,
                            "nec_version": nec_version
                        }
                    },
                    upsert=True
                )

                articles_processed += 1

            except Exception as e:
                print(f"  ERROR processing article {article.number}: {e}")
                errors += 1

        # Step 3: RAG chunks with embeddings (optional)
        chunks_processed = 0
        if with_rag:
            print(f"\n[Step 3/3] Generating RAG chunks with embeddings...")
            fireworks = get_fireworks_client()

            # Re-parse articles for chunking
            for article in parser.parse_articles(pdf_path):
                try:
                    # Chunk the article content
                    chunks = chunk_text_for_rag(
                        article.full_content,
                        chunk_size=800,
                        overlap=100
                    )

                    for i, chunk in enumerate(chunks):
                        chunk_id = f"{article.number}_{i}"

                        # Generate embedding
                        embedding = await fireworks.generate_embedding(chunk['text'][:2000])

                        # Store in database
                        await db.nec_chunks.update_one(
                            {"chunk_id": chunk_id, "nec_version": nec_version},
                            {
                                "$set": {
                                    "chunk_id": chunk_id,
                                    "article": article.number,
                                    "article_title": article.title,
                                    "text": chunk['text'],
                                    "embedding": embedding,
                                    "start_pos": chunk['start_pos'],
                                    "end_pos": chunk['end_pos'],
                                    "nec_version": nec_version
                                }
                            },
                            upsert=True
                        )
                        chunks_processed += 1

                        if chunks_processed % 50 == 0:
                            print(f"    [{chunks_processed} chunks processed]")

                except Exception as e:
                    print(f"  ERROR chunking article {article.number}: {e}")
                    errors += 1

            print(f"    Total RAG chunks: {chunks_processed}")

        # Create indexes
        print("\n[Creating indexes...]")
        await db.nec_codes.create_index("article")
        await db.nec_codes.create_index("categories")
        await db.nec_codes.create_index("nec_version")
        await db.nec_full_text.create_index("article")
        await db.nec_full_text.create_index("nec_version")

        if with_rag:
            await db.nec_chunks.create_index("article")
            await db.nec_chunks.create_index("nec_version")
            print("  Indexes created (including nec_chunks)")
            print("  NOTE: Create vector index manually in MongoDB Atlas for nec_chunks.embedding")
        else:
            print("  Indexes created on article, categories, nec_version")

        # Summary
        print(f"\n{'='*60}")
        print("INGESTION COMPLETE!")
        print(f"{'='*60}")
        print(f"  Sections processed: {sections_processed}")
        print(f"  Full articles processed: {articles_processed}")
        if with_rag:
            print(f"  RAG chunks processed: {chunks_processed}")
        print(f"  Errors: {errors}")
        print(f"\nCollections updated:")
        print(f"  - nec_codes: Individual sections with article/categories")
        print(f"  - nec_full_text: Full article text")
        if with_rag:
            print(f"  - nec_chunks: RAG chunks with embeddings")
        else:
            print(f"\nNo embeddings generated (using category-based lookup)")
        print(f"{'='*60}\n")

    finally:
        await close_mongodb_connection()


async def show_stats():
    """Show current database stats"""
    await connect_to_mongodb()

    try:
        db = get_database()

        # Count documents
        sections_count = await db.nec_codes.count_documents({})
        articles_count = await db.nec_full_text.count_documents({})
        chunks_count = await db.nec_chunks.count_documents({})

        print(f"\nCurrent database stats:")
        print(f"  nec_codes (sections): {sections_count}")
        print(f"  nec_full_text (articles): {articles_count}")
        print(f"  nec_chunks (RAG): {chunks_count}")

        # Sample articles
        if articles_count > 0:
            print("\nSample articles:")
            async for article in db.nec_full_text.find().limit(5):
                print(f"  Article {article.get('article')}: {article.get('article_title', 'Unknown')}")

        # Sample chunks
        if chunks_count > 0:
            print("\nSample RAG chunks:")
            async for chunk in db.nec_chunks.find().limit(3):
                text_preview = chunk.get('text', '')[:60] + "..."
                has_embedding = "embedding" in chunk and len(chunk.get("embedding", [])) > 0
                print(f"  {chunk.get('chunk_id')}: {text_preview} (embedding: {has_embedding})")

    finally:
        await close_mongodb_connection()


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python scripts/ingest_nec.py <path_to_nec_pdf> [nec_version] [--with-rag]")
        print("  python scripts/ingest_nec.py --stats")
        print()
        print("Examples:")
        print("  python scripts/ingest_nec.py ~/Downloads/NEC_2023.pdf 2023")
        print("  python scripts/ingest_nec.py ~/Downloads/NEC_2023.pdf 2023 --with-rag")
        print("  python scripts/ingest_nec.py --stats")
        print()
        print("Options:")
        print("  --with-rag    Generate embeddings for RAG (semantic search)")
        sys.exit(1)

    if sys.argv[1] == "--stats":
        asyncio.run(show_stats())
        return

    pdf_path = sys.argv[1]

    # Parse arguments
    nec_version = "2023"
    with_rag = False

    for arg in sys.argv[2:]:
        if arg == "--with-rag":
            with_rag = True
        elif not arg.startswith("--"):
            nec_version = arg

    # Validate file exists
    if not Path(pdf_path).exists():
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    # Run ingestion
    asyncio.run(ingest_nec_pdf(pdf_path, nec_version, with_rag))


if __name__ == "__main__":
    main()
