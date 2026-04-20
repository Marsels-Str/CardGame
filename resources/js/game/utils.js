export function getCardValue(value) {
    if (!value) return Infinity;
    if (value === 'J') return 11;
    if (value === 'Q') return 12;
    if (value === 'K') return 13;
    if (value === 'A') return 14;
    return parseInt(value) || Infinity;
}

export function cardHTML(card) {
    return `<img src="${card.image}" alt="${card.code}" class="w-12 h-auto">`;
}
