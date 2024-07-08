from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
from icecream import ic

from ..models import ScrapingRequest, ScrapingResponse
from ..services import scraper_service, file_service

router = APIRouter()


@router.post("/scrape", response_model=ScrapingResponse)
async def scrape_website(request: ScrapingRequest):
    try:
        downloaded_files = await scraper_service.scrape_and_download(request.url)
        response = ScrapingResponse(audio_links=downloaded_files)
        return JSONResponse(content={"audio_links": response.audio_links, "message": "Downloaded audio files", "success": True})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list-audios")
async def list_audios():
    audio_files = await file_service.list_audio_files()
    return JSONResponse(content={"audio_files": audio_files})


@router.post("/rename-audio")
async def rename_audio(old_name: str = Form(...), new_name: str = Form(...)):
    try:
        await file_service.rename_audio_file(old_name, new_name)
        return JSONResponse(content={"message": "Audio renamed successfully", "success": True}) 
    except FileNotFoundError:
        return JSONResponse(content={"message": "Old file not found", "success": False})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/delete-audio")
async def delete_audio(file_name: str = Form(...)):
    try:
        await file_service.delete_audio_file(file_name)
        return JSONResponse(content={"message": "Audio deleted successfully", "success": True})
    except FileNotFoundError:
        return JSONResponse(content={"message": "File not found", "success": False})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
