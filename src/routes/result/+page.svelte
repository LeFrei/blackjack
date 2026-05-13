<script lang="ts">
    import { goto } from '$app/navigation';
    import { game } from '$lib/game.svelte';
    import { onMount } from 'svelte';
    import { base } from '$app/paths';

    onMount(() => {
        if (game.status === 'idle' || game.status === 'playing') {
            goto(`${base}/`);
        }
    });

    function restart() {
        game.status = 'idle';
        goto(`${base}/`);
    }

    let resultText = $derived(() => {
        switch (game.status) {
            case 'playerWon': return 'Gewonnen!';
            case 'dealerWon': return 'Verloren!';
            case 'draw': return 'Unentschieden!';
            default: return '';
        }
    });

    let resultColor = $derived(() => {
        switch (game.status) {
            case 'playerWon': return 'text-green-400';
            case 'dealerWon': return 'text-red-500';
            case 'draw': return 'text-yellow-400';
            default: return 'text-white';
        }
    });
</script>

<div class="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4">
    <div class="bg-blue-800/50 p-12 rounded-3xl shadow-2xl backdrop-blur-sm border border-blue-700 text-center transform transition-all duration-500 hover:scale-105">
        <h1 class="text-6xl font-bold mb-4 {resultColor()}">
            {resultText()}
        </h1>
        
        <div class="text-blue-200 text-2xl mb-12 flex justify-center gap-8">
            <div class="flex flex-col items-center">
                <span class="text-sm uppercase tracking-wider mb-1">Du</span>
                <span class="font-bold text-white">{game.playerScore}</span>
            </div>
            <div class="text-blue-500 font-light flex items-center">:</div>
            <div class="flex flex-col items-center">
                <span class="text-sm uppercase tracking-wider mb-1">Dealer</span>
                <span class="font-bold text-white">{game.dealerScore}</span>
            </div>
        </div>

        <button 
            onclick={restart}
            class="px-8 py-4 bg-white text-blue-900 text-xl font-bold rounded-full shadow-lg hover:bg-blue-100 transition-colors w-full"
        >
            Neues Spiel
        </button>
    </div>
</div>
