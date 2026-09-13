// Sample Anime Data
const defaultData = [
    { 
        title: "One Piece", 
        img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg", 
        ep: "Ep 1177", 
        type: "TV", 
        category: "popular" 
    },
    { 
        title: "BLEACH", 
        img: "https://cdn.myanimelist.net/images/anime/1908/135431.jpg", 
        ep: "Ep 10", 
        type: "TV", 
        category: "popular" 
    },
    { 
        title: "The 100 Girlfriends", 
        img: "https://cdn.myanimelist.net/images/anime/1628/139230.jpg", 
        ep: "Ep 11", 
        type: "TV", 
        category: "latest" 
    },
    { 
        title: "Jujutsu Kaisen", 
        img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg", 
        ep: "Ep 24", 
        type: "TV", 
        category: "latest" 
    },
    { 
        title: "Solo Leveling", 
        img: "https://cdn.myanimelist.net/images/anime/1269/137307.jpg", 
        ep: "Ep 12", 
        type: "TV", 
        category: "latest" 
    }
];

// Toggle Form Display
document.getElementById('toggleFormBtn')?.addEventListener('click', () => {
    const form = document.getElementById('animeForm');
    form.classList.toggle('hidden');
});

// Single Card HTML Structure
function createCard(item) {
    return `
        <div class="anime-card">
            <div class="thumbnail-box">
                <img src="${item.img}" alt="${item.title}">
                <span class="badge-type">${item.type}</span>
                <span class="badge-ep">${item.ep}</span>
            </div>
            <div class="anime-name">${item.title}</div>
        </div>
    `;
}

// Render Posts
function loadAnime() {
    const popularContainer = document.getElementById('popularContainer');
    const latestContainer = document.getElementById('latestContainer');

    if(!popularContainer || !latestContainer) return;

    popularContainer.innerHTML = '';
    latestContainer.innerHTML = '';

    const posts = JSON.parse(localStorage.getItem('animePosts')) || defaultData;

    posts.forEach(anime => {
        const cardHTML = createCard(anime);
        if(anime.category === 'popular') {
            popularContainer.innerHTML += cardHTML;
        } else {
            latestContainer.innerHTML += cardHTML;
        }
    });
}

// Form Submission
document.getElementById('animeForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const newAnime = {
        title: document.getElementById('animeTitle').value,
        img: document.getElementById('animeImg').value,
        ep: document.getElementById('animeEp').value,
        type: document.getElementById('animeType').value,
        category: document.getElementById('category').value
    };

    let posts = JSON.parse(localStorage.getItem('animePosts')) || defaultData;
    posts.unshift(newAnime);
    localStorage.setItem('animePosts', JSON.stringify(posts));

    loadAnime();
    this.reset();
    alert('Anime Post Add Ho Gayi!');
});

// Load Data
loadAnime();
