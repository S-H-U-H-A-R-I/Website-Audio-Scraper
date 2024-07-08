// script.js
import { UIManager } from './uiManager.js';
import * as api from './api.js';

const uiManager = new UIManager();

document.getElementById('scrapeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    uiManager.showMessage('Scraping started...', 'info');
    const url = document.getElementById('url').value;
    const data = await api.scrapeUrl(url);
    uiManager.showMessage(data.message, data.success ? 'success' : 'error');
    await uiManager.loadAudioFiles();
});

uiManager.loadAudioFiles();
