export class AudioPlayer {
    constructor(fileName, button, uiManager) {
        this.fileName = fileName;
        this.button = button;
        this.audioElement = this.getAudioElement();
        this.icon = button.querySelector("i");
        this.uiManager = uiManager;
    }

    getAudioElement() {
        const audioId = `audio-${encodeURIComponent(this.fileName).replace(/[\.%]/g, "_")}`;
        return document.getElementById(audioId);
    }

    play() {
        if (!this.audioElement) {
            this.audioElement = this.getAudioElement();
            if (!this.audioElement) {
                this.uiManager.showMessage(`File ${fileName} not found`, 'error');
                return;
            }
        }
        if (!this.audioElement.src) this.audioElement.src = `/downloads/${this.fileName}`;
        this.audioElement.play();
        this.updateUI(true);
    }

    pause() {
        this.audioElement.pause();
        this.updateUI(false);
    }

    updateUI(isPlaying) {
        this.icon.className = isPlaying ? "fas fa-pause" : "fas fa-play";
        this.button.title = isPlaying ? "Pause" : "Play";
        this.button.dataset.playing = isPlaying.toString();
    }

    handleEnded = () => {
        this.updateUI(false);
    }

    toggle() {
        if (this.audioElement.paused) {
            this.play();
        } else {
            this.pause();
        }
        this.audioElement.onended = this.handleEnded;
    }
}
