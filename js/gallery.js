// js/gallery.js
export function renderGaleriaWithData(gallery) {
    const container = document.getElementById('galeria-container');
    if (!container) {
        console.warn('Container #galeria-container não encontrado.');
        return;
    }

    container.innerHTML = '';

    if (!gallery || gallery.length === 0) {
        container.innerHTML = '<p>No gallery images.</p>';
        return;
    }

    // === TÍTULO DA SEÇÃO ===
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'Gallery';
    container.appendChild(sectionTitle);

    const grid = document.createElement('div');
    grid.className = 'galeria-grid';

    gallery.forEach(item => {
        const div = document.createElement('div');
        div.className = 'galeria-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title || ''}" />
            ${item.title ? `<p class="galeria-legenda">${item.title}</p>` : ''}
        `;
        grid.appendChild(div);
    });

    container.appendChild(grid);
}
