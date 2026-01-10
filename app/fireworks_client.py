"""Fireworks AI client for vision, text, and embedding models"""
import asyncio
from fireworks.client import Fireworks
from app.config import settings


class FireworksClient:
    """Client for interacting with Fireworks AI models"""

    def __init__(self):
        """Initialize Fireworks client using Fireworks SDK"""
        self.client = Fireworks(api_key=settings.fireworks_api_key)
        self.vision_model = settings.fireworks_vision_model
        self.text_model = settings.fireworks_text_model
        self.embedding_model = settings.fireworks_embedding_model

    async def analyze_image(
        self,
        image_base64: str,
        prompt: str,
        system_prompt: str | None = None,
        max_tokens: int = 4096
    ) -> dict:
        """
        Analyze an image using vision model

        Args:
            image_base64: Base64-encoded image
            prompt: User prompt for analysis
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens in response

        Returns:
            Dictionary with 'content' and 'usage' keys
        """
        def _call_vision_model():
            messages = []

            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            messages.append({
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image_base64}"
                        }
                    }
                ]
            })

            return self.client.chat.completions.create(
                model=self.vision_model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.1
            )

        # Run sync client in thread pool
        response = await asyncio.to_thread(_call_vision_model)

        return {
            "content": response.choices[0].message.content,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }

    async def chat(
        self,
        messages: list[dict],
        max_tokens: int = 2048,
        temperature: float = 0.3
    ) -> dict:
        """
        Generate text completion using chat model

        Args:
            messages: List of message dicts with 'role' and 'content'
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature

        Returns:
            Dictionary with 'content' and 'usage' keys
        """
        def _call_chat():
            return self.client.chat.completions.create(
                model=self.text_model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )

        response = await asyncio.to_thread(_call_chat)

        return {
            "content": response.choices[0].message.content,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }

    async def generate_embedding(self, text: str) -> list[float]:
        """
        Generate embedding vector for text

        Args:
            text: Text to embed

        Returns:
            List of floats representing the embedding vector
        """
        def _call_embedding():
            return self.client.embeddings.create(
                model=self.embedding_model,
                input=text
            )

        response = await asyncio.to_thread(_call_embedding)

        return response.data[0].embedding


# Global client instance
_fireworks_client: FireworksClient | None = None


def get_fireworks_client() -> FireworksClient:
    """Get or create the Fireworks client instance"""
    global _fireworks_client

    if _fireworks_client is None:
        _fireworks_client = FireworksClient()

    return _fireworks_client
