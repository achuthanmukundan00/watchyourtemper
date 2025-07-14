const app = document.getElementById('app');
const routes = {
    'index.html': 'pages/home.html',
    'feed.html': 'pages/feed.html',
    'linktree.html': 'pages/linktree.html',
    '': 'pages/home.html',
};

async function loadPage(path, push=true) {
    const page = routes[path] || routes[''];
    try {
        const res = await fetch(page);
        const html = await res.text();
        app.innerHTML = html;
        if (push) history.pushState({path}, '', path || 'index.html');
        initLinks();
    } catch (e) {
        console.error('Failed to load', page, e);
    }
}

function initLinks() {
    document.querySelectorAll('[data-link]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = a.getAttribute('href');
            loadPage(target);
        });
    });
}

window.addEventListener('popstate', e => {
    const path = e.state?.path || 'index.html';
    loadPage(path, false);
});

// Audio controls
const audio = document.getElementById('bg-audio');
const muteBtn = document.getElementById('mute-btn');

function startAudio() {
    audio.muted = false;
    audio.play().catch(err => console.log('Autoplay failed:', err));
    document.body.classList.add('image-active');
    document.removeEventListener('click', startAudio);
    document.removeEventListener('touchstart', startAudio);
    document.removeEventListener('keydown', startAudio);
}

muteBtn.addEventListener('click', e => {
    e.stopPropagation();
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
});

document.addEventListener('click', startAudio);
document.addEventListener('touchstart', startAudio);
document.addEventListener('keydown', startAudio);

const query = location.search.slice(1);
const initialPath = query ? `${query}.html` : location.pathname.split('/').pop();
loadPage(initialPath, false);

