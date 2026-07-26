// js/announcements.js
export function renderAnnouncementsWithData(announcements) {
    const container = document.getElementById('announcements-container');
    if (!container) {
        console.warn('Container #announcements-container não encontrado.');
        return;
    }

    container.innerHTML = '';

    if (!announcements || announcements.length === 0) {
        container.innerHTML = '<p>No announcements.</p>';
        return;
    }

    // === TÍTULO DA SEÇÃO ===
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'Announcements';
    container.appendChild(sectionTitle);

    const grid = document.createElement('div');
    grid.className = 'announcements-grid';

    announcements.forEach(item => {
        const card = document.createElement('div');
        card.className = 'announcement-card';
        card.innerHTML = `
            <div class="announcement-header">
                <span class="announcement-badge" style="background:${item.color || '#003f44'};">${item.type || 'Announcement'}</span>
            </div>
            <h3 class="announcement-title">${item.title}</h3>
            <p class="announcement-description">${item.description || ''}</p>
            ${item.link ? `<div class="announcement-footer"><a href="${item.link}" target="_blank" class="announcement-link">Learn more <i class="fas fa-arrow-right"></i></a></div>` : ''}
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}
