<script lang="ts">
    import { goto } from '$app/navigation';
    import { game } from '$lib/game.svelte';
    import { base } from '$app/paths';

    function startGame() {
        game.startGame();
        goto(`${base}/game`);
    }
</script>

<div class="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-white p-4">
    <h1 class="text-6xl font-bold mb-8 tracking-wider">Blackjack</h1>
    <button 
        onclick={startGame}
        class="px-8 py-4 bg-white text-blue-900 text-2xl font-semibold rounded-full shadow-lg hover:bg-blue-100 hover:scale-105 transition-all duration-300"
    >
        Spiel starten
    </button>
</div>
