// ==================== CARREGAMENTO DE COMPONENTES ====================
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

async function loadAllComponents() {
    await Promise.all([
        loadComponent('component-header', 'components/header.html'),
        loadComponent('component-hero', 'components/hero.html'),
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

// ==================== TRADUÇÕES ====================
let currentLang = 'en';
let translations = {};

async function loadTranslations() {
    const res = await fetch('data/translations.json');
    translations = await res.json();
    applyTranslations();
}

function applyTranslations() {
    const t = translations[currentLang];
    if (!t) return;
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
    if (document.getElementById('header-title')) document.getElementById('header-title').innerText = t.header_title;
    if (document.getElementById('header-subtitle')) document.getElementById('header-subtitle').innerText = t.header_subtitle;
    if (document.getElementById('nav-about')) document.getElementById('nav-about').innerText = t.nav_home;
    if (document.getElementById('nav-research')) document.getElementById('nav-research').innerText = t.nav_research;
    if (document.getElementById('nav-team')) document.getElementById('nav-team').innerText = t.nav_team;
    if (document.getElementById('nav-alumni')) document.getElementById('nav-alumni').innerText = t.nav_alumni;
    if (document.getElementById('nav-partners')) document.getElementById('nav-partners').innerText = t.nav_partners;
    if (document.getElementById('nav-publications')) document.getElementById('nav-publications').innerText = t.nav_publications;
    if (document.getElementById('nav-contact')) document.getElementById('nav-contact').innerText = t.nav_contact;
    if (document.getElementById('hero-title')) document.getElementById('hero-title').innerText = t.hero_title;
    if (document.getElementById('hero-text')) document.getElementById('hero-text').innerText = t.hero_text;
    if (document.getElementById('hero-button')) document.getElementById('hero-button').innerText = t.hero_button;
    if (document.getElementById('section-about-title')) document.getElementById('section-about-title').innerText = t.section_about_title;
    if (document.getElementById('about-text1')) document.getElementById('about-text1').innerText = t.section_about_text;
    if (document.getElementById('about-mission')) {
        const parts = t.section_about_mission.split(':');
        document.getElementById('about-mission').innerText = parts[0] + ':';
        if (document.getElementById('about-mission-text')) document.getElementById('about-mission-text').innerText = parts[1] || t.section_about_mission;
    }
    if (document.getElementById('research-title')) {
        document.getElementById('research-title').innerText = t.section_research_title;
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// ==================== CONTEÚDO DINÂMICO ====================
let principalInvestigatorsMap = {};
let allMembersForLinks = [];

async function loadJSON(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch(e) {
        console.warn(`Error loading ${url}:`, e);
        return null;
    }
}

function renderSocialLinks(links) {
    let html = '<div class="social-links">';
    if (links.lattes) html += `<a href="${links.lattes}" target="_blank" title="Lattes"><i class="fab fa-lattes"></i></a>`;
    if (links.orcid) html += `<a href="${links.orcid}" target="_blank" title="ORCID"><i class="fab fa-orcid"></i></a>`;
    if (links.researchgate) html += `<a href="${links.researchgate}" target="_blank" title="ResearchGate"><i class="fab fa-researchgate"></i></a>`;
    if (links.google_scholar) html += `<a href="${links.google_scholar}" target="_blank" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>`;
    if (links.linkedin) html += `<a href="${links.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
    if (links.instagram) html += `<a href="${links.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>`;
    if (links.github) html += `<a href="${links.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>`;
    html += '</div>';
    return html;
}

// ===== TEAM (agrupado por orientador, ordenado por rank) =====
async function renderEquipeWithData(investigators, members) {
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
            if (rankA === rankB) {
                return a.name.localeCompare(b.name);
            }
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

// ===== ALUMNI (agrupado por orientador, colapsado por padrão) =====
async function renderEgressosWithData(alumni, investigators) {
    const container = document.getElementById('egressos-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading alumni...</div>';
    if (!alumni || alumni.length === 0) {
        container.innerHTML = '<p>No alumni registered.</p>';
        return;
    }

    // Agrupar por orientador
    const alumniBySupervisor = {};
    alumni.forEach(eg => {
        const supId = eg.supervisor_id || 'unassigned';
        if (!alumniBySupervisor[supId]) alumniBySupervisor[supId] = [];
        alumniBySupervisor[supId].push(eg);
    });

    container.innerHTML = '';
    // Ordenar os orientadores pela ordem dos investigators (ou alfabeticamente)
    const supervisorIds = Object.keys(alumniBySupervisor);
    // Tentar manter a ordem dos investigators
    const orderedIds = [];
    investigators.forEach(pi => {
        if (alumniBySupervisor[pi.id]) {
            orderedIds.push(pi.id);
            delete alumniBySupervisor[pi.id];
        }
    });
    // Os que sobraram (unassigned) vão no final
    if (alumniBySupervisor['unassigned']) {
        orderedIds.push('unassigned');
    }

    for (const supId of orderedIds) {
        const list = alumniBySupervisor[supId] || [];
        if (list.length === 0) continue;
        // Encontrar nome do orientador (se existir)
        let supervisorName = 'Other supervisors';
        if (supId !== 'unassigned') {
            const pi = investigators.find(p => p.id === supId);
            if (pi) supervisorName = pi.name;
        }
        // Criar um grupo para este orientador
        const groupDiv = document.createElement('div');
        groupDiv.className = 'grupo-pesquisador'; // reutiliza o estilo
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

    // Configurar botão de toggle para alumni
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

// ===== ANNOUNCEMENTS =====
async function renderAnnouncementsWithData(announcements) {
    const container = document.getElementById('announcements-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading announcements...</div>';
    if (!announcements || announcements.length === 0) {
        container.innerHTML = '<p>No announcements at the moment.</p>';
        return;
    }
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'announcements-grid';
    const categoryMap = {
        'job': { label: 'Job', icon: 'fas fa-briefcase', color: '#00747a' },
        'defense': { label: 'Defense', icon: 'fas fa-graduation-cap', color: '#cc3121' },
        'event': { label: 'Event', icon: 'fas fa-calendar-alt', color: '#ff9c08' },
        'award': { label: 'Award', icon: 'fas fa-trophy', color: '#f1c40f' },
        'other': { label: 'Announcement', icon: 'fas fa-bullhorn', color: '#5a6e7c' }
    };
    announcements.forEach(item => {
        const cat = categoryMap[item.category] || categoryMap['other'];
        const badgeHtml = `<span class="announcement-badge" style="background:${cat.color};"><i class="${cat.icon}"></i> ${cat.label}</span>`;
        const linkHtml = item.link ? `<a href="${item.link}" target="_blank" class="announcement-link">More info <i class="fas fa-arrow-right"></i></a>` : '';
        const card = document.createElement('div');
        card.className = 'announcement-card';
        card.innerHTML = `
            <div class="announcement-header">${badgeHtml}</div>
            <h3 class="announcement-title">${item.title}</h3>
            <p class="announcement-description">${item.description}</p>
            <div class="announcement-footer">${linkHtml}</div>
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

// ===== PUBLICATIONS =====
async function renderPublicacoesWithData(pubs) {
    const container = document.getElementById('publicacoes-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading publications...</div>';
    if (!pubs || pubs.length === 0) {
        container.innerHTML = '<p>No publications registered.</p>';
        return;
    }
    pubs.sort((a,b) => b.year - a.year);
    container.innerHTML = '';
    const lista = document.createElement('div');
    lista.className = 'publicacoes-lista';
    for (const pub of pubs) {
        let linkUrl = pub.link || (pub.doi ? `https://doi.org/${pub.doi}` : '');
        let pdfLink = pub.pdf ? `<a href="${pub.pdf}" target="_blank" class="pub-link pdf-link"><i class="fas fa-file-pdf"></i> Download PDF</a>` : '';
        let onlineLink = linkUrl ? `<a href="${linkUrl}" target="_blank" class="pub-link"><i class="fas fa-external-link-alt"></i> Access online</a>` : '';
        let authorsHtml = '';
        if (pub.author_details && pub.author_details.length) {
            const authorLinks = [];
            for (const author of pub.author_details) {
                let authorName = author.name;
                let id = author.id;
                if (id && principalInvestigatorsMap[id]) {
                    authorLinks.push(`<a href="#team">${authorName}</a>`);
                } else {
                    let found = false;
                    for (let m of allMembersForLinks) {
                        if (m.name === authorName) {
                            authorLinks.push(`<a href="#team">${authorName}</a>`);
                            found = true;
                            break;
                        }
                    }
                    if (!found) authorLinks.push(authorName);
                }
            }
            authorsHtml = authorLinks.join('; ');
        } else {
            authorsHtml = pub.authors || '';
        }
        const pubDiv = document.createElement('div');
        pubDiv.className = 'publicacao';
        pubDiv.innerHTML = `
            <div class="pub-year">${pub.year}</div>
            <div class="pub-detalhe">
                <h4>${pub.title}</h4>
                <p class="pub-autores">${authorsHtml}</p>
                <p class="pub-periodico"><em>${pub.journal}</em> ${pub.volume ? `, ${pub.volume}` : ''} ${pub.pages ? `, ${pub.pages}` : ''}</p>
                ${pub.abstract ? `<p class="pub-resumo">${pub.abstract}</p>` : ''}
                <div class="pub-actions">${onlineLink}${pdfLink}</div>
            </div>
        `;
        lista.appendChild(pubDiv);
    }
    container.appendChild(lista);
}

// ===== PARTNERS =====
async function renderParceirosWithData(partners) {
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

// ===== GALLERY (opcional, mantida) =====
async function renderGaleriaWithData(gallery) {
    const container = document.getElementById('galeria-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading gallery...</div>';
    if (!gallery || gallery.length === 0) {
        container.innerHTML = '<p>No images in gallery.</p>';
        return;
    }
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'galeria-grid';
    gallery.forEach(img => {
        const item = document.createElement('div');
        item.className = 'galeria-item';
        item.innerHTML = `<img src="${img.url}" alt="${img.title || 'Gallery image'}">`;
        grid.appendChild(item);
    });
    container.appendChild(grid);
}

// ==================== INICIALIZAÇÃO OTIMIZADA ====================
let cachedData = {};

async function loadAllData() {
    const [investigators, members, alumni, partners, gallery, announcements, publications] = await Promise.all([
        loadJSON('data/principal-investigators.json'),
        loadJSON('data/members.json'),
        loadJSON('data/alumni.json'),
        loadJSON('data/partners.json'),
        loadJSON('data/gallery.json'),
        loadJSON('data/announcements.json'),
        loadJSON('data/publications.json')
    ]);
    cachedData = { investigators, members, alumni, partners, gallery, announcements, publications };
}

async function renderAllDynamicContent() {
    await Promise.all([
        renderEquipeWithData(cachedData.investigators, cachedData.members),
        renderAnnouncementsWithData(cachedData.announcements),
        renderPublicacoesWithData(cachedData.publications),
        renderParceirosWithData(cachedData.partners),
        renderEgressosWithData(cachedData.alumni, cachedData.investigators),
        // gallery é opcional, se quiser incluir, descomente a linha abaixo:
        // renderGaleriaWithData(cachedData.gallery)
    ]);
}

async function init() {
    await Promise.all([
        loadAllComponents(),
        loadAllData()
    ]);
    await loadTranslations();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) setLanguage(savedLang);
    await renderAllDynamicContent();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
