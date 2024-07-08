const BASE_URL = window.location.origin || `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;

export const scrapeUrl = async (url) => {
    const response = await fetch(`${BASE_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });
    return response.json();
};

export const listAudios = async () => {
    const response = await fetch(`${BASE_URL}/list-audios`);
    return response.json();
};

export const renameAudio = async (oldName, newName) => {
    const formData = new FormData();
    formData.append('old_name', oldName);
    formData.append('new_name', newName);
    const response = await fetch(`${BASE_URL}/rename-audio`, {
        method: 'POST',
        body: formData,
    });
    return response.json();
};

export const deleteAudio = async (fileName) => {
    const formData = new FormData();
    formData.append('file_name', fileName);
    const response = await fetch(`${BASE_URL}/delete-audio`, {
        method: 'POST',
        body: formData,
    });
    return response.json();
};