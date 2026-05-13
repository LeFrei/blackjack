<script lang="ts">
    import type { Card } from '$lib/game.svelte';
    
    let { card } = $props<{ card: Card }>();
    
    let isRed = $derived(card.suit === 'Hearts' || card.suit === 'Diamonds');
    
    function getSuitSymbol(suit: string) {
        switch (suit) {
            case 'Hearts': return '♥';
            case 'Diamonds': return '♦';
            case 'Clubs': return '♣';
            case 'Spades': return '♠';
            default: return '';
        }
    }
</script>

<div class="relative w-24 h-36 bg-white rounded-xl shadow-md border-2 border-gray-200 flex flex-col justify-between p-2 text-xl font-bold {isRed ? 'text-red-500' : 'text-gray-900'} transform transition-transform hover:-translate-y-2">
    <div class="self-start">{card.rank}</div>
    <div class="text-4xl self-center">{getSuitSymbol(card.suit)}</div>
    <div class="self-end rotate-180">{card.rank}</div>
</div>
