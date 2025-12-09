let player;
let playerWithoutUi = true;

function initPlayer(playerElement, playerConfig) {
    console.log('initializing player...', playerElement);
    console.log('player config...', playerConfig);

    const playerContainer = document.getElementById(playerElement);
    const playerInstance = new bitmovin.player.Player(playerContainer, playerConfig);

    // Add event listeners for debugging
    playerInstance.on('ready', () => {
        console.log('Player is ready');
    });

    playerInstance.on('error', (event) => {
        console.error('Player error:', event);
    });

    playerInstance.on('sourceerror', (event) => {
        console.error('Source error:', event);
    });
    console.log('Player instance created:', playerInstance);
    console.log('Player initialized');

    return playerInstance;
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded...');

    // === Bitmovin player configuration ===
    const playerConfig = {
        key: 'c8783938-0606-4bcf-846d-828906104339',
        playback: { autoplay: false }
    };

    player = initPlayer('player', playerConfig);

    const playerWithoutUiConfig = {
        key: 'c8783938-0606-4bcf-846d-828906104339',
        playback: { autoplay: false },
        ui: false
    };

    playerWithoutUi = initPlayer('playerWithoutUi', playerWithoutUiConfig);

});

// === Test source (public, no auth required) ===
const testSource = {
    hls: 'https://raw.githubusercontent.com/andreinahr/unily-test/refs/heads/main/video/manifest.m3u8',
};

// === Test audio source (public MP3) ===
const testAudioSource = {
    progressive: 'https://archive.org/download/testmp3testfile/mpthreetest.mp3'
};

// === Test source video with subtitles ===
const testVideoWithSubtitlesSource = {
    hls: 'https://raw.githubusercontent.com/andreinahr/unily-test/refs/heads/main/video/manifest.m3u8',
    title: 'Carl',
    subtitleTracks: [
        {
            url: 'https://raw.githubusercontent.com/andreinahr/unily-test/refs/heads/main/video/vtt/vtt.srt',
            label: 'Spanish',
            id: 'es',
            kind: 'subtitles',
            lang: 'es',
            enabled: true
        }
    ]
};

// === Load sources ===
async function loadSource(source, type, playerInstance = player) {
    try {
        console.log(`Starting to load ${type} source:`, source);

        console.log('Unloading previous source...');
        await playerInstance.unload();

        console.log('Loading new source...');
        await playerInstance.load(source);

        console.log(`${type} source loaded successfully!`);
    } catch (error) {
        console.error(`Error loading ${type}:`, error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            data: error.data
        });
        alert(`Failed to load ${type}: ${error.message || error.code || 'Unknown error'}`);
    }
}

// === Button handlers ===
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadTest').addEventListener('click', async () => {
        if (!player) {
            alert('Player not initialized yet');
            return;
        }
        await loadSource(testSource, 'test video');
    });

    document.getElementById('loadTestAudio').addEventListener('click', async () => {
        if (!player) {
            alert('Player not initialized yet');
            return;
        }
        await loadSource(testAudioSource, 'test audio');
    });

    document.getElementById('loadVideoWithSubtitles').addEventListener('click', async () => {
        if (!player) {
            alert('Player not initialized yet');
            return;
        }
        await loadSource(testVideoWithSubtitlesSource, 'test video with subtitles');
    });

    document.getElementById('loadTestWithoutUi').addEventListener('click', async () => {
        if (!playerWithoutUi) {
            alert('Player without UI not initialized yet');
            return;
        }
        await loadSource(testSource, 'test video', playerWithoutUi);
    });

    document.getElementById('loadTestAudioWithoutUi').addEventListener('click', async () => {
        if (!playerWithoutUi) {
            alert('Player without UI not initialized yet');
            return;
        }
        await loadSource(testAudioSource, 'test audio', playerWithoutUi);
    });

    document.getElementById('loadVideoWithSubtitlesWithoutUi').addEventListener('click', async () => {
        if (!playerWithoutUi) {
            alert('Player without UI not initialized yet');
            return;
        }
        await loadSource(testVideoWithSubtitlesSource, 'test video with subtitles', playerWithoutUi);
    });

    // Play button handler
    document.getElementById('playButton').addEventListener('click', () => {
        if (playerWithoutUi) {
            playerWithoutUi.play();
        }
    });

    // Pause button handler
    document.getElementById('pauseButton').addEventListener('click', () => {
        if (playerWithoutUi) {
            playerWithoutUi.pause();
        }
    });
});
