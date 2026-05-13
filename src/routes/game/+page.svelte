<script lang="ts">
    import { goto } from '$app/navigation';
    import { game } from '$lib/game.svelte';
    import Card from '$lib/components/Card.svelte';
    import { fly } from 'svelte/transition';
    import { base } from '$app/paths';

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
</script>

<div class="flex-1 flex flex-col justify-between p-4 md:p-8 font-sans h-full overflow-hidden">
    
    <!-- Dealer Section -->
    <div class="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full">
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
                    {#if game.status === 'playing' && i === 1}
                        <!-- Hidden second card for dealer -->
                        <div class="w-24 h-36 bg-blue-700 rounded-xl shadow-md border-2 border-blue-400 flex items-center justify-center">
                            <span class="text-4xl text-blue-500 font-bold">?</span>
                        </div>
                    {:else}
                        <Card {card} />
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
    <div class="mt-auto pt-6 flex justify-center gap-4 md:gap-8 pb-4">
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
    </div>
</div>
