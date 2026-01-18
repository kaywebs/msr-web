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

let idleTimer;
let swayFrame;
let gridScrollPosition = 0;

const qs = (html) => html.trim();

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
    updateMetadata(
        "Mental Strain Records",
        "Mental Strain Records - The home of kwebspost. Listen to albums like Of All Time Vol.2, Wayne Street, and more!."
    );

    if (albumList.children.length === 0) {
        albumList.innerHTML = albums
            .map((a) =>
                qs(`
      <div class="album" data-slug="${a.slug}">
        <img src="${a.cover}" alt="${a.title}">
        <div class="album-info">
          <h3>${a.title}</h3>
          <p>${a.artist}</p>
        </div>
      </div>
    `)
            )
            .join("");
    }

    albumList.classList.remove("hidden");
    albumDetails.classList.add("hidden");
    aboutPage.classList.add("hidden");

    if (gridScrollPosition > 0) {
        window.scrollTo(0, gridScrollPosition);
    }
}

function renderAboutPage() {
    if (!albumList.classList.contains("hidden")) {
        gridScrollPosition = window.scrollY;
    }

    updateMetadata("About - Mental Strain Records", "Learn more about Mental Strain Records and our artists.");

    aboutPage.innerHTML = qs(`
        <h2>About Mental Strain Records</h2>
        <p>Mental Strain Records is an independent record label based in Penticton, B.C., dedicated to releasing local music and supporting local artists. Home of kwebspost. Please get into contact with us via email for any inquiries.</p>

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

                <img src="./assets/kwebspostimg.jpg" alt="kwebspost" class="artist-image">

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

    window.scrollTo(0, 0);
}

function renderAlbumDetails(slug) {
    const album = albums.find((a) => a.slug === slug);
    if (!album) return renderAlbumGrid();

    if (!albumList.classList.contains("hidden")) {
        gridScrollPosition = window.scrollY;
    }

    updateMetadata(
        `${album.title} - ${album.artist}`,
        album.description || `Listen to ${album.title} by ${album.artist} on Mental Strain Records.`
    );

    albumDetails.innerHTML = qs(`
    <div class="album-details-cover">
      <img src="${album.cover}" alt="${album.title}" id="album-cover-image" title="Click to expand">
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
              <img src="${logoUrls[name]}" alt="${name}">
            </a>`;
            })
            .join("")}
      </div>

      <h2>${album.title}</h2>
      <p><strong>${album.artist}</strong></p>
      <p><em>${album.label}  ${album.releaseNumber} (${album.releaseDate})</em></p>

      <h3>Tracklist</h3>
      <ul id="track-list">
        ${album.tracks
            .map(
                (t, i) =>
                    `<li><span class='track-number'>${i + 1}.</span> ${t.title} <span class='track-length'>${t.length}</span></li>`
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

    window.scrollTo(0, 0);

    document.getElementById("back-button").onclick = () => {
        location.hash = "";
    };

    const coverImg = document.getElementById("album-cover-image");
    const closeExpandedBtn = document.getElementById("close-expanded-btn");

    coverImg.onclick = () => {
        albumDetails.classList.add("expanded-view");
        closeExpandedBtn.classList.remove("hidden");
        startSwayAnimation(coverImg, 0, 0);
    };

    closeExpandedBtn.onclick = () => {
        albumDetails.classList.remove("expanded-view");
        closeExpandedBtn.classList.add("hidden");
        coverImg.style.transform = "";

        clearTimeout(idleTimer);
        if (swayFrame) cancelAnimationFrame(swayFrame);
        swayFrame = null;
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

window.addEventListener("hashchange", router);
document.addEventListener("DOMContentLoaded", router);

albumList.addEventListener("mouseover", (e) => {
    if (window.innerWidth <= 768) return;

    const album = e.target.closest(".album");
    if (!album || (e.relatedTarget && album.contains(e.relatedTarget))) return;

    const albumInfo = album.querySelector(".album-info");
    if (!albumInfo) return;

    const lastColor = albumInfo.dataset.lastColor;
    const colors = ["color-red", "color-green", "color-blue"];

    let randomClass;
    do {
        randomClass = colors[Math.floor(Math.random() * colors.length)];
    } while (randomClass === lastColor);

    albumInfo.dataset.lastColor = randomClass;

    albumInfo.querySelectorAll("h3, p").forEach((el) => {
        el.classList.remove("color-red", "color-green", "color-blue");
        el.classList.add(randomClass);
    });

    album.classList.remove("color-red", "color-green", "color-blue");
    album.classList.add(randomClass);
});

albumList.addEventListener("mouseout", (e) => {
    const album = e.target.closest(".album");
    if (!album || (e.relatedTarget && album.contains(e.relatedTarget))) return;

    album.classList.remove("color-red", "color-green", "color-blue");
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

