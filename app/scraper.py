import os
import aiohttp
import aiofiles
import re
from icecream import ic
from bs4 import BeautifulSoup
from typing import List
from urllib.parse import urljoin, urlparse

async def scrape_audio_links(url: str) -> List[str]:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(str(url)) as response:
                response.raise_for_status()
                text = await response.text()
    except TypeError as e:
        ic(e)
    
    soup = BeautifulSoup(text, 'html.parser')
    audio_links = []
    
    audio_tags = soup.find_all('audio')
    for audio in audio_tags:
        src = audio.get('src')
        if src:
            audio_links.append(urljoin(url, src))
            
    links = soup.find_all('a')
    audio_extensions = ('.mp3', '.wav', '.ogg', '.m4a')
    for link in links:
        href = link.get('href')
        if href and href.lower().endswith(audio_extensions):
            audio_links.append(urljoin(url, href))
            
    scripts = soup.find_all('script')
    for script in scripts:
        if script.string:
            matches = re.findall(r'https?://[^\s"\']+\.(?:mp3|wav|ogg|m4a)', script.string)
            audio_links.extend(matches)
            
    return audio_links


async def download_audio(url: str, project_dir: str) -> str:
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    filename = os.path.basename(parsed_url.path)
    
    download_dir = os.path.join(project_dir, 'downloads', domain)
    os.makedirs(download_dir, exist_ok=True)
    
    file_path = os.path.join(download_dir, filename)
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            async with aiofiles.open(file_path, 'wb') as file:
                while True:
                    chunk = await response.content.read(8192)
                    if not chunk:
                        break
                    await file.write(chunk)
    return file_path


async def scrape_and_download(url: str, project_dir: str) -> List[str]:
    audio_links = await scrape_audio_links(url)
    downloaded_files = []
    
    for link in audio_links:
        try:
            file_path = await download_audio(link, project_dir)
            downloaded_files.append(file_path)
        except Exception as e:
            ic(f"Error downloading {link}: {str(e)}")

    return downloaded_files