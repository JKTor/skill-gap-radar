from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "sqlite:///./skillgap.db"
    secret_key: str = "dev-secret-key"
    environment: str = "development"


settings = Settings()
