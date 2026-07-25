// team.js – renderização correta
export function renderEquipeWithData(investigators, members) {
    const container = document.getElementById('equipe-container');
    if (!container) return;

    // Remove a classe .loading para evitar o itálico
    container.classList.remove('loading');

    // Limpa o container antes de renderizar
    container.innerHTML = '';

    // Renderiza cada pesquisador
    investigators.forEach(pi => {
        const grupoDiv = document.createElement('div');
        grupoDiv.className = 'grupo-pesquisador';

        // Cabeçalho do pesquisador
        const header = document.createElement('div');
        header.className = 'pesquisador-header';
        header.innerHTML = `<h3>${pi.name}</h3>`;
        grupoDiv.appendChild(header);

        // Grid de membros
        const grid = document.createElement('div');
        grid.className = 'membros-grid';
        grid.id = `grid-${pi.id}`;

        // Filtra membros deste orientador
        const membros = members.filter(m => m.supervisor_id === pi.id);
        membros.forEach(membro => {
            const card = document.createElement('div');
            card.className = 'membro-card';
            card.innerHTML = `
                <span class="nome">${membro.name}</span>
                <span class="cargo">${membro.position || ''}</span>
                ${membro.co_supervisor ? `<span class="coorientador">Co-supervisor: ${membro.co_supervisor}</span>` : ''}
                <div class="social-links">
                    ${membro.email ? `<a href="mailto:${membro.email}"><i class="fas fa-envelope"></i></a>` : ''}
                    ${membro.lattes ? `<a href="${membro.lattes}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });

        grupoDiv.appendChild(grid);
        container.appendChild(grupoDiv);
    });
}
