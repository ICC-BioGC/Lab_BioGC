// js/publications.js

export async function renderPublicacoesWithData(pubs, investigators, members) {
    const container = document.getElementById('publicacoes-container');
    if (!container) {
        console.warn('Container #publicacoes-container não encontrado.');
        return;
    }
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading publications...</div>';
    if (!pubs || pubs.length === 0) {
        container.innerHTML = '<p>No publications registered.</p>';
        return;
    }

    // Ordena do mais recente para o mais antigo
    pubs.sort((a, b) => b.year - a.year);
    container.innerHTML = '';
    const lista = document.createElement('div');
    lista.className = 'publicacoes-lista';

    // Criar mapas para buscar pesquisadores e membros pelo ID/nome
    const piMap = {};
    if (investigators) {
        investigators.forEach(pi => { piMap[pi.id] = pi; });
    }
    const memberMap = {};
    if (members) {
        members.forEach(m => { memberMap[m.name] = m; });
    }

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
                // Se tiver ID e existir no mapa de PI, cria link
                if (id && piMap[id]) {
                    authorLinks.push(`<a href="#team">${authorName}</a>`);
                } else if (memberMap[authorName]) {
                    // Se o nome existir no mapa de membros, cria link
                    authorLinks.push(`<a href="#team">${authorName}</a>`);
                } else {
                    // Caso contrário, exibe apenas o nome
                    authorLinks.push(authorName);
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
