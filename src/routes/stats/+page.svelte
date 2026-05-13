<script lang="ts">
    import { stats } from '$lib/game.svelte';

    let winRate = $derived(() => {
        if (stats.played === 0) return 0;
        return Math.round((stats.wins / stats.played) * 100);
    });
</script>

<div class="flex-1 flex flex-col items-center justify-center p-4">
    <div class="bg-blue-800/80 p-8 md:p-12 rounded-3xl shadow-2xl border border-blue-600 w-full max-w-lg">
        <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center tracking-wider text-white">Statistik</h1>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-blue-900/50 p-6 rounded-2xl flex flex-col items-center justify-center border border-blue-700">
                <span class="text-sm text-blue-300 uppercase tracking-wider mb-1">Gespielt</span>
                <span class="text-3xl font-bold text-white">{stats.played}</span>
            </div>
            
            <div class="bg-blue-900/50 p-6 rounded-2xl flex flex-col items-center justify-center border border-blue-700">
                <span class="text-sm text-blue-300 uppercase tracking-wider mb-1">Gewinnrate</span>
                <span class="text-3xl font-bold {winRate() > 50 ? 'text-green-400' : 'text-white'}">{winRate()}%</span>
            </div>
        </div>

        <div class="space-y-4">
            <div class="flex justify-between items-center bg-blue-900/30 p-4 rounded-xl border border-blue-800/50">
                <span class="text-blue-200 text-lg">Gewinne</span>
                <span class="text-2xl font-bold text-green-400">{stats.wins}</span>
            </div>
            
            <div class="flex justify-between items-center bg-blue-900/30 p-4 rounded-xl border border-blue-800/50">
                <span class="text-blue-200 text-lg">Verluste</span>
                <span class="text-2xl font-bold text-red-500">{stats.losses}</span>
            </div>
            
            <div class="flex justify-between items-center bg-blue-900/30 p-4 rounded-xl border border-blue-800/50">
                <span class="text-blue-200 text-lg">Unentschieden</span>
                <span class="text-2xl font-bold text-yellow-400">{stats.draws}</span>
            </div>

            <div class="pt-4 mt-4 border-t border-blue-700/50 grid grid-cols-2 gap-4">
                <div class="flex flex-col items-center p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/10">
                    <span class="text-xs text-yellow-400 uppercase mb-1">Token</span>
                    <span class="text-2xl font-bold text-yellow-400">🪙 {stats.tokens}</span>
                </div>
                <div class="flex flex-col items-center p-4 bg-purple-400/5 rounded-xl border border-purple-400/10">
                    <span class="text-xs text-purple-400 uppercase mb-1">Joker</span>
                    <span class="text-2xl font-bold text-purple-400">🃏 {stats.jokers}</span>
                </div>
                <div class="flex flex-col items-center p-4 bg-blue-400/5 rounded-xl border border-blue-400/10">
                    <span class="text-xs text-blue-400 uppercase mb-1">Blicke</span>
                    <span class="text-2xl font-bold text-blue-400">👁️ {stats.peeks}</span>
                </div>
                <div class="flex flex-col items-center p-4 bg-green-400/5 rounded-xl border border-green-400/10">
                    <span class="text-xs text-green-400 uppercase mb-1">Schilde</span>
                    <span class="text-2xl font-bold text-green-400">🛡️ {stats.shields}</span>
                </div>
            </div>
        </div>
    </div>
</div>
