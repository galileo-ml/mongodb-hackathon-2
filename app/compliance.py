"""Compliance checking logic - Hybrid approach with category-based lookup + RAG + LLM knowledge"""
import json
import re
from typing import Any
from app.fireworks_client import FireworksClient
from app.database import get_database, rag_search


# Map system types to relevant NEC articles
SYSTEM_TO_ARTICLES = {
    "generator": [445, 700, 702, 705, 250, 240],
    "solar": [690, 705, 250, 240],
    "motor": [430, 440, 250, 240],
    "panel": [408, 240, 250],
    "transformer": [450, 480, 250, 240],
    "residential": [210, 220, 230, 240, 250],
    "commercial": [210, 215, 220, 230, 240, 250],
    "industrial": [430, 440, 450, 480, 240, 250],
    "ev_charging": [625, 240, 250],
    "battery_storage": [480, 706, 240, 250],
}


VISION_SYSTEM_PROMPT = """You are an expert electrical engineer analyzing single-line diagrams.

Describe what you see in this electrical diagram in plain English. Include:

1. **System Overview**: What type of electrical system is this?
2. **Main Components**: Describe the major components (transformers, panels, breakers, motors, generators, etc.)
3. **Voltage Levels**: What voltage levels are shown?
4. **Protection Devices**: What protection/safety devices are visible?
5. **Grounding**: Is grounding shown? How?
6. **Concerns**: Any obvious issues or areas that might need attention?

At the END of your response, on a new line, specify the primary system type:
SYSTEM_TYPE: [generator|solar|motor|panel|transformer|residential|commercial|industrial|ev_charging|battery_storage]

Be descriptive but concise. Focus on what's actually visible in the diagram."""


COMPLIANCE_SYSTEM_PROMPT = """You are an expert NEC (National Electrical Code) inspector.

You have THREE sources of information:
1. The electrical diagram (image you can see)
2. Relevant NEC code sections provided below
3. Your built-in knowledge of NEC codes

IMPORTANT INSTRUCTIONS:
- Use the provided NEC codes as your PRIMARY source for compliance checks
- ALSO cite any additional NEC codes from your knowledge that apply to this system
- For codes from your knowledge (not in the provided list), add "(from NEC knowledge)" to the description

STATUS VALUES:
- "pass": Code applies AND diagram shows compliance
- "warning": Code applies but details unclear/need verification
- "fail": Code applies AND diagram shows clear violation
- "not_applicable": Code does not apply to this system type

Output ONLY a JSON array of findings:
[
  {
    "id": "rc1",
    "name": "Generator Overcurrent Protection",
    "status": "pass",
    "standard": "NEC 445.12",
    "message": "Protective relays (50/51) properly installed",
    "description": "NEC 445.12 requires generators to be protected against overcurrent",
    "location": {"sheet": 1, "region": "Generator"}
  }
]

RULES:
1. Generate a unique id for each finding (rc1, rc2, rc3...)
2. "name" should be a descriptive check name
3. "message" is a brief result (what you found)
4. "description" explains what the code requires
5. "location.region" should identify where in the diagram this applies
6. Include BOTH codes from the provided list AND relevant codes from your NEC knowledge
7. Aim for 8-15 total findings covering major compliance areas

CRITICAL - DIVERSE CODE CITATIONS:
8. Each finding MUST cite a DIFFERENT NEC code section. Do NOT repeat the same code.
9. Match each finding to its SPECIFIC applicable code. Examples:
   - Grounding/bonding → NEC 250.x (250.30, 250.32, 250.64, etc.)
   - Overcurrent protection → NEC 240.x (240.4, 240.21, etc.)
   - Generator requirements → NEC 445.x (445.11, 445.12, 445.13, etc.)
   - Emergency/standby systems → NEC 700.x or 702.x
   - Interconnection with utility → NEC 705.x
   - Conductors → NEC 310.x
   - Services → NEC 230.x
   - Transformers → NEC 450.x
10. If multiple aspects fall under one code, pick the MOST important one and find other codes for other findings."""


class ComplianceChecker:
    """Main compliance checking service - Hybrid approach"""

    def __init__(self, fireworks: FireworksClient):
        self.fireworks = fireworks

    async def analyze_diagram(self, image_base64: str) -> tuple[str, str]:
        """
        Use vision model to get description AND identify system type

        Args:
            image_base64: Base64-encoded PNG image

        Returns:
            Tuple of (description, system_type)
        """
        prompt = "Analyze this single-line electrical diagram and describe what you see. Remember to specify the SYSTEM_TYPE at the end."

        response = await self.fireworks.analyze_image(
            image_base64=image_base64,
            prompt=prompt,
            system_prompt=VISION_SYSTEM_PROMPT,
            max_tokens=2000
        )

        content = response["content"]

        # Extract system type from response
        system_type = self._extract_system_type(content)

        return content, system_type

    def _extract_system_type(self, description: str) -> str:
        """Extract system type from vision model response"""
        # Look for SYSTEM_TYPE: xxx pattern
        match = re.search(r'SYSTEM_TYPE:\s*\[?(\w+)\]?', description, re.IGNORECASE)
        if match:
            system_type = match.group(1).lower()
            # Validate it's a known type
            if system_type in SYSTEM_TO_ARTICLES:
                return system_type

        # Fallback: try to infer from content
        description_lower = description.lower()
        if "generator" in description_lower or "dg" in description_lower:
            return "generator"
        elif "solar" in description_lower or "pv" in description_lower or "photovoltaic" in description_lower:
            return "solar"
        elif "motor" in description_lower:
            return "motor"
        elif "transformer" in description_lower:
            return "transformer"
        elif "panel" in description_lower or "switchboard" in description_lower:
            return "panel"
        elif "ev" in description_lower or "charging" in description_lower:
            return "ev_charging"
        elif "battery" in description_lower or "storage" in description_lower:
            return "battery_storage"

        # Default to commercial
        return "commercial"

    async def find_relevant_codes(self, system_type: str, diagram_description: str = "") -> dict:
        """
        Load NEC codes using hybrid approach: category-based lookup + RAG search

        Args:
            system_type: Type of electrical system
            diagram_description: Description of the diagram for RAG search

        Returns:
            Dictionary with 'sections', 'full_context', and 'rag_chunks' lists
        """
        articles = SYSTEM_TO_ARTICLES.get(system_type, [240, 250])

        db = get_database()

        # 1. Category-based: Get individual code sections for these articles
        sections = await db.nec_codes.find({
            "article": {"$in": articles}
        }).to_list(length=200)

        # 2. Category-based: Get full article context (if available)
        full_context = await db.nec_full_text.find({
            "article": {"$in": articles}
        }).to_list(length=20)

        # 3. RAG: Semantic search for relevant chunks (if description provided)
        rag_chunks = []
        if diagram_description:
            try:
                # Generate embedding for the diagram description
                query_embedding = await self.fireworks.generate_embedding(
                    diagram_description[:1500]  # Limit to avoid token overflow
                )
                rag_chunks = await rag_search(query_embedding, limit=10)
                print(f"RAG found {len(rag_chunks)} relevant chunks")
            except Exception as e:
                print(f"RAG search failed (continuing without): {e}")

        print(f"Loaded {len(sections)} sections, {len(full_context)} full articles, {len(rag_chunks)} RAG chunks for {system_type}")

        return {
            "sections": sections,
            "full_context": full_context,
            "rag_chunks": rag_chunks
        }

    async def check_compliance(
        self,
        image_base64: str,
        description: str,
        relevant_codes: dict
    ) -> list:
        """
        Use vision model to compare diagram against NEC codes

        Args:
            image_base64: Original diagram image
            description: Plain text description of the diagram
            relevant_codes: Dict with 'sections' and 'full_context'

        Returns:
            List of finding dictionaries
        """
        # Build context with codes
        context = self._build_compliance_context(description, relevant_codes)

        # Use vision model so it can see the actual diagram
        response = await self.fireworks.analyze_image(
            image_base64=image_base64,
            prompt=context,
            system_prompt=COMPLIANCE_SYSTEM_PROMPT,
            max_tokens=4000
        )

        # Parse the response
        try:
            content = response["content"]

            # Remove thinking tags if present
            if "<think>" in content and "</think>" in content:
                parts = content.split("</think>")
                if len(parts) > 1:
                    content = parts[1].strip()

            # Try to extract JSON array
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
            elif content.strip().startswith("["):
                json_str = content.strip()
            else:
                # Try to find JSON array
                match = re.search(r'\[[\s\S]*\]', content)
                if match:
                    json_str = match.group(0)
                else:
                    json_str = content

            findings = json.loads(json_str)

            # Ensure it's a list
            if not isinstance(findings, list):
                findings = []

            return findings

        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error parsing compliance findings: {e}")
            print(f"Response: {response['content'][:500]}")
            return [{
                "id": "error",
                "name": "Parse Error",
                "status": "warning",
                "standard": "N/A",
                "message": f"Error analyzing compliance: {str(e)}",
                "description": "Failed to parse compliance check results",
                "location": {"sheet": 1, "region": "Unknown"}
            }]

    def _build_compliance_context(self, description: str, relevant_codes: dict) -> str:
        """Build context string for LLM with category codes + RAG chunks"""
        context_parts = ["# Electrical Diagram Description\n"]
        context_parts.append(description)

        sections = relevant_codes.get("sections", [])
        full_context = relevant_codes.get("full_context", [])
        rag_chunks = relevant_codes.get("rag_chunks", [])

        # Add RAG chunks first (most semantically relevant)
        if rag_chunks:
            context_parts.append("\n\n# Most Relevant NEC Passages (Semantic Search)\n")
            for chunk in rag_chunks:
                article = chunk.get('article', 'Unknown')
                title = chunk.get('article_title', 'Unknown')
                text = chunk.get('text', '')
                score = chunk.get('score', 0)

                context_parts.append(f"\n## Article {article}: {title} (relevance: {score:.2f})")
                context_parts.append(f"\n{text}")

        # Add individual sections from category lookup
        if sections:
            context_parts.append("\n\n# NEC Code Sections (Category-Based)\n")
            for code in sections[:25]:  # Limit to prevent token overflow
                section = code.get('section', 'Unknown')
                title = code.get('title', 'Unknown')
                full_text = code.get('full_text', '')

                # Truncate long sections
                if len(full_text) > 600:
                    full_text = full_text[:600] + "..."

                context_parts.append(f"\n## NEC {section}: {title}")
                context_parts.append(f"\n{full_text}")

        # Add full article context if available
        if full_context:
            context_parts.append("\n\n# Full Article Context\n")
            for article in full_context[:3]:  # Limit to prevent token overflow
                article_num = article.get('article', 'Unknown')
                title = article.get('article_title', 'Unknown')
                content = article.get('full_content', '')

                # Summarize very long articles
                if len(content) > 1500:
                    content = content[:1500] + "...[truncated]"

                context_parts.append(f"\n## Article {article_num}: {title}")
                context_parts.append(f"\n{content}")

        context_parts.append(
            "\n\n# Task\n"
            "Evaluate the diagram against the NEC codes above. "
            "Also use your built-in NEC knowledge to identify any additional applicable codes. "
            "Output findings as a JSON array with pass/warning/fail/not_applicable status."
        )

        return "\n".join(context_parts)

    async def analyze_and_check(
        self,
        analysis_id: str,
        image_base64: str,
        nec_version: str = "2023"
    ) -> dict:
        """
        Complete analysis pipeline: describe diagram, load codes by category, check compliance

        Args:
            analysis_id: Unique analysis ID
            image_base64: Base64-encoded PNG image
            nec_version: NEC version to check against

        Returns:
            Complete analysis result with findings
        """
        # Step 1: Get diagram description AND system type
        print(f"[{analysis_id}] Analyzing diagram...")
        description, system_type = await self.analyze_diagram(image_base64)
        print(f"[{analysis_id}] Got description: {len(description)} chars, system type: {system_type}")

        # Step 2: Load relevant codes (category-based + RAG)
        print(f"[{analysis_id}] Loading NEC codes for system type: {system_type}...")
        relevant_codes = await self.find_relevant_codes(system_type, description)
        sections_count = len(relevant_codes.get("sections", []))
        articles_count = len(relevant_codes.get("full_context", []))
        rag_count = len(relevant_codes.get("rag_chunks", []))
        print(f"[{analysis_id}] Loaded {sections_count} sections, {articles_count} full articles, {rag_count} RAG chunks")

        # Step 3: Check compliance (with image for visual verification)
        print(f"[{analysis_id}] Checking compliance...")
        findings = await self.check_compliance(image_base64, description, relevant_codes)

        # Count by status
        passing_count = sum(1 for f in findings if f.get("status") == "pass")
        warning_count = sum(1 for f in findings if f.get("status") == "warning")
        failing_count = sum(1 for f in findings if f.get("status") == "fail")
        not_applicable_count = sum(1 for f in findings if f.get("status") == "not_applicable")

        print(f"[{analysis_id}] Generated findings: {passing_count} pass, "
              f"{warning_count} warning, {failing_count} fail, {not_applicable_count} not_applicable")

        # Only count applicable codes in the score
        total_applicable = passing_count + warning_count + failing_count

        # Calculate compliance score: pass = 100%, warning = 50%, fail = 0%
        if total_applicable > 0:
            score = ((passing_count * 100) + (warning_count * 50)) / total_applicable
        else:
            score = 0.0

        from datetime import datetime
        created_at = datetime.utcnow()

        # Build structured result matching frontend contract
        result = {
            "analysis_id": analysis_id,
            "status": "completed",
            "created_at": created_at.isoformat() + "Z",
            "nec_version": nec_version,
            "system_type": system_type,
            "diagram_description": description,
            "findings": findings,
            "summary": {
                "total_codes_evaluated": total_applicable,
                "passing_count": passing_count,
                "warning_count": warning_count,
                "failing_count": failing_count,
                "not_applicable_count": not_applicable_count,
                "compliance_score": round(score, 1)
            }
        }

        # Step 4: Store in database
        db = get_database()
        await db.analyses.insert_one({
            "analysis_id": analysis_id,
            "status": "completed",
            "system_type": system_type,
            "diagram_description": description,
            "findings": findings,
            "summary": result["summary"],
            "created_at": created_at,
            "nec_version": nec_version
        })

        print(f"[{analysis_id}] Analysis complete and stored")

        return result
