// ===== IMPORTAÇÕES DOS MÓDULOS =====
import { loadAllComponents } from './components.js';
import { loadJSON } from './dataLoader.js';
import { renderTeam, renderPrincipalInvestigators } from './team.js';
import { renderPublications } from './publications.js';
import { renderPartners } from './partners.js';
import { renderGallery } from './gallery.js';
import { renderOpportunities } from './announcements.js';
import { applyTranslations, getCurrentLanguage, setLanguage } from './translations.js';

// ===== VARIÁVEIS GLOBAIS (cache) =====
let cachedData = {};

// ===== FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO =====
async function init() {
    try {
        console.log('🚀 Inicializando BioGC...');

        // 1. Carrega todos os componentes HTML (paralelo)
        await loadAllComponents();
        console.log('✅ Componentes carregados');

        // 2. Carrega todos os dados JSON (paralelo)
        const [investigators, members, alumni, partners, gallery, opportunities, publications, translations] = await Promise.all([
            loadJSON('data/principal-investigators.json'),
            loadJSON('data/members.json'),
            loadJSON('data/alumni.json'),
            loadJSON('data/partners.json'),
            loadJSON('data/gallery.json'),
            loadJSON('data/opportunities.json'),
            loadJSON('data/publications.json'),
            loadJSON('data/translations.json')
        ]);

        // Guarda em cache
        cachedData = { investigators, members, alumni, partners, gallery, opportunities, publications, translations };
        console.log('✅ Dados carregados', cachedData);

        // 3. Aplica traduções iniciais
        if (translations) {
            applyTranslations(translations, 'en');
        }

        // 4. Renderiza as seções dinâmicas (paralelo)
        await Promise.all([
            renderPrincipalInvestigators(investigators),
            renderTeam(members, investigators),
            renderPublications(publications, investigators, members),
            renderPartners(partners),
            renderGallery(gallery),
            renderOpportunities(opportunities),
            // Alumni usa função do próprio site.js (não exportada)
            renderEgressosWithData(alumni, investigators)
        ]);
        console.log('✅ Seções renderizadas');

        // 5. Configura o seletor de idioma
        setupLanguageSwitcher(translations);

        console.log('🎉 BioGC inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showErrorMessage('Falha ao carregar o site. Tente recarregar a página.');
    }
}

// ===== FUNÇÃO PARA EXIBIR MENSAGEM DE ERRO =====
function showErrorMessage(message) {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
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
function setupLanguageSwitcher(translations) {
    const switcher = document.getElementById('language-switcher');
    if (!switcher || !translations) return;

    const currentLang = getCurrentLanguage();
    switcher.value = currentLang;

    switcher.addEventListener('change', function() {
        const lang = this.value;
        setLanguage(lang);
        applyTranslations(translations, lang);
        // Recarrega os componentes que têm texto traduzível
        // (opcional: recarregar apenas os textos, não a página toda)
        console.log(`🌐 Idioma alterado para: ${lang}`);
    });
}

// ===== ALUMNI (agrupado por orientador, colapsado por padrão) =====
// (mantenha a função que você já tinha, mas com pequenas melhorias)
async function renderEgressosWithData(alumni, investigators) {
    const container = document.getElementById('egressos-container');
    if (!container) {
        console.warn('Container #egressos-container not found.');
        return;
    }

    // Se não houver dados, exibe mensagem
    if (!alumni || alumni.length === 0) {
        container.innerHTML = '<p>No alumni registered.</p>';
        return;
    }

    // --- Agrupa os egressos por orientador ---
    const alumniBySupervisor = {};
    alumni.forEach(eg => {
        const supId = eg.supervisor_id || 'unassigned';
        if (!alumniBySupervisor[supId]) alumniBySupervisor[supId] = [];
        alumniBySupervisor[supId].push(eg);
    });

    // --- Constrói a lista de IDs dos orientadores na ordem correta ---
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

    // --- Renderiza os grupos ---
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
            <div class="pesquisador-header" style="margin-bottom:0.5rem;border-bottom:2px solid #003f44;padding-bottom:0.3rem;">
                <h3 style="font-size:1.2rem;color:#003f44;">${supervisorName}</h3>
            </div>
            <div class="membros-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;">
                ${list.map(eg => `
                    <div class="egresso-card" style="background:#f8fafc;padding:0.75rem;border-radius:6px;border-left:3px solid #00747a;">
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

    // --- Configura o botão de toggle (se existir) ---
    const toggleBtn = document.getElementById('toggle-alumni-btn');
    const alumniContent = document.getElementById('alumni-content');
    if (toggleBtn && alumniContent) {
        alumniContent.style.display = 'none';
        toggleBtn.addEventListener('click', function() {
            const isVisible = alumniContent.style.display !== 'none';
            alumniContent.style.display = isVisible ? 'none' : 'block';
            this.querySelector('.toggle-text').innerText = isVisible ? 'Show alumni' : 'Hide alumni';
            this.querySelector('i').className = isVisible ? 'fas fa-plus-circle' : 'fas fa-minus-circle';
        });
        toggleBtn.querySelector('.toggle-text').innerText = 'Show alumni';
        toggleBtn.querySelector('i').className = 'fas fa-plus-circle';
    }
}

// ===== INICIA O SITE QUANDO O DOM ESTIVER PRONTO =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM já carregado
    init();
}

// ===== EXPORTA FUNÇÕES PARA USO EM OUTROS MÓDULOS (opcional) =====
export { renderEgressosWithData, cachedData };
