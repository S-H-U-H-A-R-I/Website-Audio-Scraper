from pydantic import BaseModel, HttpUrl
from typing import List

class ScrapingRequest(BaseModel):
    url: HttpUrl
    
class ScrapingResponse(BaseModel):
    audio_links: List[str]
