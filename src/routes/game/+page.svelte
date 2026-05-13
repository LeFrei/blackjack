<script lang="ts">
    import { goto } from '$app/navigation';
    import { game } from '$lib/game.svelte';
    import Card from '$lib/components/Card.svelte';
    import { fly } from 'svelte/transition';
    import { base } from '$app/paths';

    import { stats } from '$lib/game.svelte';

    let showJokerModal = $state(false);
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

    // If game state is idle, redirect to home
    if (game.status === 'idle') {
        if (typeof window !== 'undefined') {
            goto(`${base}/`);
        }
    }

    $effect(() => {
        if (game.status !== 'playing' && game.status !== 'idle') {
            setTimeout(() => {
                goto(`${base}/result`);
            }, 1000); // 1s delay before redirecting to result page
        }
    });

    function selectJoker(rank: any) {
        game.useJoker(rank);
        showJokerModal = false;
    }
</script>

<div class="flex-1 flex flex-col justify-between p-4 md:p-8 font-sans h-full overflow-hidden relative">
    
    <!-- Top Info Bar -->
    <div class="absolute top-4 left-4 right-4 flex justify-between items-center text-blue-200 uppercase tracking-widest text-sm md:text-base bg-blue-950/40 p-3 rounded-xl backdrop-blur-sm">
        <div>Runde {game.matchRound} / 5</div>
        <div class="font-bold text-white">
            Score: <span class="text-green-400">{game.matchWinsPlayer}</span> - <span class="text-red-400">{game.matchWinsDealer}</span>
        </div>
        <div class="flex gap-6">
            <div class="flex items-center gap-1">
                <span class="text-yellow-400">🪙</span> {stats.tokens}
            </div>
            <div class="flex items-center gap-1" title="Joker">
                <span class="text-purple-400">🃏</span> {stats.jokers}
            </div>
            <div class="flex items-center gap-1" title="Dealer-Blick">
                <span class="text-blue-400">👁️</span> {stats.peeks}
            </div>
            <div class="flex items-center gap-1" title="Glücksbringer">
                <span class="text-green-400">🛡️</span> {stats.shields}
            </div>
        </div>
    </div>

    <!-- Dealer Section -->
    <div class="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full mt-12">
        <div class="flex flex-col items-center md:items-end w-32 shrink-0">
            <h2 class="text-2xl font-light text-blue-200 mb-1 uppercase tracking-widest">Dealer</h2>
            {#if game.status !== 'playing'}
                <div class="text-4xl font-bold text-white transition-opacity duration-300">
                    {game.dealerScore}
                </div>
            {/if}
        </div>
        <div class="flex gap-4 min-h-[144px]">
            {#each game.dealerHand as card, i (i)}
                <div in:fly={{ y: -50, duration: 400, delay: i * 150 }}>
                    {#if game.status === 'playing' && i === 1 && !game.isPeekActive}
                        <!-- Hidden second card for dealer -->
                        <div class="w-24 h-36 bg-blue-700 rounded-xl shadow-md border-2 border-blue-400 flex items-center justify-center">
                            <span class="text-4xl text-blue-500 font-bold">?</span>
                        </div>
                    {:else}
                        <div class={game.isPeekActive && i === 1 ? 'ring-4 ring-blue-400 rounded-xl animate-pulse' : ''}>
                            <Card {card} />
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <!-- Player Section -->
    <div class="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full">
        <div class="flex flex-col items-center md:items-end w-32 shrink-0">
            <h2 class="text-2xl font-light text-blue-200 mb-1 uppercase tracking-widest">Du</h2>
            <div class="text-5xl md:text-6xl font-bold {game.playerScore > 21 ? 'text-red-500' : 'text-white'} transition-colors duration-300">
                {game.playerScore}
            </div>
        </div>
        <div class="flex gap-4 min-h-[144px] flex-wrap justify-center">
            {#each game.playerHand as card, i (i)}
                <div in:fly={{ y: 50, duration: 400, delay: i * 100 }}>
                    <Card {card} />
                </div>
            {/each}
        </div>
    </div>

    <!-- Actions -->
    <div class="mt-auto pt-6 flex flex-wrap justify-center gap-4 md:gap-8 pb-4">
        <button 
            onclick={() => game.hit()}
            disabled={game.status !== 'playing'}
            class="px-8 py-4 bg-white text-blue-900 text-xl font-bold rounded-full shadow-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
            Karte ziehen
        </button>
        <button 
            onclick={() => game.stand()}
            disabled={game.status !== 'playing'}
            class="px-8 py-4 bg-transparent border-2 border-white text-white text-xl font-bold rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
            Aufhören
        </button>
        <button 
            onclick={() => showJokerModal = true}
            disabled={game.status !== 'playing' || stats.jokers <= 0}
            class="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-purple-400"
        >
            Joker (🃏 {stats.jokers})
        </button>
        <button 
            onclick={() => game.usePeek()}
            disabled={game.status !== 'playing' || stats.peeks <= 0 || game.isPeekActive}
            class="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-blue-400"
        >
            Blick (👁️ {stats.peeks})
        </button>
    </div>

    <!-- Joker Modal -->
    {#if showJokerModal}
        <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div class="bg-blue-900 border-2 border-purple-500 p-8 rounded-3xl max-w-lg w-full text-center">
                <h2 class="text-3xl font-bold mb-6 text-purple-300">Wähle deine nächste Karte</h2>
                <div class="grid grid-cols-4 gap-3">
                    {#each ranks as rank}
                        <button 
                            onclick={() => selectJoker(rank)}
                            class="p-3 bg-blue-800 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors border border-blue-700"
                        >
                            {rank}
                        </button>
                    {/each}
                </div>
                <button 
                    onclick={() => showJokerModal = false}
                    class="mt-8 text-blue-400 hover:text-white underline"
                >
                    Abbrechen
                </button>
            </div>
        </div>
    {/if}
</div>
