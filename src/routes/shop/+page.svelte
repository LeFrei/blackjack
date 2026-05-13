<script lang="ts">
    import { game, stats } from '$lib/game.svelte';
    import { base } from '$app/paths';

    let message = $state('');
    let messageType: 'success' | 'error' = $state('success');

    function buy(item: 'joker' | 'peek' | 'swap') {
        let success = false;
        let itemName = '';
        
        if (item === 'joker') {
            success = game.buyJoker();
            itemName = 'Joker';
        } else if (item === 'peek') {
            success = game.buyPeek();
            itemName = 'Dealer-Blick';
        } else if (item === 'swap') {
            success = game.buySwap();
            itemName = 'Kartentausch';
        }

        if (success) {
            message = `${itemName} erfolgreich gekauft!`;
            messageType = 'success';
        } else {
            message = 'Nicht genug Token!';
            messageType = 'error';
        }

        setTimeout(() => message = '', 2000);
    }
</script>

<div class="flex-1 flex flex-col items-center p-4 md:p-8">
    <div class="w-full max-w-4xl">
        <div class="flex justify-between items-center mb-12">
            <h1 class="text-5xl font-bold text-white tracking-widest uppercase">Shop</h1>
            <div class="bg-blue-800/50 px-6 py-3 rounded-2xl border border-blue-600 flex items-center gap-4">
                <span class="text-blue-200 text-sm font-bold uppercase tracking-widest">Guthaben:</span>
                <span class="text-3xl font-bold text-yellow-400">🪙 {stats.tokens}</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Joker -->
            <div class="bg-blue-800/40 p-8 rounded-3xl border border-blue-700/50 flex flex-col items-center text-center group hover:border-purple-500/50 transition-all">
                <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">🃏</div>
                <h3 class="text-2xl font-bold text-white mb-2">Joker</h3>
                <p class="text-blue-300 text-sm mb-6 flex-1">Erlaubt es dir, eine spezifische Karte (z.B. ein Ass) zu wählen.</p>
                <div class="text-yellow-400 font-bold text-lg mb-4">3 Token 🪙</div>
                <button 
                    onclick={() => buy('joker')}
                    class="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-colors active:scale-95"
                >
                    Kaufen
                </button>
            </div>

            <!-- Dealer Peek -->
            <div class="bg-blue-800/40 p-8 rounded-3xl border border-blue-700/50 flex flex-col items-center text-center group hover:border-blue-400/50 transition-all">
                <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">👁️</div>
                <h3 class="text-2xl font-bold text-white mb-2">Dealer-Blick</h3>
                <p class="text-blue-300 text-sm mb-6 flex-1">Deckt die verborgene Karte des Dealers für eine Runde auf.</p>
                <div class="text-yellow-400 font-bold text-lg mb-4">2 Token 🪙</div>
                <button 
                    onclick={() => buy('peek')}
                    class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors active:scale-95"
                >
                    Kaufen
                </button>
            </div>

            <!-- Card Swap -->
            <div class="bg-blue-800/40 p-8 rounded-3xl border border-blue-700/50 flex flex-col items-center text-center group hover:border-green-400/50 transition-all">
                <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
                <h3 class="text-2xl font-bold text-white mb-2">Kartentausch</h3>
                <p class="text-blue-300 text-sm mb-6 flex-1">Ersetzt deine zuletzt gezogene Karte durch eine neue vom Stapel.</p>
                <div class="text-yellow-400 font-bold text-lg mb-4">4 Token 🪙</div>
                <button 
                    onclick={() => buy('swap')}
                    class="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-colors active:scale-95"
                >
                    Kaufen
                </button>
            </div>
        </div>

        <div class="mt-12 grid grid-cols-3 gap-4 text-center">
            <div class="text-blue-300 bg-blue-900/30 p-4 rounded-2xl">
                Dein Inventar:
            </div>
            <div class="bg-blue-900/30 p-4 rounded-2xl flex items-center justify-center gap-2">
                <span class="text-xl">🃏</span> <span class="text-white font-bold">{stats.jokers}</span>
            </div>
            <div class="bg-blue-900/30 p-4 rounded-2xl flex items-center justify-center gap-2">
                <span class="text-xl">👁️</span> <span class="text-white font-bold">{stats.peeks}</span>
            </div>
             <div class="bg-blue-900/30 p-4 rounded-2xl flex items-center justify-center gap-2 col-start-2">
                <span class="text-xl">🔄</span> <span class="text-white font-bold">{stats.swaps}</span>
            </div>
        </div>

        {#if message}
            <div class="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl font-bold text-xl animate-bounce {messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}">
                {message}
            </div>
        {/if}
    </div>
</div>
