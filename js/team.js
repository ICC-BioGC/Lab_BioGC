// js/team.js
import { renderSocialLinks } from './utils.js';

let principalInvestigatorsMap = {};
let allMembersForLinks = [];

export async function renderEquipeWithData(investigators, members) {
    const container = document.getElementById('equipe-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading team...</div>';
    if (!investigators || !members) {
        container.innerHTML = '<p>Error loading team data.</p>';
        return;
    }
    investigators.forEach(pi => { principalInvestigatorsMap[pi.id] = pi; });
    allMembersForLinks = members;
    container.innerHTML = '';

    for (const pi of investigators) {
        let membersOfGroup = members.filter(m => m.supervisor_id === pi.id);
        membersOfGroup.sort((a, b) => {
            const rankA = a.rank !== undefined ? a.rank : 5;
            const rankB = b.rank !== undefined ? b.rank : 5;
            if (rankA === rankB) return a.name.localeCompare(b.name);
            return rankA - rankB;
        });

        const socialPi = renderSocialLinks(pi);
        const photoHtml = pi.picture ? `<img src="${pi.picture}" alt="${pi.name}" class="membro-foto">` : '';

        const extraHtml = `
            <div class="extra-details" id="extra-${pi.id}">
                ${pi.bio ? `<div class="pesq-apresentacao">${pi.bio}</div>` : ''}
                ${pi.projects && pi.projects.length ? `
                    <div class="projetos-list">
                        <strong>Featured projects:</strong>
                        ${pi.projects.map(p => `
                            <div class="projeto-item">
                                <span class="projeto-titulo">${p.title}</span><br>
                                <span style="font-size:0.75rem;">${p.description.substring(0,150)}${p.description.length > 150 ? '…' : ''}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        const groupDiv = document.createElement('div');
        groupDiv.className = 'grupo-pesquisador';
        groupDiv.innerHTML = `
            <div class="pesquisador-header">
                <div>
                    ${photoHtml}
                    <h3><i class="fas fa-chalkboard-user"></i> ${pi.name}</h3>
                    <div class="pesq-info">
                        <span class="pesq-titulo">${pi.title}</span>
                        <span class="pesq-email"><i class="fas fa-envelope"></i> ${pi.email}</span>
                    </div>
                    ${socialPi}
                    <button class="toggle-details" data-target="extra-${pi.id}">
                        <i class="fas fa-plus-circle"></i> <span class="toggle-text">Show more</span>
                    </button>
                </div>
                ${extraHtml}
            </div>
            <div class="membros-grid" id="grid-${pi.id}"></div>
        `;

        const btn = groupDiv.querySelector('.toggle-details');
        const extraDiv = groupDiv.querySelector(`#extra-${pi.id}`);
        btn.addEventListener('click', () => {
            const isVisible = extraDiv.classList.toggle('show');
            btn.querySelector('.toggle-text').innerText = isVisible ? 'Show less' : 'Show more';
            btn.querySelector('i').className = isVisible ? 'fas fa-minus-circle' : 'fas fa-plus-circle';
        });

        const grid = groupDiv.querySelector(`#grid-${pi.id}`);
        if (membersOfGroup.length === 0) {
            grid.innerHTML = '<p class="instrucao">No students directly linked.</p>';
        } else {
            membersOfGroup.forEach(m => {
                const socialMember = renderSocialLinks(m);
                const coSupervisorHtml = m.co_supervisor ? `<div class="coorientador"><i class="fas fa-user-friends"></i> Co-supervisor: ${m.co_supervisor}</div>` : '';
                const photoMemberHtml = m.picture ? `<img src="${m.picture}" alt="${m.name}" class="membro-foto">` : '';
                const card = document.createElement('div');
                card.className = 'membro-card';
                card.innerHTML = `
                    ${photoMemberHtml}
                    <span class="nome">${m.name}</span>
                    <div class="cargo">${m.position}</div>
                    <div class="vinculo"><i class="fas fa-envelope"></i> ${m.email}</div>
                    ${coSupervisorHtml}
                    ${socialMember}
                `;
                grid.appendChild(card);
            });
        }
        container.appendChild(groupDiv);
    }

    const unassigned = members.filter(m => !m.supervisor_id);
    if (unassigned.length) {
        unassigned.sort((a, b) => {
            const rankA = a.rank !== undefined ? a.rank : 5;
            const rankB = b.rank !== undefined ? b.rank : 5;
            if (rankA === rankB) return a.name.localeCompare(b.name);
            return rankA - rankB;
        });
        const title = document.createElement('h3');
        title.innerText = 'Postdocs and other collaborators';
        title.style.margin = '2rem 0 1rem';
        title.style.color = '#003f44';
        container.appendChild(title);
        const gridOutros = document.createElement('div');
        gridOutros.className = 'membros-grid';
        unassigned.forEach(m => {
            const socialMember = renderSocialLinks(m);
            const photoMemberHtml = m.picture ? `<img src="${m.picture}" alt="${m.name}" class="membro-foto">` : '';
            const card = document.createElement('div');
            card.className = 'membro-card';
            card.innerHTML = `
                ${photoMemberHtml}
                <span class="nome">${m.name}</span>
                <div class="cargo">${m.position}</div>
                <div class="vinculo"><i class="fas fa-envelope"></i> ${m.email}</div>
                ${socialMember}
            `;
            gridOutros.appendChild(card);
        });
        container.appendChild(gridOutros);
    }
}

// Exporta os maps para uso em outros módulos (ex: publications)
export function getPrincipalInvestigatorsMap() { return principalInvestigatorsMap; }
export function getAllMembersForLinks() { return allMembersForLinks; }