// js/components.js

/**
 * Carrega um único componente HTML via fetch
 */
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
        console.log(`✅ Component loaded: ${elementId}`);
    } catch (err) {
        console.error(`Error loading ${url}:`, err);
        element.innerHTML = `<p style="color:#cc3121;text-align:center;">⚠️ Could not load component.</p>`;
    }
}

/**
 * Carrega todos os componentes estáticos (header, about, footer, contact)
 * Os componentes dinâmicos (team, publications, etc.) são renderizados via JavaScript
 */
export async function loadAllComponents() {
    const components = [
        { id: 'component-header', path: 'components/header.html' },
        { id: 'component-about', path: 'components/about.html' },
        { id: 'component-contact', path: 'components/contact.html' },
        { id: 'component-footer', path: 'components/footer.html' }
        // Não incluir team, publications, etc. – eles são dinâmicos
    ];
    await Promise.all(components.map(c => loadComponent(c.id, c.path)));
}
