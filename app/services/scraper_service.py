import os
from icecream import ic

from ..scraper import scrape_and_download as scraper_function

async def scrape_and_download(url: str) -> list:
    project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return await scraper_function(url, project_dir)
