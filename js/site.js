// ==================== CARREGAMENTO DE COMPONENTES ====================
async function loadComponent(elementId, url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (err) {
        console.warn(`Error loading ${url}:`, err);
        document.getElementById(elementId).innerHTML = `<p style="color:red;">Failed to load component.</p>`;
    }
}

async function loadAllComponents() {
    await Promise.all([
        loadComponent('component-header', 'components/header.html'),
        loadComponent('component-hero', 'components/hero.html'),
        loadComponent('component-about', 'components/about.html'),
        loadComponent('component-research', 'components/research.html'),
        loadComponent('component-team', 'components/team.html'),
        loadComponent('component-alumni', 'components/alumni.html'),
        loadComponent('component-gallery', 'components/gallery.html'),
        loadComponent('component-opportunities', 'components/opportunities.html'),
        loadComponent('component-partners', 'components/partners.html'),
        loadComponent('component-publications', 'components/publications.html'),
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
    if (document.getElementById('research-title')) document.getElementById('research-title').innerText = t.section_research_title;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// ==================== CONTEÚDO DINÂMICO (JSON) ====================
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

// Team (Principal Investigators + Members)
async function renderEquipe() {
    const container = document.getElementById('equipe-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading team...</div>';
    const investigators = await loadJSON('data/principal-investigators.json');
    const members = await loadJSON('data/members.json');
    if (!investigators || !members) {
        container.innerHTML = '<p>Error loading team data.</p>';
        return;
    }
    investigators.forEach(pi => { principalInvestigatorsMap[pi.id] = pi; });
    allMembersForLinks = members;
    container.innerHTML = '';

    for (const pi of investigators) {
        const membersOfGroup = members.filter(m => m.supervisor_id === pi.id);
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

// Alumni
async function renderEgressos() {
    const container = document.getElementById('egressos-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading alumni...</div>';
    const alumni = await loadJSON('data/alumni.json');
    if (!alumni || alumni.length === 0) {
        container.innerHTML = '<p>No alumni registered.</p>';
        return;
    }
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'membros-grid';
    alumni.forEach(eg => {
        const card = document.createElement('div');
        card.className = 'egresso-card';
        card.innerHTML = `
            <div class="nome">${eg.name}</div>
            <div class="info">${eg.current_affiliation || ''} ${eg.degree_type ? `(${eg.degree_type})` : ''}</div>
            <div class="info">Year: ${eg.graduation_year}</div>
            ${eg.lattes ? `<div class="social-links"><a href="${eg.lattes}" target="_blank" title="Lattes"><i class="fab fa-lattes"></i></a></div>` : ''}
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

// Partners
async function renderParceiros() {
    const container = document.getElementById('parceiros-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading partners...</div>';
    const partners = await loadJSON('data/partners.json');
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

// Gallery
async function renderGaleria() {
    const container = document.getElementById('galeria-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading gallery...</div>';
    const gallery = await loadJSON('data/gallery.json');
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

// Opportunities
async function renderOportunidades() {
    const container = document.getElementById('oportunidades-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading opportunities...</div>';
    const opportunities = await loadJSON('data/opportunities.json');
    if (!opportunities || opportunities.length === 0) {
        container.innerHTML = '<p>No opportunities at the moment.</p>';
        return;
    }
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'oportunidades-grid';
    opportunities.forEach(op => {
        const card = document.createElement('div');
        card.className = 'oportunidade-card';
        card.innerHTML = `
            <div class="oportunidade-titulo">${op.title}</div>
            <div class="oportunidade-descricao">${op.description}</div>
            ${op.link ? `<a href="${op.link}" target="_blank" class="oportunidade-link">More info <i class="fas fa-external-link-alt"></i></a>` : ''}
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

// Publications
async function renderPublicacoes() {
    const container = document.getElementById('publicacoes-container');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading publications...</div>';
    const pubs = await loadJSON('data/publications.json');
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

// ==================== INICIALIZAÇÃO ====================
async function init() {
    await loadAllComponents();
    await loadTranslations();
    // Configurar os botões de idioma (eles estão em header.html)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) setLanguage(savedLang);
    // Carregar dados dinâmicos
    await renderEquipe();
    await renderEgressos();
    await renderParceiros();
    await renderGaleria();
    await renderOportunidades();
    await renderPublicacoes();
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
