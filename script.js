// Utility: Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const albums = [
    {
        id: 1,
        slug: "of-all-time-vol2",
        title: "Of All Time Vol. 2",
        artist: "kwebspost",
        cover: "./assets/oat2.jpg",
        releaseDate: "2025-05-01",
        label: "Mental Strain Records",
        releaseNumber: "MSR-003",
        description: "A fantastic release by kwebspost.",
        playingSong: "Echoes for No One",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/4hA77cd02czKnIHVJLLlyj?si=eRp-7_g9ROWSlldHL5wdWA",
            appleMusic: "https://music.apple.com/us/album/of-all-time-vol-2/1809768306",
            youtube: "https://www.youtube.com/playlist?list=OLAK5uy_neo33AhNp92wdIAn7kRK8jbFDCza2TROM",
            bandcamp: "https://kwebspost.bandcamp.com/album/of-all-time-vol-2"
        },
        tracks: [
            { title: "Oats", length: "4:01" },
            { title: "Traffic", length: "3:10" },
            { title: "All Things Considered", length: "3:29" },
            { title: "The World Stopped Spinning", length: "2:26" },
            { title: "Ersatz", length: "3:12" },
            { title: "Rock Bottom", length: "3:54" },
            { title: "Surprising", length: "2:52" },
            { title: "Tip Top", length: "3:30" },
            { title: "Bind Collector", length: "4:14" },
            { title: "Lank", length: "2:22" },
            { title: "Read Minder", length: "2:41" },
            { title: "Deem", length: "3:02" },
            { title: "Jam Deficient", length: "2:09" },
            { title: "Flicker and Fold", length: "2:46" },
            { title: "Sunshiny", length: "3:21" },
            { title: "Echoes for No One", length: "3:36" },
            { title: "Loll", length: "3:17" },
            { title: "Ambition Falls", length: "3:08" },
            { title: "Rise and Shine", length: "3:01" },
            { title: "Somewhere We Knew", length: "3:31" }
        ]
    },
    {
        id: 2,
        slug: "post-kwebs",
        title: "POST KWEBS",
        artist: "kwebspost",
        cover: "./assets/post-kwebs.jpg",
        releaseDate: "2024-10-10",
        label: "Mental Strain Records",
        releaseNumber: "MSR-002",
        description: "A fantastic release by kwebspost.",
        playingSong: "We Have Time",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/1eLfFEXPQKZDsr7vct31aw?si=3eSJUPkHS1aN85suy4qM7A",
            appleMusic: "https://music.apple.com/ca/album/post-kwebs-ep/1771763490",
            youtube: "https://www.youtube.com/playlist?list=OLAK5uy_lFHv8Vc3hKRhcJLK6P28ySNhyrBXSRRr8",
            bandcamp: "https://kwebspost.bandcamp.com/album/post-kwebs"
        },
        tracks: [
            { title: "We Have Time", length: "3:26" },
            { title: "Over & Beyond", length: "3:49" },
            { title: "Piano Postcard", length: "3:01" },
            { title: "What Will We Do?", length: "3:15" },
            { title: "Towards It All", length: "5:06" },
            { title: "Forget Everything", length: "3:14" }
        ]
    },
    {
        id: 3,
        slug: "wayne-street",
        title: "Wayne Street",
        artist: "kwebspost",
        cover: "./assets/wayne-street.jpg",
        releaseDate: "2023-09-01",
        label: "Mental Strain Records",
        releaseNumber: "MSR-001",
        description: "A fantastic release by kwebspost.",
        playingSong: "Dilly Dallying and Lollygagging",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/3RBkOW2PY3WEPluvYymYk4?si=u6SyOFvlTdiW9hjQa_FnGA",
            appleMusic: "https://music.apple.com/ca/album/wayne-street/1700197711",
            youtube: "https://www.youtube.com/playlist?list=OLAK5uy_mYmSZN3c6tk64vpH4aANrb_P4MaxQfCyc",
            bandcamp: "https://kwebspost.bandcamp.com/album/wayne-street"
        },
        tracks: [
            { title: "Stick Around", length: "0:29" },
            { title: "Here It Is", length: "4:10" },
            { title: "Hope Springs", length: "4:34" },
            { title: "Do All Right", length: "3:49" },
            { title: "Pea Soup", length: "2:45" },
            { title: "Stew Eater", length: "3:54" },
            { title: "Iced Promenade", length: "2:52" },
            { title: "Short Cut", length: "3:41" },
            { title: "Dilly Dallying and Lollygagging", length: "3:32" },
            { title: "Wayne Street", length: "2:26" },
            { title: "Farewell", length: "5:10" }
        ]
    },
    {
        id: 4,
        slug: "of-all-time",
        title: "Of All Time",
        artist: "kwebspost",
        cover: "./assets/of-all-time.jpg",
        releaseDate: "2023-04-15",
        label: "No Label",
        releaseNumber: "KWB-004",
        description: "A fantastic release by kwebspost.",
        playingSong: "Awful",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/40Tt8WumPRVP5UY30nkNwm?si=Ndd9ZYb6T9i1UJRVSYZppA",
            appleMusic: "https://music.apple.com/ca/album/of-all-time/1681558060",
            youtube: "https://www.youtube.com/playlist?list=OLAK5uy_m3ldC6fcZDTDbrt-tV5D86tzxsDkz06U4",
            bandcamp: "https://kwebspost.bandcamp.com/album/of-all-time"
        },
        tracks: [
            { title: "Of All Time", length: "2:23" },
            { title: "Left on the Rat", length: "8:18" },
            { title: "Likely", length: "2:41" },
            { title: "Next", length: "1:12" },
            { title: "New Scooter", length: "3:16" },
            { title: "Bruised Ankle", length: "3:29" },
            { title: "Walking", length: "2:52" },
            { title: "Assorted Soundscape", length: "2:49" },
            { title: "Interlude", length: "0:19" },
            { title: "Still", length: "2:33" },
            { title: "Awful", length: "3:58" },
            { title: "Beep Boop", length: "1:20" },
            { title: "Reminisce", length: "1:38" },
            { title: "Woop", length: "1:22" },
            { title: "Blackberry Winter", length: "2:07" },
            { title: "Loading", length: "2:02" },
            { title: "Yeah Yeah", length: "2:12" },
            { title: "Demonstration", length: "2:30" },
            { title: "John Stevens", length: "2:32" },
            { title: "Spoiler", length: "3:23" },
            { title: "Observation", length: "3:04" },
            { title: "Perhaps", length: "3:29" }
        ]
    },
    {
        id: 5,
        slug: "octnov",
        title: "Octnov",
        artist: "kwebspost",
        cover: "./assets/octnov.jpg",
        releaseDate: "2022-12-14",
        label: "No Label",
        releaseNumber: "KWB-003",
        description: "A fantastic release by kwebspost.",
        playingSong: "Fourth",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/766yPTr2agmf9DvQyI79mV?si=gsSThN-6QIiwVp_b3X__UQ",
            appleMusic: "https://music.apple.com/ca/album/octnov/1659027051",
            youtube: "https://www.youtube.com/playlist?list=OLAK5uy_kGKMNekuD80kFW_S8Ha-92NmTRx9TSMeE",
            bandcamp: "https://kwebspost.bandcamp.com/album/octnov"
        },
        tracks: [
            { title: "Flippant", length: "4:06" },
            { title: "F38ji", length: "3:28" },
            { title: "Burger Flipping", length: "1:54" },
            { title: "Fourth", length: "2:49" },
            { title: "Maniacal", length: "2:47" },
            { title: "Dull", length: "2:11" },
            { title: "Very Generic", length: "2:58" }
        ]
    },
    {
        id: 6,
        slug: "scintillating",
        title: "Scintillating",
        artist: "kwebspost",
        cover: "./assets/scintillating.jpg",
        releaseDate: "2022-06-30",
        label: "No Label",
        releaseNumber: "KWB-002",
        description: "A fantastic release by kwebspost.",
        playingSong: "Scintillating",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/5NOqndMB5l07KsM6LJWIiK?si=k-5thl8ERCuq9a7WWdsBcw",
            appleMusic: "https://music.apple.com/ca/album/scintillating-ep/1632728425",
            youtube: "https://www.youtube.com/playlist?list=OLAK5uy_n6Xq7-6ugOsdVzq9aKj4PsTxakqa9f8JU",
            bandcamp: "https://kwebspost.bandcamp.com/album/scintillating"
        },
        tracks: [
            { title: "Ordinary", length: "3:01" },
            { title: "Photocopy", length: "2:23" },
            { title: "Scintillating", length: "3:40" },
            { title: "Object", length: "4:02" },
            { title: "Impulse", length: "2:47" }
        ]
    },
    {
        id: 7,
        slug: "unlikely",
        title: "Unlikely",
        artist: "kwebspost",
        cover: "./assets/unlikely.jpg",
        releaseDate: "2022-05-13",
        label: "No Label",
        releaseNumber: "KWB-001",
        description: "A fantastic release by kwebspost.",
        playingSong: "Unlikely",
        credits: {
            "Producer": "Tyler Witkowski",
            "Mixer": "Tyler Witkowski",
            "Mastering Engineer": "Tyler Witkowski",
            "Artist": "Tyler Witkowski"
        },
        artistLinks: {
            spotify: "https://open.spotify.com/album/1fJv70jjptNBL6U5T9ARRw?si=RUNKhl1USLKb8vBxuLRcBQ",
            appleMusic: "",
            youtube: "https://www.youtube.com/watch?v=KLj4pJTY-To&list=OLAK5uy_lMDr9S-1eOtUrPysGb7L_qR3VRNhqSRrI&index=1",
            bandcamp: "https://kwebspost.bandcamp.com/track/unlikely"
        },
        tracks: [{ title: "Unlikely", length: "2:46" }]
    }
];

const albumList = document.getElementById("album-list");
const albumDetails = document.getElementById("album-details");
const aboutPage = document.getElementById("about-page");
const searchContainer = document.getElementById("search-container");
const searchBar = document.getElementById("search-bar");
const searchClearBtn = document.getElementById("search-clear");
const nowPlayingEl = document.getElementById("now-playing");
const mainElement = document.querySelector("main");
const audioControls = document.getElementById("audio-controls");
const footerEmail = document.querySelector(".footer-email");

let idleTimer;
let swayFrame;
let gridScrollPosition = 0;
let currentAudio = null;

// Combo game tracking
let comboCount = 0;
let lastComboColor = null;
let audioContext = null;
let comboGameEnabled = false;
let highestCombo = 0;
let comboStats = {}; // Track how many times each combo level was achieved
let devMode = false; // Dev mode for testing combos

const qs = (html) => html.trim();

// Dev mode toggle (accessible from console)
window.toggleDevMode = function() {
    devMode = !devMode;
    console.log(`%cDev Mode ${devMode ? 'ENABLED' : 'DISABLED'}`, `color: ${devMode ? '#00ff00' : '#ff0000'}; font-weight: bold; font-size: 16px;`);
    if (devMode) {
        console.log('%cAny color will now count towards combo!', 'color: #ffff00; font-style: italic;');
    }
    
    // Show visual indicator
    const comboDisplay = document.getElementById('combo-display');
    if (comboDisplay && devMode) {
        comboDisplay.style.outline = '2px solid lime';
    } else if (comboDisplay) {
        comboDisplay.style.outline = '';
    }
    return devMode;
};

// Save game data to localStorage
function saveGameData() {
    try {
        localStorage.setItem('msr-combo-stats', JSON.stringify(comboStats));
        localStorage.setItem('msr-highest-combo', highestCombo.toString());
    } catch (e) {
        console.log('Failed to save game data:', e);
    }
}

// Load game data from localStorage
function loadGameData() {
    try {
        const savedStats = localStorage.getItem('msr-combo-stats');
        const savedHighest = localStorage.getItem('msr-highest-combo');
        
        if (savedStats) {
            comboStats = JSON.parse(savedStats);
        }
        if (savedHighest) {
            highestCombo = parseInt(savedHighest, 10) || 0;
        }
    } catch (e) {
        console.log('Failed to load game data:', e);
    }
}

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

async function enableComboGame() {
    if (comboGameEnabled) return;
    
    const ctx = initAudioContext();
    
    // Resume context and play startup sound
    try {
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
        
        // Play startup chime
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        
        // Enable game
        comboGameEnabled = true;
        
        // Load saved game data
        loadGameData();
        
        // Initialize high score display
        updateComboDisplay();
        
        console.log('Combo game enabled!');
    } catch (e) {
        console.log('Failed to enable audio:', e);
    }
}

function resetExpandedAlbumView() {
    albumDetails.classList.remove("expanded-view");

    const closeExpandedBtn = document.getElementById("close-expanded-btn");
    closeExpandedBtn?.classList.add("hidden");

    audioControls?.classList.add("hidden");
    footerEmail?.classList.remove("hidden"); // Show email when audio controls hide
    nowPlayingEl.classList.add("hidden"); // Hide playing song when closing expanded view

    const img = document.getElementById("album-cover-image");
    if (img) {
        img.style.transform = "";
        img.style.transition = "";
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    clearTimeout(idleTimer);
    if (swayFrame) cancelAnimationFrame(swayFrame);
    swayFrame = null;
}

function shakeScreen(comboCount) {
    const intensity = Math.min((comboCount - 5) * 2, 20); // Start at 2px for x6, cap at 20px
    document.body.style.setProperty('--shake-intensity', `${intensity}px`);
    document.body.classList.add('screen-shake');
    
    // Remove shake after animation
    setTimeout(() => {
        document.body.classList.remove('screen-shake');
        document.body.style.removeProperty('--shake-intensity');
    }, 500);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateMetadata(title, description) {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    metaDesc?.setAttribute('content', description);

    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', description);
}

function renderAlbumGrid() {
    resetExpandedAlbumView();

    updateMetadata(
        "Mental Strain Records",
        "Mental Strain Records - The home of kwebspost. Listen to albums like Of All Time Vol.2, Wayne Street, and more!."
    );

    const searchTerm = searchBar.value.toLowerCase();
    const filteredAlbums = albums.filter(a => 
        a.title.toLowerCase().includes(searchTerm) || 
        a.artist.toLowerCase().includes(searchTerm)
    );

    const currentSlugs = Array.from(albumList.querySelectorAll('.album')).map(el => el.dataset.slug);
    const newSlugs = filteredAlbums.map(a => a.slug);
    const hasNoResultsMessage = albumList.querySelector("p") !== null;

    let shouldRender = false;

    if (filteredAlbums.length === 0) {
        if (!hasNoResultsMessage) shouldRender = true;
    } else {
        if (currentSlugs.length !== newSlugs.length || !currentSlugs.every((s, i) => s === newSlugs[i])) {
            shouldRender = true;
        }
    }

    if (shouldRender) {
        if (filteredAlbums.length === 0) {
            albumList.innerHTML = "<p style='padding: 1rem; color: #aaa; text-align: center; grid-column: 1 / -1;'>No albums found matching your search.</p>";
        } else {
            albumList.innerHTML = filteredAlbums
                .map((a) =>
                    qs(`
      <div class="album" data-slug="${a.slug}">
        <img src="${a.cover}" alt="${a.title}" loading="lazy" decoding="async">
        <div class="album-info">
          <h3>${a.title}</h3>
          <p>${a.artist}</p>
        </div>
      </div>
    `)
                )
                .join("");
        }
    }

    const wasHidden = albumList.classList.contains("hidden");

    searchContainer.classList.remove("hidden");
    albumList.classList.remove("hidden");
    albumDetails.classList.add("hidden");
    aboutPage.classList.add("hidden");

    if (wasHidden && gridScrollPosition > 0) {
        mainElement.scrollTop = gridScrollPosition;
    } else if (wasHidden) {
        mainElement.scrollTop = 0;
    }
}

function renderAboutPage() {
    resetExpandedAlbumView();

    if (!albumList.classList.contains("hidden")) {
        gridScrollPosition = mainElement.scrollTop;
    }

    updateMetadata("About - Mental Strain Records", "Learn more about Mental Strain Records and our artists.");

    aboutPage.innerHTML = qs(`
        <h2>About Mental Strain Records</h2>
        <p>Mental Strain Records is an independent record label based in Penticton, B.C., dedicated to releasing local music and supporting local artists. Home of kwebspost. Please get into contact with us via email for any inquiries. Hold down the website logo for a surprise!</p>

        <div class="about-section">
            <h3>Our Links</h3>
            <div class="artist-links">
                <a href="mailto:contact@mentalstrainrecords.com" class="streaming-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mail_%28iOS%29.svg/512px-Mail_%28iOS%29.svg.png" alt="Email">
                </a>
                <a href="https://www.youtube.com/@mentalstrainrecords" target="_blank" rel="noopener" class="streaming-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/YouTube_Music_icon_2024.svg/512px-YouTube_Music_icon_2024.svg.png" alt="YouTube">
                </a>
                <a href="https://mentalstrainrecords.bandcamp.com/" target="_blank" rel="noopener" class="streaming-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bandcamp-button-circle-aqua.svg/512px-Bandcamp-button-circle-aqua.svg.png" alt="Bandcamp">
                </a>
            </div>
        </div>

        <div class="about-section">
            <h3>Our Artists</h3>
            <div class="artist-entry">
                <h4>kwebspost</h4>
                <p>Experimental rock, based in Penticton, B.C.</p>

                <img src="./assets/kwebspostimg.jpg" alt="kwebspost" class="artist-image" loading="lazy" decoding="async">

                <div class="artist-links">
                     <a href="https://open.spotify.com/artist/3AfA9MhbMBjEqjgMXAEDjp?si=Nkv010lFQyiD4BI13Gzq-A" target="_blank" rel="noopener" class="streaming-button">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png" alt="Spotify">
                     </a>
                     <a href="https://music.apple.com/ca/artist/kwebspost/1631478274" target="_blank" rel="noopener" class="streaming-button">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/256px-Apple_Music_icon.svg.png" alt="Apple Music">
                     </a>
                     <a href="https://kwebspost.bandcamp.com" target="_blank" rel="noopener" class="streaming-button">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bandcamp-button-circle-aqua.svg/512px-Bandcamp-button-circle-aqua.svg.png" alt="Bandcamp">
                     </a>
                     <a href="https://www.youtube.com/@kwebspost" target="_blank" rel="noopener" class="streaming-button">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/YouTube_Music_icon_2024.svg/512px-YouTube_Music_icon_2024.svg.png" alt="YouTube">
                     </a>
                     <a href="https://kwebs.ca/" target="_blank" rel="noopener" class="streaming-button">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Terra_globe_icon_light.png" alt="Website">
                     </a>
                </div>
            </div>
        </div>
    `);

    albumList.classList.add("hidden");
    albumDetails.classList.add("hidden");
    aboutPage.classList.remove("hidden");

    mainElement.scrollTop = 0;
}

function renderAlbumDetails(slug) {
    resetExpandedAlbumView();

    const album = albums.find((a) => a.slug === slug);
    if (!album) return renderAlbumGrid();

    if (!albumList.classList.contains("hidden")) {
        gridScrollPosition = mainElement.scrollTop;
    }

    updateMetadata(
        `${album.title} - ${album.artist}`,
        album.description || `Listen to ${album.title} by ${album.artist} on Mental Strain Records.`
    );

    searchContainer.classList.add("hidden"); // Hide search bar in details view

    albumDetails.innerHTML = qs(`
    <div class="album-details-cover">
      <img src="${album.cover}" alt="${album.title}" id="album-cover-image" title="Click to expand" loading="eager" decoding="async">
      <button id="close-expanded-btn" class="hidden">&larr; Back to Details</button>
    </div>
    <div class="album-details-info">
      <button id="back-button">&larr; Back</button>

      <div class="artist-links">
        ${Object.entries(album.artistLinks)
            .filter(([, url]) => url)
            .map(([name, url]) => {
                const logoUrls = {
                    spotify:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/2024_Spotify_logo_without_text.svg/512px-2024_Spotify_logo_without_text.svg.png",
                    appleMusic: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/256px-Apple_Music_icon.svg.png",
                    youtube:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/YouTube_Music_icon_2024.svg/512px-YouTube_Music_icon_2024.svg.png",
                    bandcamp:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bandcamp-button-circle-aqua.svg/512px-Bandcamp-button-circle-aqua.svg.png"
                };
                return `<a href="${url}" target="_blank" rel="noopener" class="streaming-button">
              <img src="${logoUrls[name]}" alt="${name}" loading="lazy" decoding="async">
            </a>`;
            })
            .join("")}
      </div>

      <h2>${album.title}</h2>
      <p><strong>${album.artist}</strong></p>
      <p><em>${album.label} - ${album.releaseNumber} (${album.releaseDate})</em></p>

      <h3>Tracklist</h3>
      <ul id="track-list">
        ${album.tracks
            .map(
                (t, i) =>
                    `<li class="${t.title === album.playingSong ? 'featured-track' : ''}" ${t.title === album.playingSong ? 'id="featured-track-item"' : ''} title="${t.title === album.playingSong ? 'Click to play' : ''}"><span class='track-number'>${i + 1}.</span> ${t.title} <span class='track-length'>${t.length}</span></li>`
            )
            .join("")}
      </ul>

      <h3>Credits</h3>
      <ul class="album-credits">
        ${Object.entries(album.credits)
            .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
            .join("")}
      </ul>
    </div>
  `);

    albumList.classList.add("hidden");
    albumDetails.classList.remove("hidden");
    aboutPage.classList.add("hidden");

    mainElement.scrollTop = 0;

    document.getElementById("back-button").onclick = () => {
        searchBar.value = "";
        searchClearBtn.classList.add("hidden");
        // Scroll position is preserved in gridScrollPosition
        location.hash = "";
    };

    const coverImg = document.getElementById("album-cover-image");
    const closeExpandedBtn = document.getElementById("close-expanded-btn");
    const featuredTrack = document.getElementById("featured-track-item");

    const toggleExpandedView = () => {
        if (albumDetails.classList.contains("expanded-view")) {
            resetExpandedAlbumView();
        } else {
            albumDetails.classList.add("expanded-view");
            closeExpandedBtn.classList.remove("hidden");
            
            audioControls.classList.remove("hidden");
            footerEmail.classList.add("hidden"); // Hide email when audio controls show

            if (album.playingSong) {
                // Separate the label and the song title into different elements
                nowPlayingEl.innerHTML = `
                    <span class="now-playing-label">NOW PLAYING:</span>
                    <div class="now-playing-scroll-container">
                        <span class="now-playing-content">${album.playingSong}</span>
                    </div>
                `;
                nowPlayingEl.classList.remove("hidden");

                const checkOverflow = () => {
                    const scrollContainer = nowPlayingEl.querySelector('.now-playing-scroll-container');
                    const scrollSpan = nowPlayingEl.querySelector('.now-playing-content');
                    if (!scrollContainer || !scrollSpan) return;

                    const containerWidth = scrollContainer.clientWidth;
                    const textWidth = scrollSpan.scrollWidth;

                    if (textWidth > containerWidth) {
                        const duration = textWidth / 50; // Text speed
                        const distance = -(textWidth - containerWidth); // Scroll just enough to show end
                        
                        scrollSpan.style.setProperty('--scroll-duration', `${duration}s`);
                        scrollSpan.style.setProperty('--scroll-distance', `${distance}px`);
                        scrollSpan.classList.add('scrolling-text');
                        scrollContainer.classList.add('mask-enabled'); // Apply mask only when scrolling
                    } else {
                        scrollSpan.classList.remove('scrolling-text');
                        scrollContainer.classList.remove('mask-enabled');
                        scrollSpan.style.removeProperty('--scroll-duration');
                        scrollSpan.style.removeProperty('--scroll-distance');
                    }
                };

                // Wait for layout to settle before measuring
                requestAnimationFrame(() => {
                    checkOverflow();
                    // Double check in case of font loading or slower layout engines
                    setTimeout(checkOverflow, 100);
                });

                // Re-check on window resize
                window.addEventListener('resize', checkOverflow);
            }

            startSwayAnimation(coverImg, 0, 0);

            if (currentAudio) currentAudio.pause();
            currentAudio = new Audio(`./assets/audio/${slug}.mp3`);
            currentAudio.loop = true;
            
            const playPauseBtn = document.getElementById("play-pause-btn");
            const volumeSlider = document.getElementById("volume-slider");
            const timelineSlider = document.getElementById("timeline-slider");
            const currentTimeEl = document.getElementById("current-time");
            const totalTimeEl = document.getElementById("total-time");
            
            // Reset controls
            playPauseBtn.innerHTML = "❚❚";
            playPauseBtn.title = "Pause";
            volumeSlider.value = 0.5;
            timelineSlider.value = 0;
            timelineSlider.style.background = `linear-gradient(to right, #694EFF 0%, #555 0%)`; // Reset gradient
            updateTimelineStyle(volumeSlider, 0.5, 1); // Set initial volume gradient
            currentTimeEl.textContent = "0:00";
            totalTimeEl.textContent = "0:00";
            
            currentAudio.volume = 0.5 * 0.5; // Apply quadratic curve
                        
            // Metadata loaded: set total duration
            currentAudio.onloadedmetadata = () => {
                totalTimeEl.textContent = formatTime(currentAudio.duration);
                timelineSlider.max = currentAudio.duration;
            };

            let isScrubbing = false;
            let wasPlayingBeforeScrub = false;

            // Time update: move slider and update current time text
            currentAudio.ontimeupdate = () => {
                if (!currentAudio || isScrubbing) return;
                timelineSlider.value = currentAudio.currentTime;
                currentTimeEl.textContent = formatTime(currentAudio.currentTime);
                updateTimelineStyle(timelineSlider, currentAudio.currentTime, currentAudio.duration);
            };

            const startScrubbing = () => {
                isScrubbing = true;
                if (!currentAudio.paused) {
                    wasPlayingBeforeScrub = true;
                    currentAudio.pause();
                } else {
                    wasPlayingBeforeScrub = false;
                }
            };

            const stopScrubbing = () => {
                if (!isScrubbing) return; // Already stopped
                isScrubbing = false;
                if (wasPlayingBeforeScrub) {
                    currentAudio.play().catch(console.error);
                }
            };

            // Bind slider events
            timelineSlider.onmousedown = startScrubbing;
            timelineSlider.ontouchstart = startScrubbing;
            
            // Use onchange (committed) and mouse/touch ends for robustness
            timelineSlider.onchange = stopScrubbing;
            timelineSlider.onmouseup = stopScrubbing;
            timelineSlider.ontouchend = stopScrubbing;

            // Slider input: scrub audio
            timelineSlider.oninput = (e) => {
                e.stopPropagation();
                const time = parseFloat(e.target.value);
                currentAudio.currentTime = time;
                currentTimeEl.textContent = formatTime(time);
                updateTimelineStyle(timelineSlider, time, currentAudio.duration);
            };

            // Prevent clicks from bubbling
            timelineSlider.onclick = (e) => e.stopPropagation();

            playPauseBtn.onclick = (e) => {
                e.stopPropagation();
                if (!currentAudio) return;
                
                if (currentAudio.paused) {
                    currentAudio.play().then(() => {
                        playPauseBtn.innerHTML = "❚❚";
                        playPauseBtn.title = "Pause";
                    }).catch(console.error);
                } else {
                    currentAudio.pause();
                    playPauseBtn.innerHTML = "▶";
                    playPauseBtn.title = "Play";
                }
            };

            // Volume slider handler with mobile touch support
            const handleVolumeChange = (e) => {
                e.stopPropagation();
                if (currentAudio) {
                    const val = parseFloat(e.target.value);
                    currentAudio.volume = val * val;
                    updateTimelineStyle(volumeSlider, val, 1);
                }
            };

            volumeSlider.oninput = handleVolumeChange;
            volumeSlider.onchange = handleVolumeChange; // Ensure change fires on mobile
            volumeSlider.ontouchend = handleVolumeChange; // Extra handler for touch devices
            volumeSlider.onclick = (e) => e.stopPropagation(); // Prevent bubbling

            currentAudio.play().catch(e => {
                console.log("No audio found or autoplay blocked", e);
                playPauseBtn.innerHTML = "▶";
                playPauseBtn.title = "Play";
            });
        }
    };

    // Attach click handler to both image and featured track
    coverImg.onclick = toggleExpandedView;
    if (featuredTrack) {
        featuredTrack.onclick = toggleExpandedView;
    }

    closeExpandedBtn.onclick = () => {
        resetExpandedAlbumView();
    };
}

function router() {
    const slug = location.hash.replace("#", "");

    if (slug === "about") {
        renderAboutPage();
    } else if (slug) {
        renderAlbumDetails(slug);
    } else {
        renderAlbumGrid();
    }
}

albumList.addEventListener("click", (e) => {
    const album = e.target.closest(".album");
    if (album) location.hash = album.dataset.slug;
});

searchBar.addEventListener("input", debounce(() => {
    if (searchBar.value.trim().length > 0) {
        searchClearBtn.classList.remove("hidden");
    } else {
        searchClearBtn.classList.add("hidden");
    }
    renderAlbumGrid();
}, 200));

searchClearBtn.addEventListener("click", () => {
    searchBar.value = "";
    searchClearBtn.classList.add("hidden");
    renderAlbumGrid();
    searchBar.focus();
});

document.getElementById("logo-link").addEventListener("click", () => {
    searchBar.value = "";
    searchClearBtn.classList.add("hidden");
    gridScrollPosition = 0;
    if (!location.hash || location.hash === "#") {
        renderAlbumGrid();
        mainElement.scrollTop = 0;
    }
});

window.addEventListener("hashchange", router);

// Handle both async and defer script loading
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", router);
} else {
    // DOM is already loaded, call router immediately
    router();
}

function showComboPopup(count, color) {
    if (!comboGameEnabled) return; // Don't show popups if game isn't active
    
    const popup = document.createElement('div');
    popup.className = `combo-popup ${color}`;
    popup.textContent = `×${count}`;
    popup.style.left = `${Math.random() * 60 + 20}%`;
    popup.style.top = `${Math.random() * 40 + 30}%`;
    document.body.appendChild(popup);
    
    // Screen shake for high combos
    if (count >= 6) {
        shakeScreen(count);
    }
    
    // Play special sound for 9x combo
    if (count === 9) {
        const holyShitAudio = new Audio('./assets/audio/holyshit.mp3');
        holyShitAudio.volume = 1.0;
        holyShitAudio.play().catch(e => console.log('Failed to play holy shit sound:', e));
    }
    
    // Play special sound for 10x+ combos
    if (count >= 10) {
        const godlikeAudio = new Audio('./assets/audio/godlike.mp3');
        godlikeAudio.volume = 1.0;
        godlikeAudio.play().catch(e => console.log('Failed to play godlike sound:', e));
    }
    
    // Play subtle sound effect only if game is enabled
    if (comboGameEnabled) {
        setTimeout(async () => {
            try {
                const ctx = audioContext;
                if (!ctx) return;
                
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.frequency.value = 400 + (count * 100);
                oscillator.type = 'sine';
                
                const now = ctx.currentTime;
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                
                oscillator.start(now);
                oscillator.stop(now + 0.3);
            } catch (e) {
                console.log('Audio error:', e);
            }
        }, 0);
    }
    
    // Remove popup after animation
    setTimeout(() => popup.remove(), 1000);
}

function updateComboDisplay() {
    const comboDisplay = document.getElementById('combo-display');
    const highScoreDisplay = document.getElementById('high-score-display');
    if (!comboDisplay) return;
    
    // Update high score
    if (comboCount > highestCombo) {
        highestCombo = comboCount;
        saveGameData();
    }
    
    // Update impact scale based on combo (starts at 2x)
    if (comboGameEnabled) {
        const impactScale = 1.02 + (Math.max(0, comboCount - 2) * 0.015); // 1.02 at 2x, increases 0.015 per level
        document.body.style.setProperty('--impact-scale', impactScale);
    }
    
    // Show/hide combo counter
    if (comboGameEnabled && comboCount >= 2) {
        comboDisplay.textContent = `Combo: ×${comboCount}`;
        comboDisplay.className = `combo-counter ${lastComboColor}`;
        comboDisplay.style.opacity = '1';
    } else {
        comboDisplay.className = 'hidden';
        comboDisplay.style.opacity = '0';
    }
    
    // Always show high score when game is active
    if (comboGameEnabled && highScoreDisplay) {
        highScoreDisplay.textContent = `Best: ×${highestCombo}`;
        highScoreDisplay.className = 'high-score-counter';
    }
}

function exportStatsImage() {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Solid black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#694EFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Title
    ctx.fillStyle = '#694EFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Combo Stats', canvas.width / 2, 60);
    
    // Highest combo
    ctx.fillStyle = '#FF383F';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(`Highest Combo: ×${highestCombo}`, canvas.width / 2, 120);
    
    // Total combos
    const totalCombos = Object.values(comboStats).reduce((a, b) => a + b, 0);
    ctx.fillStyle = '#FFFFA3';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Total Combos: ${totalCombos}`, canvas.width / 2, 155);
    
    // Get top 5 rarest combos (lowest count)
    const sortedByCount = Object.entries(comboStats)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5);
    
    if (sortedByCount.length > 0) {
        ctx.fillStyle = '#FFFFA3';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Top 5 Rarest Combos Achieved:', canvas.width / 2, 195);
        
        const maxCount = Math.max(...sortedByCount.map(([_, count]) => count));
        const startY = 235;
        const barHeight = 40;
        const barSpacing = 60;
        const maxBarWidth = 500;
        
        sortedByCount.forEach(([combo, count], index) => {
            const y = startY + (index * barSpacing);
            const barWidth = (count / maxCount) * maxBarWidth;
            
            // Bar background
            ctx.fillStyle = '#222';
            ctx.fillRect(140, y, maxBarWidth, barHeight);
            
            // Bar fill - solid blue
            ctx.fillStyle = '#694EFF';
            ctx.fillRect(140, y, barWidth, barHeight);
            
            // Label
            ctx.fillStyle = '#FFFFA3';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`×${combo}`, 130, y + 27);
            
            // Count
            ctx.fillStyle = '#FFFFA3';
            ctx.textAlign = 'left';
            ctx.fillText(count.toString(), 650, y + 27);
        });
    } else {
        ctx.fillStyle = '#888';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No combos achieved yet!', canvas.width / 2, 250);
    }
    
    // Website info
    ctx.fillStyle = '#FF383F';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('mentalstrainrecords.com', canvas.width / 2, canvas.height - 30);
    
    // Convert to blob and download
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `msr-combo-stats-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        console.log('Stats image exported!');
    });
}

function showComboStats() {
    const modal = document.createElement('div');
    modal.id = 'combo-stats-modal';
    modal.className = 'modal-overlay';
    
    const maxCount = Math.max(...Object.values(comboStats), 1);
    const sortedCombos = Object.keys(comboStats).map(Number).sort((a, b) => a - b);
    
    const statsHTML = sortedCombos.length > 0 
        ? sortedCombos.map(combo => {
            const count = comboStats[combo];
            const percentage = (count / maxCount) * 100;
            return `
                <div class="stat-row">
                    <div class="stat-label">×${combo}</div>
                    <div class="stat-bar-container">
                        <div class="stat-bar" style="width: ${percentage}%"></div>
                    </div>
                    <div class="stat-count">${count}</div>
                </div>
            `;
        }).join('')
        : '<p style="text-align: center; color: #888;">No combos achieved yet!</p>';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="close-stats-modal">&times;</button>
            <h2>Combo Statistics</h2>
            <div class="stats-container">
                ${statsHTML}
            </div>
            <div class="stats-summary">
                <p><strong>Total Combos:</strong> ${Object.values(comboStats).reduce((a, b) => a + b, 0)}</p>
                <p><strong>Highest:</strong> ×${highestCombo}</p>
            </div>
            <div class="modal-buttons">
                <button class="share-stats-btn" id="share-stats-btn">Share Stats</button>
                <button class="reset-stats-btn" id="reset-stats-btn">Reset Statistics</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = document.getElementById('close-stats-modal');
    const resetBtn = document.getElementById('reset-stats-btn');
    const shareBtn = document.getElementById('share-stats-btn');
    const closeModal = () => modal.remove();
    
    closeBtn.addEventListener('click', closeModal);
    shareBtn.addEventListener('click', () => exportStatsImage());
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all combo statistics? This cannot be undone.')) {
            // Reset all stats
            comboStats = {};
            highestCombo = 0;
            localStorage.removeItem('msr-combo-stats');
            localStorage.removeItem('msr-highest-combo');
            
            // Close modal and update display
            closeModal();
            updateComboDisplay();
            
            // Show confirmation
            console.log('Combo statistics have been reset.');
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

albumList.addEventListener("mouseover", (e) => {
    if (window.innerWidth <= 768) return;

    const album = e.target.closest(".album");
    if (!album || (e.relatedTarget && album.contains(e.relatedTarget))) return;

    if (album._colorTimeout) {
        clearTimeout(album._colorTimeout);
        album._colorTimeout = null;
    }

    const albumInfo = album.querySelector(".album-info");
    if (!albumInfo) return;

    const lastColor = albumInfo.dataset.lastColor;
    const colors = ["color-red", "color-green", "color-blue"];

    let randomClass;
    
    if (comboGameEnabled) {
        // When game is active: true 1/3 odds, can repeat colors
        randomClass = colors[Math.floor(Math.random() * colors.length)];
    } else {
        // When game is not active: prevent same color twice in a row
        do {
            randomClass = colors[Math.floor(Math.random() * colors.length)];
        } while (randomClass === lastColor);
    }

    albumInfo.dataset.lastColor = randomClass;

    albumInfo.querySelectorAll("h3, p").forEach((el) => {
        el.classList.remove("color-red", "color-green", "color-blue");
        el.classList.add(randomClass);
    });

    album.classList.remove("color-red", "color-green", "color-blue");
    album.classList.add(randomClass);

    // Only run combo game logic if game is enabled
    if (!comboGameEnabled) return;

    // Add game-active class when game is enabled
    album.classList.add("game-active");

    // Combo game logic
    if (lastComboColor === randomClass || devMode) {
        comboCount++;
        if (comboCount >= 3) {
            showComboPopup(comboCount, randomClass);
        }
    } else {
        // Track the final combo that was achieved before breaking
        if (comboCount >= 2) {
            comboStats[comboCount] = (comboStats[comboCount] || 0) + 1;
            saveGameData();
        }
        comboCount = 1;
        lastComboColor = randomClass;
    }
    updateComboDisplay();
});

albumList.addEventListener("mouseout", (e) => {
    const album = e.target.closest(".album");
    if (!album || (e.relatedTarget && album.contains(e.relatedTarget))) return;

    // Only remove border if game is not active
    if (!comboGameEnabled) {
        album.classList.remove("color-red", "color-green", "color-blue");
    }

    album._colorTimeout = setTimeout(() => {
        const albumInfo = album.querySelector(".album-info");
        if (albumInfo) {
            albumInfo.querySelectorAll("h3, p").forEach((el) => {
                el.classList.remove("color-red", "color-green", "color-blue");
            });
        }
        album._colorTimeout = null;
    }, 200);
});

document.addEventListener("mousemove", (e) => {
    if (!albumDetails.classList.contains("expanded-view")) return;
    if (window.innerWidth <= 768) return;

    const img = document.getElementById("album-cover-image");
    if (!img) return;

    clearTimeout(idleTimer);

    if (swayFrame) {
        cancelAnimationFrame(swayFrame);
        swayFrame = null;

        img.style.transition = "transform 0.5s ease-out";
        setTimeout(() => {
            img.style.transition = "";
        }, 500);
    }

    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;

    let rotateX = -1 * (y / 25);
    let rotateY = x / 25;

    const limit = 20;
    rotateX = Math.max(-limit, Math.min(limit, rotateX));
    rotateY = Math.max(-limit, Math.min(limit, rotateY));

    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    idleTimer = setTimeout(() => {
        startSwayAnimation(img, rotateX, rotateY);
    }, 3000);
});

function startSwayAnimation(img, startRotateX, startRotateY) {
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        const swayX = Math.cos(progress * 0.0011) * 5;
        const swayY = Math.sin(progress * 0.0014) * 5;

        let t = Math.min(1, progress / 1000);
        t = t * t * (3 - 2 * t);

        const currentX = startRotateX * (1 - t) + swayX * t;
        const currentY = startRotateY * (1 - t) + swayY * t;

        img.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

        swayFrame = requestAnimationFrame(step);
    }

    swayFrame = requestAnimationFrame(step);
}

function updateTimelineStyle(slider, value, max) {
    const percentage = (value / max) * 100;
    slider.style.background = `linear-gradient(to right, #694EFF ${percentage}%, #555 ${percentage}%)`;
}

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Combo game enable via logo long-press
const logo = document.getElementById('logo');
let holdTimer = null;
let holdStartTime = 0;
let shakeInterval = null;

if (logo) {
    const startHold = (e) => {
        if (comboGameEnabled) return;
        e.preventDefault();
        
        holdStartTime = Date.now();
        logo.style.cursor = 'pointer';
        
        // Gradually increase shake
        shakeInterval = setInterval(() => {
            const elapsed = Date.now() - holdStartTime;
            const progress = Math.min(elapsed / 3000, 1);
            const shakeIntensity = progress * 10;
            logo.style.setProperty('--shake-intensity', `${shakeIntensity}px`);
            logo.classList.add('shaking');
        }, 50);
        
        // Enable game after 3 seconds
        holdTimer = setTimeout(() => {
            enableComboGame();
            stopHold();
        }, 3000);
    };
    
    const stopHold = () => {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        if (shakeInterval) {
            clearInterval(shakeInterval);
            shakeInterval = null;
        }
        logo.classList.remove('shaking');
        logo.style.removeProperty('--shake-intensity');
    };
    
    logo.addEventListener('mousedown', startHold);
    logo.addEventListener('mouseup', stopHold);
    logo.addEventListener('mouseleave', stopHold);
    logo.addEventListener('touchstart', startHold);
    logo.addEventListener('touchend', stopHold);
    logo.addEventListener('touchcancel', stopHold);
}

// High score stats click handler
const highScoreDisplay = document.getElementById('high-score-display');
if (highScoreDisplay) {
    highScoreDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        if (comboGameEnabled) {
            showComboStats();
        }
    });
    highScoreDisplay.style.cursor = 'pointer';
}
