// js/partners.js
export function renderParceirosWithData(partners) {
    const container = document.getElementById('parceiros-container');
    if (!container) {
        console.warn('Container #parceiros-container não encontrado.');
        return;
    }

    container.innerHTML = '';

    if (!partners || partners.length === 0) {
        container.innerHTML = '<p>No partners registered.</p>';
        return;
    }

    // === TÍTULO DA SEÇÃO ===
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'Collaborators & Partners';
    container.appendChild(sectionTitle);

    const grid = document.createElement('div');
    grid.className = 'parceiros-grid';

    partners.forEach(p => {
        const card = document.createElement('div');
        card.className = 'parceiro-card';
        card.innerHTML = `
            ${p.logo ? `<img src="${p.logo}" alt="${p.name}" class="parceiro-logo" />` : ''}
            <span class="nome">${p.name}</span>
            ${p.description ? `<p class="descricao">${p.description}</p>` : ''}
            ${p.link ? `<a href="${p.link}" target="_blank" class="parceiro-link">Visit website</a>` : ''}
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}
