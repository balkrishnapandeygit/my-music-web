

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const songCards = document.querySelectorAll('.song-card');
    const artistCards = document.querySelectorAll('.artist-card');

    // New control buttons
    const mainPlayPauseBtn = document.getElementById('mainPlayPauseBtn');
    const nextSongBtn = document.getElementById('nextSongBtn');
    const prevSongBtn = document.getElementById('prevSongBtn');

    // Define your songs and their paths relative to your HTML file
    // Each key now maps to an ARRAY of song paths for that category/playlist
    const songs = {
        'love song': [
            'songs/category/love songs/Ae Dil Hai Mushkil.mp3',
            'songs/category/love songs/kon tujhe yu pyar.mp3',
            'songs/category/love songs/Mitwa .mp3',
            'songs/category/love songs/tujhme rab.mp3',
            'songs/category/love songs/Tumse hi.mp3',
            'songs/category/love songs/saiyara.mp3'
        ], // love song will add here



        'Sadabahar': [
            'songs/category/old bollywood songs/Mere Mehboob Qayamat Hogi.mp3'
        ],// old song will add here


        'punjabi hood': [
            'songs/category/punjabi songs/sidhu.mp3',
            'songs/category/punjabi songs/chambal ke daku.mp3'
            
        ],//  punjabi  song will add here



        'hits': [
            'songs/category/love songs/saiyara.mp3'
        ],//  top hits  song will add here


        'English': [
            'songs/category/english songs/dandelions.mp3'
        ] //  english  song will add here
    };

    // Mapping of artists to their respective songs (can also be arrays if an artist has multiple default songs)
    const artists = {
        'artist1': [
            'songs/artist/kishor kumar/Mere Mehboob Qayamat Hogi.mp3'
        ],//kishor kumar songs will add here 
        
        'artist2': [
            'songs/artist/arjit singh/Ae Dil Hai Mushkil.mp3'
        ],//arjit singh songs will add here 
        
        'artist3': [
            'songs/artist/K K/dil ibadat.mp3'
        ],// k k  songs will add here 
        
        'artist4': [
            'songs/category/love songs/kon tujhe yu pyar.mp3'
        ],//  songs will add here 
        
        'artist5': [
            'songs/category/punjabi songs/chambal ke daku.mp3'
        ]//  songs will add here 
    };

    let currentPlayingCard = null; // Reference to the card whose song is currently playing
    let currentPlaylist = [];     // The array of songs currently being played (e.g., songs.romance)
    let currentPlaylistKey = null; // The key of the current playlist (e.g., 'romance')
    let currentSongIndex = -1;    // Index of the current song in currentPlaylist

    /**
     * Plays or pauses a song. If a new song path is provided, it loads and plays it.
     * If the current song is already playing, it pauses it.
     * @param {string} songPath - The path to the song file.
     * @param {HTMLElement} cardElement - The HTML element of the song/artist card.
     * @param {string} playlistKey - The key of the playlist this song belongs to (e.g., 'romance').
     * @param {number} songIndex - The index of the song within its playlist array.
     */
    function playSong(songPath, cardElement, playlistKey, songIndex) {
        const fullSongUrl = new URL(songPath, window.location.href).href;
        console.log(`Attempting to load song from: ${fullSongUrl}`);

        // Check if the clicked song is already the current one and is playing
        if (audioPlayer.src === fullSongUrl && !audioPlayer.paused) {
            audioPlayer.pause();
            console.log(`Paused: ${songPath}`);
            updatePlayPauseUI(false); // Update main play/pause button to play
        } else {
            // If it's a new song or the current one is paused
            audioPlayer.src = songPath;
            audioPlayer.play()
                .then(() => {
                    console.log(`Playing: ${songPath}`);
                    updatePlayPauseUI(true); // Update main play/pause button to pause

                    // Update UI for the previously playing card (if any)
                    if (currentPlayingCard && currentPlayingCard !== cardElement) {
                        const prevPlayButton = currentPlayingCard.querySelector('.play-button i');
                        if (prevPlayButton) {
                            prevPlayButton.classList.remove('fa-pause');
                            prevPlayButton.classList.add('fa-play');
                        }
                    }

                    // Update UI for the newly playing card
                    const currentPlayButton = cardElement.querySelector('.play-button i');
                    if (currentPlayButton) {
                        currentPlayButton.classList.remove('fa-play');
                        currentPlayButton.classList.add('fa-pause');
                    }
                    currentPlayingCard = cardElement;
                    currentPlaylistKey = playlistKey;
                    currentSongIndex = songIndex;
                    // Set the active playlist based on the key
                    currentPlaylist = songs[playlistKey] || artists[playlistKey] || [];
                })
                .catch(error => {
                    console.error(`Error playing song ${songPath}:`, error);
                    updatePlayPauseUI(false); // Revert UI if play fails
                });
        }
    }

    /**
     * Updates the main play/pause button icon.
     * @param {boolean} isPlaying - True if audio is playing, false otherwise.
     */
    function updatePlayPauseUI(isPlaying) {
        if (isPlaying) {
            mainPlayPauseBtn.querySelector('i').classList.remove('fa-play');
            mainPlayPauseBtn.querySelector('i').classList.add('fa-pause');
        } else {
            mainPlayPauseBtn.querySelector('i').classList.remove('fa-pause');
            mainPlayPauseBtn.querySelector('i').classList.add('fa-play');
        }
    }

    /**
     * Plays the next song in the current playlist.
     */
    function playNextSong() {
        console.log("Attempting to play next song.");
        console.log("Current Playlist:", currentPlaylist);
        console.log("Current Song Index:", currentSongIndex);

        if (currentPlaylist.length === 0 || currentSongIndex === -1) {
            console.log("No current playlist or song selected. Please select a song first.");
            // Optionally, you can display a message to the user here
            return;
        }

        let nextIndex = currentSongIndex + 1;
        if (nextIndex >= currentPlaylist.length) {
            nextIndex = 0; // Loop back to the start of the playlist
        }

        const nextSongPath = currentPlaylist[nextIndex];
        // When playing next/previous, we reuse the currentPlayingCard as the reference for UI updates
        // This assumes the card context remains the same for the playlist.
        playSong(nextSongPath, currentPlayingCard, currentPlaylistKey, nextIndex);
    }

    /**
     * Plays the previous song in the current playlist.
     */
    function playPreviousSong() {
        console.log("Attempting to play previous song.");
        console.log("Current Playlist:", currentPlaylist);
        console.log("Current Song Index:", currentSongIndex);

        if (currentPlaylist.length === 0 || currentSongIndex === -1) {
            console.log("No current playlist or song selected. Please select a song first.");
            // Optionally, you can display a message to the user here
            return;
        }

        let prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) {
            prevIndex = currentPlaylist.length - 1; // Loop back to the end of the playlist
        }

        const prevSongPath = currentPlaylist[prevIndex];
        playSong(prevSongPath, currentPlayingCard, currentPlaylistKey, prevIndex);
    }

    // Event listeners for song cards
    songCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        const songKey = card.dataset.song; // This gets 'romance', 'dance', etc.

        playButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (songs[songKey] && songs[songKey].length > 0) {
                // When a card is clicked, start playing the first song in its associated playlist
                playSong(songs[songKey][0], card, songKey, 0);
            } else {
                console.error(`No songs found for key: ${songKey}`);
            }
        });

        // Optional: Allow clicking anywhere on the card to play the first song in the playlist
        card.addEventListener('click', () => {
            if (songs[songKey] && songs[songKey].length > 0) {
                playSong(songs[songKey][0], card, songKey, 0);
            }
        });
    });

    // Event listeners for artist cards (assuming each artist card plays their first song)
    artistCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        const artistKey = card.dataset.artist;

        playButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (artists[artistKey] && artists[artistKey].length > 0) {
                playSong(artists[artistKey][0], card, artistKey, 0);
            } else {
                console.error(`No songs found for artist: ${artistKey}`);
            }
        });

        card.addEventListener('click', () => {
            if (artists[artistKey] && artists[artistKey].length > 0) {
                playSong(artists[artistKey][0], card, artistKey, 0);
            }
        });
    });

    // Event listeners for new global control buttons
    mainPlayPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            if (audioPlayer.src) { // Only play if a song is loaded
                audioPlayer.play();
                updatePlayPauseUI(true);
            } else if (currentPlaylist.length > 0 && currentSongIndex !== -1) {
                // If no src but a playlist is selected, try playing the current song
                playSong(currentPlaylist[currentSongIndex], currentPlayingCard, currentPlaylistKey, currentSongIndex);
            } else {
                console.log("No song loaded to play. Click on a song card first.");
            }
        } else {
            audioPlayer.pause();
            updatePlayPauseUI(false);
        }
    });

    nextSongBtn.addEventListener('click', playNextSong);
    prevSongBtn.addEventListener('click', playPreviousSong);

    // Event listener for when the audio finishes playing
    audioPlayer.addEventListener('ended', () => {
        console.log("Song ended. Playing next song.");
        // Automatically play the next song when the current one ends
        playNextSong();
    });

    // Event listener for when the audio encounters an error
    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', audioPlayer.error);
        updatePlayPauseUI(false); // Ensure UI reflects error state
        switch (audioPlayer.error.code) {
            case audioPlayer.error.MEDIA_ERR_ABORTED:
                console.error('You aborted the audio playback.');
                break;
            case audioPlayer.error.MEDIA_ERR_NETWORK:
                console.error('A network error caused the audio download to fail.');
                break;
            case audioPlayer.error.MEDIA_ERR_DECODE:
                console.error('The audio playback was aborted due to a corruption problem or because the media used features your browser did not support.');
                break;
            case audioPlayer.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.error('The audio could not be loaded, either because the server or network failed or because the format is not supported.');
                break;
            default:
                console.error('An unknown audio error occurred.');
                break;
        }
    });
});
