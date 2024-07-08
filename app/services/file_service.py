import os
from icecream import ic

async def get_downloads_dir():
    project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(project_dir, "downloads")

async def list_audio_files():
    downloads_dir = await get_downloads_dir()
    audio_files = []
    for root, dirs, files in os.walk(downloads_dir):
        for file in files:
            if file.endswith(('.mp3', '.wav', '.ogg', '.m4a')):
                relative_path = os.path.relpath(os.path.join(root, file), downloads_dir)
                audio_files.append(relative_path)
    return audio_files

async def rename_audio_file(old_name: str, new_name: str):
    downloads_dir = await get_downloads_dir()
    old_path = os.path.join(downloads_dir, old_name)
    new_path = os.path.join(os.path.dirname(old_path), new_name)
    if not os.path.exists(old_path):
        raise FileNotFoundError("Old file not found")
    os.rename(old_path, new_path)

async def delete_audio_file(file_name: str):
    downloads_dir = await get_downloads_dir()
    file_path = os.path.join(downloads_dir, file_name)
    if not os.path.exists(file_path):
        raise FileNotFoundError("File not found")
    os.remove(file_path)
