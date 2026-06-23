// js/utils.js
export function renderSocialLinks(links) {
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