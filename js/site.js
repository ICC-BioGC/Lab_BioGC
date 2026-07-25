// ===== IMPORTAÇÕES =====
import { loadAllComponents } from './components.js';
import { loadJSON } from './dataLoader.js';
import { renderEquipeWithData } from './team.js';
import { renderPublicacoesWithData } from './publications.js';
import { renderParceirosWithData } from './partners.js';
import { renderGaleriaWithData } from './gallery.js';
import { renderAnnouncementsWithData } from './announcements.js';
import { loadTranslations, setLanguage } from './translations.js';

// ===== VARIÁVEIS GLOBAIS =====
let cachedData = {};

// ===== FUNÇÃO PRINCIPAL =====
async function init() {
    try {
        console.log('🚀 Inicializando BioGC...');

        // 1. Carrega os componentes HTML
        await loadAllComponents();
        console.log('✅ Componentes carregados');

        // 2. Carrega os dados em paralelo
        const [investigators, members, alumni, partners, gallery, opportunities, publications] = await Promise.all([
            loadJSON('data/principal-investigators.json'),
            loadJSON('data/members.json'),
            loadJSON('data/alumni.json'),
            loadJSON('data/partners.json'),
            loadJSON('data/gallery.json'),
            loadJSON('data/opportunities.json'),
            loadJSON('data/publications.json')
        ]);

        cachedData = { investigators, members, alumni, partners, gallery, opportunities, publications };
        console.log('✅ Dados carregados', cachedData);

        // 3. Carrega as traduções (se existir)
        await loadTranslations();
        console.log('✅ Traduções carregadas');

        // 4. Remove a mensagem de loading
        const loading = document.getElementById('loading-message');
        if (loading) loading.remove();

        // 5. Renderiza as seções
        renderEquipeWithData(investigators, members);
        renderPublicacoesWithData(publications);
        renderParceirosWithData(partners);
        renderGaleriaWithData(gallery);
        renderAnnouncementsWithData(opportunities);
        
        // 6. Alumni (função local)
        renderEgressosWithData(alumni, investigators);

        // 7. Configura seletor de idioma
        setupLanguageSwitcher();

        console.log('🎉 BioGC inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showErrorMessage('Falha ao carregar o site. Verifique o console para mais detalhes.');
    }
}

// ===== FUNÇÃO PARA EXIBIR MENSAGEM DE ERRO =====
function showErrorMessage(message) {
    const loading = document.getElementById('loading-message');
    if (loading) {
        loading.innerHTML = `
            <div style="text-align:center;padding:4rem 2rem;color:#cc3121;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;margin-bottom:1rem;"></i>
                <h2>Ops! Algo deu errado.</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top:1rem;padding:0.75rem 2rem;background:#003f44;color:#fff;border:none;border-radius:4px;cursor:pointer;">
                    <i class="fas fa-sync"></i> Recarregar
                </button>
            </div>
        `;
    }
}

// ===== CONFIGURADOR DE IDIOMA =====
function setupLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    if (!switcher) return;

    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switcher.value = savedLang;
    setLanguage(savedLang);

    switcher.addEventListener('change', function() {
        const lang = this.value;
        localStorage.setItem('preferredLanguage', lang);
        setLanguage(lang);
        console.log(`🌐 Idioma alterado para: ${lang}`);
        // Recarrega apenas os textos (opcional)
        // applyTranslations(lang);
    });
}

// ===== ALUMNI (agrupado por orientador) =====
async function renderEgressosWithData(alumni, investigators) {
    const container = document.getElementById('egressos-container');
    if (!container) {
        console.warn('Container #egressos-container não encontrado.');
        return;
    }

    if (!alumni || alumni.length === 0) {
        container.innerHTML = '<p>No alumni registered.</p>';
        return;
    }

    // Agrupa por orientador
    const alumniBySupervisor = {};
    alumni.forEach(eg => {
        const supId = eg.supervisor_id || 'unassigned';
        if (!alumniBySupervisor[supId]) alumniBySupervisor[supId] = [];
        alumniBySupervisor[supId].push(eg);
    });

    // Ordena grupos pelos investigadores
    const orderedIds = [];
    if (investigators) {
        investigators.forEach(pi => {
            if (alumniBySupervisor[pi.id]) {
                orderedIds.push(pi.id);
                delete alumniBySupervisor[pi.id];
            }
        });
    }
    if (alumniBySupervisor['unassigned']) {
        orderedIds.push('unassigned');
    }

    // Renderiza
    container.innerHTML = '';
    for (const supId of orderedIds) {
        const list = alumniBySupervisor[supId] || [];
        if (list.length === 0) continue;

        let supervisorName = 'Other supervisors';
        if (supId !== 'unassigned' && investigators) {
            const pi = investigators.find(p => p.id === supId);
            if (pi) supervisorName = pi.name;
        }

        const groupDiv = document.createElement('div');
        groupDiv.className = 'grupo-pesquisador';
        groupDiv.style.marginBottom = '1.5rem';
        groupDiv.innerHTML = `
            <div style="margin-bottom:0.5rem;border-bottom:2px solid #003f44;padding-bottom:0.3rem;">
                <h3 style="font-size:1.2rem;color:#003f44;">${supervisorName}</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;">
                ${list.map(eg => `
                    <div style="background:#f8fafc;padding:0.75rem;border-radius:6px;border-left:3px solid #00747a;">
                        <div style="font-weight:600;">${eg.name}</div>
                        <div style="font-size:0.9rem;color:#555;">${eg.current_affiliation || ''} ${eg.degree_type ? `(${eg.degree_type})` : ''}</div>
                        <div style="font-size:0.85rem;color:#777;">Year: ${eg.graduation_year || '—'}</div>
                        ${eg.lattes ? `<div style="margin-top:0.3rem;"><a href="${eg.lattes}" target="_blank" style="color:#003f44;text-decoration:none;font-size:0.85rem;"><i class="fas fa-external-link-alt"></i> Lattes</a></div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(groupDiv);
    }
}

// ===== INICIA O SITE =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
