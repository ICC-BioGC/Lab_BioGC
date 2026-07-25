// js/components.js
export async function loadAllComponents() {
    const components = [
        { id: 'component-header', path: 'components/header.html' },
        { id: 'component-about', path: 'components/about.html' },
        { id: 'component-footer', path: 'components/footer.html' }
        // Hero removido
    ];

    const loadComponent = async (id, path) => {
        const container = document.getElementById(id);
        if (!container) {
            console.warn(`Container #${id} não encontrado.`);
            return;
        }
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();
            container.innerHTML = html;
            console.log(`✅ ${id} carregado`);
        } catch (error) {
            console.error(`❌ Erro ao carregar ${id}:`, error);
            container.innerHTML = `<p style="color:red;">Erro ao carregar ${id}</p>`;
        }
    };

    await Promise.all(components.map(c => loadComponent(c.id, c.path)));
}// js/components.js
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
