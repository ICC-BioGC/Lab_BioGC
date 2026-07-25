// js/components.js
async function loadComponent(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id "${elementId}" not found. Skipping ${url}`);
        return;
    }
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        element.innerHTML = html;
    } catch (err) {
        console.warn(`Error loading ${url}:`, err);
        element.innerHTML = `<p style="color:red;">Failed to load component.</p>`;
    }
}

export async function loadAllComponents() {
    await Promise.all([
        loadComponent('component-header', 'components/header.html'),
        loadComponent('component-about', 'components/about.html'),
        loadComponent('component-team', 'components/team.html'),
        loadComponent('component-announcements', 'components/announcements.html'),
        loadComponent('component-publications', 'components/publications.html'),
        loadComponent('component-partners', 'components/partners.html'),
        loadComponent('component-alumni', 'components/alumni.html'),
        loadComponent('component-contact', 'components/contact.html'),
        loadComponent('component-footer', 'components/footer.html')
    ]);
}
