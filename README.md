# Site institucional do Laboratório de Bioinformática e Genômica Clínica (BioGC) – Fiocruz

Este repositório contém o código-fonte do site oficial do **BioGC** (Laboratório de Bioinformática e Genômica Clínica), unidade do Instituto Carlos Chagas – Fiocruz Paraná.

## Acesse o site

[https://icc-biogc.github.io/Lab_BioGC/](https://icc-biogc.github.io/Lab_BioGC/)

## Estrutura do projeto

```
Lab_BioGC/
├── index.html                      # Página principal (esqueleto)
├── css/
│   └── style.css                   # Estilos (identidade visual Fiocruz)
├── js/
│   └── site.js                     # Lógica JavaScript (componentes, JSON, traduções)
├── components/                     # Componentes HTML reutilizáveis
│   ├── header.html
│   ├── hero.html
│   ├── about.html
│   ├── research.html
│   ├── team.html
│   ├── alumni.html
│   ├── gallery.html
│   ├── opportunities.html
│   ├── partners.html
│   ├── publications.html
│   ├── contact.html
│   └── footer.html
├── data/                           # Dados dinâmicos (JSON)
│   ├── principal-investigators.json
│   ├── members.json
│   ├── alumni.json
│   ├── partners.json
│   ├── gallery.json
│   ├── opportunities.json
│   ├── publications.json
│   └── translations.json
├── img/                            # Imagens, logos, fotos da equipe, galeria
└── README.md
```

## Tecnologias utilizadas

- **HTML5** semântico, com componentes reutilizáveis (carregados via JavaScript).
- **CSS3** (Flexbox, Grid, responsivo) – identidade visual alinhada ao manual da Fiocruz.
- **JavaScript moderno** (ES6+) – carregamento assíncrono de componentes e dados, sistema de tradução (EN/PT), cache de requisições e renderização paralela para otimização de performance.
- **JSON** – toda a equipe (pesquisadores, membros, egressos), parceiros, galeria, oportunidades e publicações são gerenciados via arquivos JSON, permitindo fácil atualização sem mexer no HTML.
- **Font Awesome** – ícones.
- **Open Sans** – tipografia institucional Fiocruz.

## Como contribuir ou atualizar

### 1. Conteúdo estático (textos da página)
Edite os arquivos HTML dentro da pasta `components/` (ex.: `about.html`, `research.html`, `contact.html`). Eles estão em inglês, mas o sistema de tradução (`data/translations.json`) permite alternar para português.

### 2. Adicionar/editar membros da equipe
- **Pesquisadores principais**: edite `data/principal-investigators.json`.  
- **Alunos, pós-docs, colaboradores**: edite `data/members.json`.  
- **Egressos**: edite `data/alumni.json`.

Campos disponíveis: `id`, `name`, `position`, `email`, `lattes`, `orcid`, `researchgate`, `google_scholar`, `linkedin`, `instagram`, `github`, `picture` (opcional), `supervisor_id`, `co_supervisor`.

### 3. Adicionar/editar publicações
Edite `data/publications.json`. Cada publicação pode conter `title`, `authors`, `journal`, `year`, `volume`, `pages`, `doi`, `link`, `abstract`, `pdf`, `author_details` (para vincular autores a membros do laboratório).

### 4. Adicionar/editar parceiros
Edite `data/partners.json`. Campos: `name`, `type`, `link`, `description`, `logo` (opcional).

### 5. Adicionar/editar imagens na galeria
Edite `data/gallery.json`. Cada entrada: `url` (caminho da imagem) e `title`.

### 6. Adicionar/editar oportunidades (vagas, editais)
Edite `data/opportunities.json`. Campos: `title`, `description`, `link`.

### 7. Atualizar traduções (inglês/português)
Edite `data/translations.json`. As chaves seguem a mesma estrutura para ambos os idiomas.

### 8. Publicar as alterações
- Faça commit e push para a branch `main`.
- O GitHub Pages fará o deploy automaticamente. O site será atualizado em poucos minutos.

## Cores institucionais (Fiocruz)

- **Brick Fiocruz**: `#cc3121` (usado apenas em detalhes – removido gradualmente em favor do azul institucional)
- **Verde Fiocruz**: `#00747a` (detalhes secundários)
- **Azul escuro**: `#003f44` – cor principal para cabeçalhos, botões, bordas e destaques.
- **Cinza claro**: `#f8fafc` – fundos alternados.

## Performance e boas práticas

- Os componentes HTML e os dados JSON são carregados em paralelo.
- Todas as requisições JSON são feitas simultaneamente (Promise.all).
- A renderização das seções dinâmicas ocorre em paralelo.
- Dados são cacheados em memória para evitar requisições repetidas.

## Contato

Para dúvidas ou sugestões sobre o site, entre em contato com a equipe do BioGC:  
[biogc@fiocruz.br](mailto:biogc@fiocruz.br)

---

© 2026 – Laboratório de Bioinformática e Genômica Clínica | ICC/Fiocruz
