"""Application configuration"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # MongoDB
    mongodb_uri: str

    # Fireworks AI
    fireworks_api_key: str
    fireworks_vision_model: str = "accounts/fireworks/models/qwen2p5-vl-32b-instruct"
    fireworks_text_model: str = "accounts/fireworks/models/llama-v3p1-70b-instruct"
    fireworks_embedding_model: str = "nomic-ai/nomic-embed-text-v1.5"

    # Application
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


settings = Settings()
