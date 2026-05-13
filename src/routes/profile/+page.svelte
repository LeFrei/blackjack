<script lang="ts">
    import { onMount } from 'svelte';

    import { game, stats } from '$lib/game.svelte';

    let username = $state('');
    let email = $state('');
    let password = $state('');
    let showSuccess = $state(false);
    let shopMessage = $state('');

    onMount(() => {
        const storedProfile = localStorage.getItem('blackjack_profile');
        if (storedProfile) {
            const data = JSON.parse(storedProfile);
            username = data.username || '';
            email = data.email || '';
            password = data.password || '';
        }
    });

    function saveProfile(e: Event) {
        e.preventDefault();
        
        const data = { username, email, password };
        localStorage.setItem('blackjack_profile', JSON.stringify(data));
        
        showSuccess = true;
        setTimeout(() => {
            showSuccess = false;
        }, 3000);
    }

    function buyJoker() {
        if (game.buyJoker()) {
            shopMessage = 'Joker gekauft! 🃏';
        } else {
            shopMessage = 'Nicht genug Token! 🪙';
        }
        setTimeout(() => shopMessage = '', 2000);
    }
</script>

<div class="flex-1 flex flex-col items-center justify-center p-4">
    <div class="bg-blue-800/80 p-8 md:p-12 rounded-3xl shadow-2xl border border-blue-600 w-full max-w-lg">
        <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center tracking-wider text-white">Profil</h1>

        <form onsubmit={saveProfile} class="space-y-6">
            <div>
                <label for="username" class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wide">
                    Benutzername
                </label>
                <input 
                    type="text" 
                    id="username" 
                    bind:value={username}
                    placeholder="Spieler1"
                    class="w-full px-4 py-3 bg-blue-900/50 border border-blue-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-blue-400/50 transition-colors"
                />
            </div>

            <div>
                <label for="email" class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wide">
                    E-Mail
                </label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email}
                    placeholder="spieler@beispiel.de"
                    class="w-full px-4 py-3 bg-blue-900/50 border border-blue-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-blue-400/50 transition-colors"
                />
            </div>

            <div>
                <label for="password" class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wide">
                    Passwort
                </label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password}
                    placeholder="••••••••"
                    class="w-full px-4 py-3 bg-blue-900/50 border border-blue-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-blue-400/50 transition-colors"
                />
            </div>

            <button 
                type="submit"
                class="w-full mt-8 px-8 py-4 bg-white text-blue-900 text-xl font-bold rounded-full shadow-lg hover:bg-blue-100 transition-colors"
            >
                Speichern
            </button>
        </form>

        {#if showSuccess}
            <div class="mt-6 text-center text-green-400 font-bold bg-green-400/10 py-3 rounded-xl border border-green-400/20">
                Erfolgreich gespeichert!
            </div>
        {/if}
    </div>
</div>
