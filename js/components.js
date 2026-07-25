// js/components.js

/**
 * Função auxiliar para carregar um único componente via fetch
 * @param {string} elementId - ID do elemento onde inserir o HTML
 * @param {string} url - Caminho para o arquivo HTML
 */
async function loadComponent(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id "${elementId}" not found. Skipping ${url}`);
        return;
    }
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const html = await res.text();
        element.innerHTML = html;
        console.log(`✅ Componente carregado: ${elementId}`);
    } catch (err) {
        console.error(`❌ Erro ao carregar ${url}:`, err);
        element.innerHTML = `<p style="color:#cc3121;text-align:center;">⚠️ Não foi possível carregar este conteúdo.</p>`;
    }
}

/**
 * Carrega todos os componentes HTML da pasta components/
 */
export async function loadAllComponents() {
    // Lista de componentes a serem carregados
    const components = [
        { id: 'component-header', path: 'components/header.html' },
        { id: 'component-about', path: 'components/about.html' },
        { id: 'component-team', path: 'components/team.html' },
        { id: 'component-announcements', path: 'components/announcements.html' },
        { id: 'component-publications', path: 'components/publications.html' },
        { id: 'component-partners', path: 'components/partners.html' },
        { id: 'component-alumni', path: 'components/alumni.html' },
        { id: 'component-contact', path: 'components/contact.html' },
        { id: 'component-footer', path: 'components/footer.html' }
        // O hero foi removido — não inclua component-hero
    ];

    // Carrega todos em paralelo
    await Promise.all(components.map(c => loadComponent(c.id, c.path)));
}
