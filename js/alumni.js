// js/alumni.js
export async function renderEgressosWithData(alumni, investigators) {
    const container = document.getElementById('egressos-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading alumni...</div>';
    if (!alumni || alumni.length === 0) {
        container.innerHTML = '<p>No alumni registered.</p>';
        return;
    }

    const alumniBySupervisor = {};
    alumni.forEach(eg => {
        const supId = eg.supervisor_id || 'unassigned';
        if (!alumniBySupervisor[supId]) alumniBySupervisor[supId] = [];
        alumniBySupervisor[supId].push(eg);
    });

    container.innerHTML = '';
    const supervisorIds = Object.keys(alumniBySupervisor);
    const orderedIds = [];
    investigators.forEach(pi => {
        if (alumniBySupervisor[pi.id]) {
            orderedIds.push(pi.id);
            delete alumniBySupervisor[pi.id];
        }
    });
    if (alumniBySupervisor['unassigned']) {
        orderedIds.push('unassigned');
    }

    for (const supId of orderedIds) {
        const list = alumniBySupervisor[supId] || [];
        if (list.length === 0) continue;
        let supervisorName = 'Other supervisors';
        if (supId !== 'unassigned') {
            const pi = investigators.find(p => p.id === supId);
            if (pi) supervisorName = pi.name;
        }
        const groupDiv = document.createElement('div');
        groupDiv.className = 'grupo-pesquisador';
        groupDiv.style.marginBottom = '1rem';
        groupDiv.innerHTML = `
            <div class="pesquisador-header" style="margin-bottom:0.5rem; border-bottom:1px solid #e0e0e0;">
                <h3 style="font-size:1.2rem; color:#003f44;">${supervisorName}</h3>
            </div>
            <div class="membros-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
                ${list.map(eg => `
                    <div class="egresso-card" style="margin-bottom:0;">
                        <div class="nome">${eg.name}</div>
                        <div class="info">${eg.current_affiliation || ''} ${eg.degree_type ? `(${eg.degree_type})` : ''}</div>
                        <div class="info">Year: ${eg.graduation_year}</div>
                        ${eg.lattes ? `<div class="social-links"><a href="${eg.lattes}" target="_blank" title="Lattes"><i class="fab fa-lattes"></i></a></div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(groupDiv);
    }

    const alumniContent = document.getElementById('alumni-content');
    const toggleBtn = document.getElementById('toggle-alumni-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const isVisible = alumniContent.style.display !== 'none';
            alumniContent.style.display = isVisible ? 'none' : 'block';
            this.querySelector('.toggle-text').innerText = isVisible ? 'Show alumni' : 'Hide alumni';
            this.querySelector('i').className = isVisible ? 'fas fa-plus-circle' : 'fas fa-minus-circle';
        });
    }
}