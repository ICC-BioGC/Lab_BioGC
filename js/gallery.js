// js/gallery.js
export async function renderGaleriaWithData(gallery) {
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