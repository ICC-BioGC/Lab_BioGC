// js/dataLoader.js
export async function loadJSON(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch(e) {
        console.warn(`Error loading ${url}:`, e);
        return null;
    }
}