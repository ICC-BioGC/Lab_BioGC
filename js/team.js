// js/team.js
export function renderEquipeWithData(investigators, members) {
    const container = document.getElementById('equipe-container');
    if (!container) {
        console.warn('Container #equipe-container não encontrado.');
        return;
    }

    // Remove a classe .loading
    container.classList.remove('loading');
    container.innerHTML = '';

    if (!investigators || investigators.length === 0) {
        container.innerHTML = '<p>Nenhum pesquisador encontrado.</p>';
        return;
    }

    // === TÍTULO DA SEÇÃO ===
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'Team';
    container.appendChild(sectionTitle);

    investigators.forEach(pi => {
        const grupoDiv = document.createElement('div');
        grupoDiv.className = 'grupo-pesquisador';

        const header = document.createElement('div');
        header.className = 'pesquisador-header';
        // Usando <h3> em vez de Markdown
        header.innerHTML = `<h3>${pi.name}</h3>`;
        grupoDiv.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'membros-grid';
        grid.id = `grid-${pi.id}`;

        const membros = members ? members.filter(m => m.supervisor_id === pi.id) : [];
        if (membros.length === 0) {
            grid.innerHTML = '<p style="color:#888;font-style:normal;">Nenhum membro vinculado.</p>';
        } else {
            membros.forEach(membro => {
                const card = document.createElement('div');
                card.className = 'membro-card';
                card.innerHTML = `
                    <span class="nome">${membro.name || 'Nome não informado'}</span>
                    <span class="cargo">${membro.position || ''}</span>
                    ${membro.co_supervisor ? `<span class="coorientador">Co-supervisor: ${membro.co_supervisor}</span>` : ''}
                    <div class="social-links">
                        ${membro.email ? `<a href="mailto:${membro.email}" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${membro.lattes ? `<a href="${membro.lattes}" target="_blank" title="Lattes"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${membro.orcid ? `<a href="${membro.orcid}" target="_blank" title="ORCID"><i class="fab fa-orcid"></i></a>` : ''}
                        ${membro.github ? `<a href="${membro.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        grupoDiv.appendChild(grid);
        container.appendChild(grupoDiv);
    });
}
