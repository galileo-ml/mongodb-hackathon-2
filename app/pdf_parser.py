"""NEC PDF parser for extracting code sections and articles"""
import re
from typing import Generator
import pymupdf4llm


# Map NEC article numbers to categories
ARTICLE_CATEGORIES = {
    100: ["definitions"],
    110: ["general", "installation"],
    200: ["wiring", "circuits"],
    210: ["branch_circuits", "residential"],
    215: ["feeders"],
    220: ["calculations", "load"],
    225: ["outside_branch"],
    230: ["services"],
    240: ["overcurrent", "protection", "breakers"],
    250: ["grounding", "bonding"],
    300: ["wiring_methods"],
    310: ["conductors"],
    400: ["flexible_cords"],
    408: ["panels", "switchboards"],
    409: ["industrial_control"],
    430: ["motors"],
    440: ["hvac", "air_conditioning"],
    445: ["generators"],
    450: ["transformers"],
    480: ["batteries", "storage"],
    500: ["hazardous", "classified"],
    600: ["signs", "lighting"],
    625: ["ev_charging"],
    680: ["pools", "spas"],
    690: ["solar", "photovoltaic"],
    700: ["emergency", "standby"],
    702: ["optional_standby"],
    705: ["interconnection", "parallel", "distributed"],
    706: ["energy_storage"],
    708: ["critical_operations"],
    725: ["remote_control", "signaling"],
    760: ["fire_alarm"],
}


class NECSection:
    """Represents a single NEC code section"""

    def __init__(
        self,
        section: str,
        title: str,
        full_text: str,
        chapter: int | None = None,
        article: int | None = None,
        categories: list[str] | None = None
    ):
        self.section = section
        self.title = title
        self.full_text = full_text
        self.chapter = chapter
        self.article = article or self._extract_article(section)
        self.categories = categories or self._get_categories()

    def _extract_article(self, section: str) -> int | None:
        """Extract article number from section (e.g., '445.12' -> 445)"""
        try:
            return int(section.split('.')[0])
        except (ValueError, IndexError):
            return None

    def _get_categories(self) -> list[str]:
        """Get categories based on article number"""
        if self.article:
            return ARTICLE_CATEGORIES.get(self.article, [])
        return []

    def __repr__(self):
        return f"NECSection(section='{self.section}', article={self.article}, categories={self.categories})"


class NECArticle:
    """Represents a full NEC article with complete text"""

    def __init__(
        self,
        number: int,
        title: str,
        full_content: str,
        chapter: int | None = None
    ):
        self.number = number
        self.title = title
        self.full_content = full_content
        self.chapter = chapter or (number // 100)
        self.categories = ARTICLE_CATEGORIES.get(number, [])

    def __repr__(self):
        return f"NECArticle(number={self.number}, title='{self.title}', categories={self.categories})"


class NECPDFParser:
    """Parser for NEC PDF documents"""

    # Regex patterns for NEC structure
    SECTION_PATTERN = re.compile(r'^(\d{3}\.\d+)\s+(.+?)$', re.MULTILINE)
    ARTICLE_PATTERN = re.compile(r'^Article\s+(\d{3})\s+(.+?)$', re.MULTILINE | re.IGNORECASE)

    def __init__(self):
        self.sections = []
        self._raw_text = None

    def _load_pdf(self, pdf_path: str) -> str:
        """Load and cache PDF text"""
        if self._raw_text is None:
            print(f"Parsing PDF: {pdf_path}")
            try:
                self._raw_text = pymupdf4llm.to_markdown(pdf_path)
            except Exception as e:
                print(f"Error extracting PDF: {e}")
                raise
        return self._raw_text

    def parse_sections(self, pdf_path: str, chunk_size: int = 2000) -> Generator[NECSection, None, None]:
        """
        Parse NEC PDF and yield individual code sections with categories

        Args:
            pdf_path: Path to NEC PDF file
            chunk_size: Maximum characters per section

        Yields:
            NECSection objects with article and categories
        """
        text = self._load_pdf(pdf_path)
        sections = self._split_into_sections(text, chunk_size)

        for section in sections:
            yield section

        print(f"Extracted {len(sections)} sections from PDF")

    def parse_articles(self, pdf_path: str) -> Generator[NECArticle, None, None]:
        """
        Parse NEC PDF and yield full articles (complete text per article)

        Args:
            pdf_path: Path to NEC PDF file

        Yields:
            NECArticle objects with full content
        """
        text = self._load_pdf(pdf_path)

        # Find all article matches
        matches = list(self.ARTICLE_PATTERN.finditer(text))

        if not matches:
            print("No article headers found")
            return

        articles_found = 0
        for i, match in enumerate(matches):
            try:
                article_num = int(match.group(1))
                title = match.group(2).strip()

                # Get text from this article to the next
                start = match.start()
                end = matches[i + 1].start() if i + 1 < len(matches) else len(text)

                article_text = text[start:end].strip()

                yield NECArticle(
                    number=article_num,
                    title=title,
                    full_content=article_text,
                    chapter=article_num // 100
                )
                articles_found += 1

            except (ValueError, IndexError) as e:
                print(f"Error parsing article: {e}")
                continue

        print(f"Extracted {articles_found} full articles from PDF")

    def parse_pdf(self, pdf_path: str, chunk_size: int = 2000) -> Generator[NECSection, None, None]:
        """
        Legacy method - parse NEC PDF and yield structured sections

        Args:
            pdf_path: Path to NEC PDF file
            chunk_size: Maximum characters per section (for embedding)

        Yields:
            NECSection objects
        """
        return self.parse_sections(pdf_path, chunk_size)

    def _split_into_sections(self, text: str, chunk_size: int) -> list[NECSection]:
        """Split markdown text into NEC sections with categories"""
        sections = []

        # Find all section matches
        matches = list(self.SECTION_PATTERN.finditer(text))

        if not matches:
            # If no sections found, try to split by articles
            article_matches = list(self.ARTICLE_PATTERN.finditer(text))

            if article_matches:
                print("No section numbers found, splitting by articles")
                return self._split_by_articles(text, article_matches, chunk_size)
            else:
                # Fallback: split by paragraphs
                print("No structure found, splitting by chunks")
                return self._split_by_chunks(text, chunk_size)

        # Process each section
        for i, match in enumerate(matches):
            section_num = match.group(1)
            title = match.group(2).strip()

            # Get text from this section to the next
            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)

            section_text = text[start:end].strip()

            # Truncate if too long
            if len(section_text) > chunk_size:
                section_text = section_text[:chunk_size] + "..."

            # Extract article number and get categories
            try:
                article = int(section_num.split('.')[0])
            except (ValueError, IndexError):
                article = None

            chapter = article // 100 if article else None
            categories = ARTICLE_CATEGORIES.get(article, []) if article else []

            sections.append(NECSection(
                section=section_num,
                title=title,
                full_text=section_text,
                chapter=chapter,
                article=article,
                categories=categories
            ))

        return sections

    def _split_by_articles(
        self,
        text: str,
        matches: list,
        chunk_size: int
    ) -> list[NECSection]:
        """Split text by article boundaries"""
        sections = []

        for i, match in enumerate(matches):
            article_num = match.group(1)
            title = match.group(2).strip()

            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)

            article_text = text[start:end].strip()

            try:
                article = int(article_num)
            except ValueError:
                article = None

            chapter = article // 100 if article else None
            categories = ARTICLE_CATEGORIES.get(article, []) if article else []

            # Split long articles into chunks
            if len(article_text) > chunk_size:
                chunks = self._chunk_text(article_text, chunk_size)
                for j, chunk in enumerate(chunks):
                    sections.append(NECSection(
                        section=f"{article_num}.{j}",
                        title=f"{title} (Part {j + 1})",
                        full_text=chunk,
                        chapter=chapter,
                        article=article,
                        categories=categories
                    ))
            else:
                sections.append(NECSection(
                    section=article_num,
                    title=title,
                    full_text=article_text,
                    chapter=chapter,
                    article=article,
                    categories=categories
                ))

        return sections

    def _split_by_chunks(self, text: str, chunk_size: int) -> list[NECSection]:
        """Fallback: split text into equal chunks"""
        sections = []
        chunks = self._chunk_text(text, chunk_size)

        for i, chunk in enumerate(chunks):
            sections.append(NECSection(
                section=f"chunk_{i + 1}",
                title=f"NEC Content (Chunk {i + 1})",
                full_text=chunk,
                chapter=None,
                article=None,
                categories=[]
            ))

        return sections

    def _chunk_text(self, text: str, chunk_size: int) -> list[str]:
        """Split text into chunks at paragraph boundaries"""
        chunks = []
        current_chunk = ""

        paragraphs = text.split('\n\n')

        for para in paragraphs:
            if len(current_chunk) + len(para) > chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = para
            else:
                current_chunk += "\n\n" + para if current_chunk else para

        if current_chunk:
            chunks.append(current_chunk)

        return chunks


def chunk_text_for_rag(text: str, chunk_size: int = 800, overlap: int = 100) -> list[dict]:
    """
    Split text into overlapping chunks for RAG embeddings.

    Args:
        text: Text to chunk
        chunk_size: Maximum characters per chunk
        overlap: Number of overlapping characters between chunks

    Returns:
        List of dicts with 'text', 'start_pos', 'end_pos'
    """
    chunks = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))

        # Try to break at sentence boundary if not at the end
        if end < len(text):
            # Look for sentence endings in the last 100 chars
            search_start = max(end - 100, start)
            last_period = text.rfind('. ', search_start, end)
            last_newline = text.rfind('\n', search_start, end)

            # Use the later boundary
            break_point = max(last_period, last_newline)
            if break_point > start:
                end = break_point + 1

        chunk_text = text[start:end].strip()

        if chunk_text:  # Only add non-empty chunks
            chunks.append({
                'text': chunk_text,
                'start_pos': start,
                'end_pos': end
            })

        # Move start forward, accounting for overlap
        start = end - overlap if end < len(text) else len(text)

    return chunks
