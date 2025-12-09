let player;
let playerUiEnabled = true; // Flag para controlar el estado de la UI

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing player...');

    // === Bitmovin player configuration ===
    const playerConfig = {
        key: 'c8783938-0606-4bcf-846d-828906104339',
        playback: { autoplay: false },
        ui: playerUiEnabled
    };

    const playerContainer = document.getElementById('player');
    player = new bitmovin.player.Player(playerContainer, playerConfig);

    // Add event listeners for debugging
    player.on('ready', () => {
        console.log('Player is ready');
    });

    player.on('error', (event) => {
        console.error('Player error:', event);
    });

    player.on('sourceerror', (event) => {
        console.error('Source error:', event);
    });
    console.log('Player instance created:', player);
    console.log('Player initialized');
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
async function loadSource(source, type) {
    try {
        console.log(`Starting to load ${type} source:`, source);

        console.log('Unloading previous source...');
        await player.unload();

        console.log('Loading new source...');
        await player.load(source);

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

    document.getElementById('togglePlayerUi').addEventListener('click', async () => {
        if (!player) {
            alert('Player not initialized yet');
            return;
        }

        // Toggle the UI flag
        playerUiEnabled = !playerUiEnabled;

        player.destroy();

        const newPlayerConfig = {
            key: 'c8783938-0606-4bcf-846d-828906104339',
            playback: { autoplay: false },
            ui: playerUiEnabled
        };

        const playerContainer = document.getElementById('player');
        player = new bitmovin.player.Player(playerContainer, newPlayerConfig);
        
        // Update button text
        const toggleButton = document.getElementById('togglePlayerUi');
        toggleButton.textContent = playerUiEnabled ? 'Hide UI' : 'Show UI';
    });
});
