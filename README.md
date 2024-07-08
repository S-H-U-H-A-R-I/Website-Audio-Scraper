# Website Audio Scraper

This is a FastAPI-based web application that scrapes audio links from a given website and downloads them to the project's 'downloads' folder.

## Installation

1. Clone this repository
2. Install the required packages (Optional: create a virtual env using Python):

    ```bash
    pip install -r requirements.txt
    ```

## Usage

1. Run the FastAPI server:

    ```bash
    uvicorn app.main:app --reload
    ```
2. Open your browser and go to `http://localhost:8000/`.
3. Input the URL of the website you want to scrape audio links from.
4. Click the "Scrape and Download" button.
5. Wait for the scraping process to complete.
6. Available audio files will show under "Available Audio Files" on the page.
7. Downloads will be in the downloads folder, under the project's root directory.

## License

This project is open-source and available under the MIT License. See the LICENSE file for more details.
