import { AudioPlayer } from './audioPlayer.js';
import * as api from './api.js';

export class UIManager {
    constructor() {
        this.audioFiles = document.getElementById('audioFiles');
        this.messageContainer = this.createMessageContainer();
    }

    createAudioElement(file) {
        const li = document.createElement('li');
        li.className = 'glass p-4';

        const fileName = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
        const ext = file.substring(file.lastIndexOf('.') + 1);
        const audioId = `audio-${encodeURIComponent(file).replace(/[\.%]/g, "_")}`;

        li.innerHTML = /* html */`
            <div class="flex items-center justify-between">
                <span class="max-w-[65%] overflow-auto whitespace-nowrap scrollbar-hide">${fileName}</span>
                <div>
                    <button class="play-button glass-button text-white px-2 py-1 rounded" data-playing="false">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="rename-button glass-button text-white px-2 py-1 rounded">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-button glass-button text-white px-2 py-1 rounded">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <audio id="${audioId}" class="w-full mt-2"></audio>
        `;

        const playButton = li.querySelector('.play-button');
        const renameButton = li.querySelector('.rename-button');
        const deleteButton = li.querySelector('.delete-button');

        this.audioFiles.appendChild(li);

        const audioPlayer = new AudioPlayer(file, playButton, this);
        playButton.addEventListener('click', () => audioPlayer.toggle());
        renameButton.addEventListener('click', () => this.renameAudio(file, ext));
        deleteButton.addEventListener('click', () => this.deleteAudio(file));

        return li;
    }

    async loadAudioFiles() {
        const data = await api.listAudios();
        this.audioFiles.innerHTML = '';
        data.audio_files.forEach(file => {
            const audioElement = this.createAudioElement(file);
            this.audioFiles.appendChild(audioElement);
        });
    }

    async renameAudio(oldName, ext) {
        const fileName = oldName.substring(oldName.lastIndexOf('/') + 1, oldName.lastIndexOf('.'));
        const newName = prompt("Enter new name for the file:", fileName);
        if (newName) {
            const newFullName = `${newName}.${ext}`
            const result = await api.renameAudio(oldName, newFullName);
            this.showMessage(result.message, result.success ? 'success' : 'error');
            await this.loadAudioFiles();
        }
    }

    async deleteAudio(fileName) {
        if (confirm(`Are you sure you want to delete ${fileName}`)) {
            const result = await api.deleteAudio(fileName);
            this.showMessage(result.message, result.success ? 'success' : 'error');
            await this.loadAudioFiles();
        }
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(container);
        return container;
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `glass-message p-4 mb-2 max-w-md transition-opacity duration-300 ease-in-out opacity-0`;

        let borderColor, textColor;
        switch (type) {
            case 'error':
                borderColor = 'border-red-500';
                textColor = 'text-red-500';
                break;
            case 'success':
                borderColor = 'border-green-500';
                textColor = 'text-green-500';
                break;
            default:
                borderColor = 'border-slate-500';
                textColor = 'text-slate-500';
        }

        messageElement.classList.add(borderColor, textColor);
        messageElement.textContent = message;
        this.messageContainer.appendChild(messageElement);

        // Fade in
        setTimeout(() => {
            messageElement.classList.remove('opacity-0');
            messageElement.classList.add('opacity-100');
        }, 10);

        // Fade out and remove
        setTimeout(() => {
            messageElement.classList.remove('opacity-100');
            messageElement.classList.add('opacity-0');
            setTimeout(() => this.messageContainer.removeChild(messageElement), 300);
        }, 3000);
    }
}
