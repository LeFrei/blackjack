<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { loadStats } from '$lib/game.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';

	let { children } = $props();

	onMount(() => {
		loadStats();
	});

	let links = [
		{ href: `${base}/`, label: 'Spiel' },
		{ href: `${base}/shop`, label: 'Shop' },
		{ href: `${base}/stats`, label: 'Statistik' },
		{ href: `${base}/profile`, label: 'Profil' },
		{ href: `${base}/rules`, label: 'Regeln' }
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-blue-900 flex flex-col font-sans text-white">
	<nav class="bg-blue-950 shadow-md p-4 sticky top-0 z-50">
		<div class="max-w-4xl mx-auto flex justify-center gap-8">
			{#each links as link}
				<a 
					href={link.href} 
					class="text-lg font-medium transition-colors hover:text-blue-300 {page.url.pathname === link.href ? 'text-white border-b-2 border-red-500 pb-1' : 'text-blue-200'}"
				>
					{link.label}
				</a>
			{/each}
		</div>
	</nav>

	<main class="flex-1 flex flex-col">
		{@render children()}
	</main>
</div>
