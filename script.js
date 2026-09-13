// Admin Password
const ADMIN_PASSWORD = "admin123";

// Sample Anime Data
const defaultData = [
    { 
        id: 1,
        title: "Demon Slayer", 
        img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg", 
        ep: "Ep 55 Hindi", 
        type: "TV", 
        category: "popular",
        telegram: "https://t.me/"
    },
    { 
        id: 2,
        title: "One Piece", 
        img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg", 
        ep: "Ep 1177", 
        type: "TV", 
        category: "latest",
        telegram: "https://t.me/"
    }
];

function getPosts() {
    return JSON.parse(localStorage.getItem('animePosts')) || defaultData;
}

let isAdmin = sessionStorage.getItem('isAdminLoggedIn') === 'true';

const adminBtn = document.getElementById('adminLoginBtn');
const adminSection = document.getElementById('adminSection');
const logoutBtn = document.getElementById('logoutBtn');

function updateAdminUI() {
    if(isAdmin) {
        adminSection?.classList.remove('hidden');
        if(adminBtn) adminBtn.style.display = 'none';
    } else {
        adminSection?.classList.add('hidden');
        if(adminBtn) adminBtn.style.display = 'inline-block';
    }
}

// Login Handler
adminBtn?.addEventListener('click', () => {
    const password = prompt("Admin Password Daalein:");
    if(password === ADMIN_PASSWORD) {
        alert("Welcome Boss! Admin Panel unlocked.");
        isAdmin = true;
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        updateAdminUI();
        loadAnime();
    } else if(password !== null) {
        alert("Galat Password!");
    }
});

// Logout Handler
logoutBtn?.addEventListener('click', () => {
    isAdmin = false;
    sessionStorage.removeItem('isAdminLoggedIn');
    updateAdminUI();
    loadAnime();
});

// Single Card Setup
function createCard(item) {
    const deleteBtn = isAdmin ? `<button onclick="deletePost(${item.id})" class="btn-delete"><i class="fa-solid fa-trash"></i> Delete</button>` : '';
    
    return `
        <div class="anime-card">
            <a href="${item.telegram || '#'}" target="_blank" class="card-link">
                <div class="thumbnail-box">
                    <img src="${item.img}" alt="${item.title}">
                    <span class="badge-type">${item.type}</span>
                    <span class="badge-ep">${item.ep}</span>
                </div>
            </a>
            <div class="anime-name">${item.title}</div>
            ${deleteBtn}
        </div>
    `;
}

// Display Anime
function loadAnime() {
    const popularContainer = document.getElementById('popularContainer');
    const latestContainer = document.getElementById('latestContainer');

    if(!popularContainer || !latestContainer) return;

    popularContainer.innerHTML = '';
    latestContainer.innerHTML = '';

    const posts = getPosts();

    posts.forEach(anime => {
        const cardHTML = createCard(anime);
        if(anime.category === 'popular') {
            popularContainer.innerHTML += cardHTML;
        } else {
            latestContainer.innerHTML += cardHTML;
        }
    });
}

// Post Publish Form
document.getElementById('animeForm')?.addEventListener('submit', function(e) {
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

    let posts = getPosts();
    posts.unshift(newAnime);
    localStorage.setItem('animePosts', JSON.stringify(posts));

    loadAnime();
    this.reset();
    alert('Nayi Anime Publish Ho Gayi!');
});

// Delete Function
window.deletePost = function(id) {
    if(confirm("Kya aap is anime ko delete karna chahte hain?")) {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== id);
        localStorage.setItem('animePosts', JSON.stringify(posts));
        loadAnime();
    }
};

updateAdminUI();
loadAnime();
