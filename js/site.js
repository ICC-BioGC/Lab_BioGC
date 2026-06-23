// js/site.js
import { loadAllComponents } from './components.js';
import { loadTranslations, setLanguage } from './translations.js';
import { loadJSON } from './dataLoader.js';
import { renderEquipeWithData } from './team.js';
import { renderEgressosWithData } from './alumni.js';
import { renderAnnouncementsWithData } from './announcements.js';
import { renderPublicacoesWithData } from './publications.js';
import { renderParceirosWithData } from './partners.js';
import { renderGaleriaWithData } from './gallery.js';

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
        renderGaleriaWithData(cachedData.gallery)
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