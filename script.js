let defaultAnimes = [
    {
        id: 1,
        title: "Demon Slayer",
        img: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2JiNi00MGVmLTlhMGYtM2FiMmE4MDdhZmKcXkEyXkFqcGdeQXVyNjc3OTE4Nzg@._V1_.jpg",
        ep: "Ep 55 Hindi",
        telegram: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video player link
        type: "TV",
        category: "popular"
    },
    {
        id: 2,
        title: "One Piece",
        img: "https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtY2VmMy00Mjk4LWJiM2UtM2IxOTA3ZmVlN2IxXkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg",
        ep: "Ep 1177",
        telegram: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "TV",
        category: "latest"
    }
];

let animeData = JSON.parse(localStorage.getItem('animeHubData')) || defaultAnimes;
let isAdminLoggedIn = false;

const adminLoginBtn = document.getElementById('adminLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminSection = document.getElementById('adminSection');
const animeForm = document.getElementById('animeForm');

adminLoginBtn.addEventListener('click', () => {
    if (!isAdminLoggedIn) {
        const password = prompt("Enter Admin Password:");
        if (password === "admin123") {
            isAdminLoggedIn = true;
            adminSection.classList.remove('hidden');
            renderAnime();
        } else {
            alert("Wrong Password!");
        }
    }
});

logoutBtn.addEventListener('click', () => {
    isAdminLoggedIn = false;
    adminSection.classList.add('hidden');
    renderAnime();
});

animeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newAnime = {
        id: Date.now(),
        title: document.getElementById('animeTitle').value,
        img: document.getElementById('animeImg').value,
        ep: document.getElementById('animeEp').value,
        telegram: document.getElementById('telegramLink').value,
        type: document.getElementById('animeType').value,
        category: document.getElementById('category').value
    };

    animeData.unshift(newAnime);
    localStorage.setItem('animeHubData', JSON.stringify(animeData));
    renderAnime();
    animeForm.reset();
});

function deleteAnime(id) {
    if (confirm("Delete this anime?")) {
        animeData = animeData.filter(anime => anime.id !== id);
        localStorage.setItem('animeHubData', JSON.stringify(animeData));
        renderAnime();
    }
}

function openPlayer(url, title) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const playerTitle = document.getElementById('playerTitle');

    playerTitle.textContent = title;
    player.src = url;
    modal.style.display = 'flex';
}

function closePlayer() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');

    player.src = '';
    modal.style.display = 'none';
}

function renderAnime() {
    const popularContainer = document.getElementById('popularContainer');
    const latestContainer = document.getElementById('latestContainer');

    popularContainer.innerHTML = '';
    latestContainer.innerHTML = '';

    animeData.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';

        let deleteBtnHTML = isAdminLoggedIn 
            ? `<button class="btn-delete" onclick="event.stopPropagation(); deleteAnime(${anime.id})"><i class="fa-solid fa-trash"></i> Delete</button>` 
            : '';

        card.innerHTML = `
            <span class="badge-tv">${anime.type}</span>
            <img src="${anime.img}" alt="${anime.title}">
            <span class="badge-ep">${anime.ep}</span>
            <div class="anime-title">${anime.title}</div>
            ${deleteBtnHTML}
        `;

        card.addEventListener('click', () => {
            openPlayer(anime.telegram, anime.title);
        });

        if (anime.category === 'popular') {
            popularContainer.appendChild(card);
        } else {
            latestContainer.appendChild(card);
        }
    });
}

renderAnime();
