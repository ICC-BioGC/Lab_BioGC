// js/translations.js
let currentLang = 'en';
let translations = {};

export async function loadTranslations() {
    const res = await fetch('data/translations.json');
    translations = await res.json();
    applyTranslations();
}

export function applyTranslations() {
    const t = translations[currentLang];
    if (!t) return;
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
    const elements = {
        'header-title': 'header_title',
        'header-subtitle': 'header_subtitle',
        'nav-about': 'nav_home',
        'nav-research': 'nav_research',
        'nav-team': 'nav_team',
        'nav-alumni': 'nav_alumni',
        'nav-partners': 'nav_partners',
        'nav-publications': 'nav_publications',
        'nav-contact': 'nav_contact',
        'hero-title': 'hero_title',
        'hero-text': 'hero_text',
        'hero-button': 'hero_button',
        'section-about-title': 'section_about_title',
        'about-text1': 'section_about_text',
        'research-title': 'section_research_title'
    };
    for (const [id, key] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key];
    }
    if (document.getElementById('about-mission')) {
        const parts = t.section_about_mission.split(':');
        document.getElementById('about-mission').innerText = parts[0] + ':';
        if (document.getElementById('about-mission-text')) {
            document.getElementById('about-mission-text').innerText = parts[1] || t.section_about_mission;
        }
    }
}

export function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}