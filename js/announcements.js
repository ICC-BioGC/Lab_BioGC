// js/announcements.js
export async function renderAnnouncementsWithData(announcements) {
    const container = document.getElementById('announcements-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading announcements...</div>';
    if (!announcements || announcements.length === 0) {
        container.innerHTML = '<p>No announcements at the moment.</p>';
        return;
    }
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'announcements-grid';
    const categoryMap = {
        'job': { label: 'Job', icon: 'fas fa-briefcase', color: '#00747a' },
        'defense': { label: 'Defense', icon: 'fas fa-graduation-cap', color: '#cc3121' },
        'event': { label: 'Event', icon: 'fas fa-calendar-alt', color: '#ff9c08' },
        'award': { label: 'Award', icon: 'fas fa-trophy', color: '#f1c40f' },
        'other': { label: 'Announcement', icon: 'fas fa-bullhorn', color: '#5a6e7c' }
    };
    announcements.forEach(item => {
        const cat = categoryMap[item.category] || categoryMap['other'];
        const badgeHtml = `<span class="announcement-badge" style="background:${cat.color};"><i class="${cat.icon}"></i> ${cat.label}</span>`;
        const linkHtml = item.link ? `<a href="${item.link}" target="_blank" class="announcement-link">More info <i class="fas fa-arrow-right"></i></a>` : '';
        const card = document.createElement('div');
        card.className = 'announcement-card';
        card.innerHTML = `
            <div class="announcement-header">${badgeHtml}</div>
            <h3 class="announcement-title">${item.title}</h3>
            <p class="announcement-description">${item.description}</p>
            <div class="announcement-footer">${linkHtml}</div>
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
}