// js/partners.js
export async function renderParceirosWithData(partners) {
    const container = document.getElementById('parceiros-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading partners...</div>';
    if (!partners || partners.length === 0) {
        container.innerHTML = '<p>No partners registered.</p>';
        return;
    }
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'parceiro-grid';
    partners.forEach(p => {
        const logoHtml = p.logo ? `<img src="${p.logo}" alt="${p.name}" class="parceiro-logo">` : '';
        const card = document.createElement('div');
        card.className = 'parceiro-card';
        card.innerHTML = `
            ${logoHtml}
            <span class="nome">${p.name}</span>
            <div class="tipo">${p.type}</div>
            <div class="descricao">${p.description || ''}</div>
            ${p.link ? `<a href="${p.link}" target="_blank" class="pub-link" style="display:inline-block; margin-top:0.5rem;">Visit website <i class="fas fa-external-link-alt"></i></a>` : ''}
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
}