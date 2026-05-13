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

    function nextRound() {
        game.nextRound();
        goto(`${base}/game`);
    }

    function startNewMatch() {
        game.startMatch();
        goto(`${base}/game`);
    }

    function restart() {
        game.status = 'idle';
        game.matchStatus = 'none';
        goto(`${base}/`);
    }

    let isMatchEnd = $derived(game.matchStatus === 'finished');

    let resultText = $derived(() => {
        if (isMatchEnd) {
            if (game.matchWinsPlayer > game.matchWinsDealer) return 'Match gewonnen!';
            if (game.matchWinsDealer > game.matchWinsPlayer) return 'Match verloren!';
            return 'Match Unentschieden!';
        }
        switch (game.status) {
            case 'playerWon': return 'Runde gewonnen!';
            case 'dealerWon': return 'Runde verloren!';
            case 'draw': return 'Runde unentschieden!';
            default: return '';
        }
    });

    let resultColor = $derived(() => {
        const status = isMatchEnd 
            ? (game.matchWinsPlayer > game.matchWinsDealer ? 'playerWon' : (game.matchWinsDealer > game.matchWinsPlayer ? 'dealerWon' : 'draw'))
            : game.status;
        switch (status) {
            case 'playerWon': return 'text-green-400';
            case 'dealerWon': return 'text-red-500';
            case 'draw': return 'text-yellow-400';
            default: return 'text-white';
        }
    });
</script>

<div class="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4">
    <div class="bg-blue-800/50 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm border border-blue-700 text-center max-w-lg w-full">
        <div class="text-blue-300 uppercase tracking-widest text-sm mb-2">
            {isMatchEnd ? 'Endergebnis' : `Runde ${game.matchRound} / 5`}
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold mb-6 {resultColor()}">
            {resultText()}
        </h1>
        
        <!-- Score Display -->
        <div class="bg-blue-950/50 rounded-2xl p-6 mb-8 border border-blue-700/50">
            <div class="text-blue-200 text-sm uppercase mb-4 tracking-tighter">Aktueller Match-Stand</div>
            <div class="flex justify-center items-center gap-10">
                <div class="flex flex-col items-center">
                    <span class="text-xs text-blue-400 mb-1">DU</span>
                    <span class="text-4xl font-bold text-white">{game.matchWinsPlayer}</span>
                </div>
                <div class="text-3xl font-light text-blue-700">:</div>
                <div class="flex flex-col items-center">
                    <span class="text-xs text-blue-400 mb-1">DEALER</span>
                    <span class="text-4xl font-bold text-white">{game.matchWinsDealer}</span>
                </div>
            </div>
        </div>

        {#if isMatchEnd}
            <div class="mb-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
                <div class="text-yellow-400 font-bold text-lg mb-1">
                    {game.matchWinsPlayer >= 3 ? '+1 Token Belohnung!' : (game.matchWinsDealer >= 3 ? '-1 Token' : 'Match beendet')}
                </div>
                <div class="text-blue-200 text-sm">Besuche dein Profil, um Joker zu kaufen.</div>
            </div>
        {/if}

        <div class="flex flex-col gap-4">
            {#if isMatchEnd}
                <button 
                    onclick={startNewMatch}
                    class="px-8 py-4 bg-white text-blue-900 text-xl font-bold rounded-full shadow-lg hover:bg-blue-100 transition-all w-full"
                >
                    Neues Match starten
                </button>
            {:else}
                <button 
                    onclick={nextRound}
                    class="px-8 py-4 bg-white text-blue-900 text-xl font-bold rounded-full shadow-lg hover:bg-blue-100 transition-all w-full"
                >
                    Nächste Runde ({game.matchRound + 1}/5)
                </button>
            {/if}
            
            <button 
                onclick={restart}
                class="text-blue-400 hover:text-white transition-colors text-sm underline"
            >
                Zum Hauptmenü
            </button>
        </div>
    </div>
</div>
