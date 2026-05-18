<script lang="ts">
	import { fade } from 'svelte/transition';

	let activeTab = $state('rules'); // 'rules' | 'cards'
</script>

<div class="container mx-auto p-4 max-w-4xl py-8">
	<div class="bg-blue-900/50 backdrop-blur-md border border-blue-400/20 rounded-2xl shadow-xl overflow-hidden">
		
		<!-- Header -->
		<div class="bg-blue-950 p-6 border-b border-blue-400/20 text-center">
			<h1 class="text-4xl font-bold text-white tracking-wider">Blackjack Regeln</h1>
			<p class="text-blue-200 mt-2">Lerne wie man spielt und welche Werte die Karten haben</p>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-blue-400/20 bg-blue-900">
			<button 
				class="flex-1 py-4 text-center font-medium transition-colors {activeTab === 'rules' ? 'text-white border-b-2 border-red-500 bg-blue-800/50' : 'text-blue-300 hover:text-white hover:bg-blue-800/30'}"
				onclick={() => activeTab = 'rules'}
			>
				Allgemeine Regeln
			</button>
			<button 
				class="flex-1 py-4 text-center font-medium transition-colors {activeTab === 'cards' ? 'text-white border-b-2 border-red-500 bg-blue-800/50' : 'text-blue-300 hover:text-white hover:bg-blue-800/30'}"
				onclick={() => activeTab = 'cards'}
			>
				Kartenwerte
			</button>
		</div>

		<!-- Content -->
		<div class="p-8 min-h-[400px]">
			{#if activeTab === 'rules'}
				<div in:fade={{ duration: 200 }} class="space-y-6">
					<div class="bg-blue-800/40 p-6 rounded-xl border border-blue-400/10">
						<h2 class="text-2xl font-bold text-yellow-400 mb-3">🎯 Ziel des Spiels</h2>
						<p class="text-blue-50 leading-relaxed">
							Das Ziel beim Blackjack ist es, mit den eigenen Karten näher an den Wert von <strong>21</strong> zu kommen als der Dealer, ohne diesen Wert zu überschreiten. 
							Überschreitet man 21 Punkte, hat man sich "überkauft" (Bust) und verliert sofort, unabhängig davon, was der Dealer hat.
						</p>
					</div>

					<div class="bg-blue-800/40 p-6 rounded-xl border border-blue-400/10">
						<h2 class="text-2xl font-bold text-yellow-400 mb-3">🎲 Ablauf</h2>
						<ul class="list-disc list-inside text-blue-50 space-y-2">
							<li>Jeder Spieler und der Dealer erhalten zu Beginn <strong>zwei Karten</strong>.</li>
							<li>Die Karten der Spieler liegen meist offen. Der Dealer hat eine offene und eine verdeckte Karte.</li>
							<li>Ist man an der Reihe, kann man weitere Karten verlangen (<strong>Hit</strong>), um näher an 21 zu kommen.</li>
							<li>Wenn man zufrieden ist, bleibt man stehen (<strong>Stand</strong>).</li>
							<li>Man kann seinen Einsatz verdoppeln (<strong>Double</strong>), erhält dann aber genau noch eine weitere Karte.</li>
						</ul>
					</div>

					<div class="bg-blue-800/40 p-6 rounded-xl border border-blue-400/10">
						<h2 class="text-2xl font-bold text-yellow-400 mb-3">👑 Der Dealer</h2>
						<p class="text-blue-50 leading-relaxed">
							Nachdem alle Spieler ihre Entscheidungen getroffen haben, deckt der Dealer seine zweite Karte auf. 
							Der Dealer muss nach festen Regeln ziehen: Er muss bei 16 oder weniger Punkten eine weitere Karte ziehen und bei 17 oder mehr Punkten stehen bleiben.
						</p>
					</div>
				</div>
			{/if}

			{#if activeTab === 'cards'}
				<div in:fade={{ duration: 200 }} class="space-y-6">
					
					<p class="text-lg text-center text-blue-200 mb-8">
						Im Blackjack sind die Farben der Karten (Herz, Karo, Pik, Kreuz) bedeutungslos. Es zählt einzig der aufgedruckte Wert.
					</p>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<!-- Zahlenkarten -->
						<div class="bg-blue-800/40 p-6 rounded-xl border border-blue-400/10 text-center transform transition-transform hover:scale-105">
							<div class="text-5xl mb-4">🔢</div>
							<h3 class="text-xl font-bold text-white mb-2">Zahlen 2 bis 10</h3>
							<div class="text-3xl font-black text-yellow-400 mb-3">Aufdruck</div>
							<p class="text-blue-200 text-sm">
								Alle Zahlenkarten von 2 bis 10 zählen genau den Wert, der auf ihnen aufgedruckt ist.
							</p>
						</div>

						<!-- Bilder -->
						<div class="bg-blue-800/40 p-6 rounded-xl border border-blue-400/10 text-center transform transition-transform hover:scale-105">
							<div class="text-5xl mb-4">🤴👸</div>
							<h3 class="text-xl font-bold text-white mb-2">Bildkarten</h3>
							<div class="text-3xl font-black text-yellow-400 mb-3">10 Punkte</div>
							<p class="text-blue-200 text-sm">
								Bube (Jack), Dame (Queen) und König (King) zählen jeweils immer 10 Punkte.
							</p>
						</div>

						<!-- Asse -->
						<div class="bg-blue-800/40 p-6 rounded-xl border border-blue-400/10 text-center transform transition-transform hover:scale-105 relative overflow-hidden">
							<div class="absolute -right-4 -top-4 text-7xl opacity-20">A</div>
							<div class="text-5xl mb-4 relative z-10">🅰️</div>
							<h3 class="text-xl font-bold text-white mb-2 relative z-10">Das Ass</h3>
							<div class="text-3xl font-black text-yellow-400 mb-3 relative z-10">1 oder 11</div>
							<p class="text-blue-200 text-sm relative z-10">
								Das Ass zählt entweder 1 oder 11 Punkte – immer so, wie es für die eigene Hand am besten (näher an 21, aber nicht darüber) ist.
							</p>
						</div>
					</div>

					<div class="mt-8 bg-blue-950/50 p-4 rounded-lg border border-red-500/30">
						<h4 class="text-red-400 font-bold mb-2">Was ist ein "Blackjack"?</h4>
						<p class="text-blue-100">
							Ein "Blackjack" ist die bestmögliche Hand und besteht aus einem Ass und einer 10-Punkte-Karte (10, Bube, Dame oder König) direkt nach dem Austeilen. 
							Ein Blackjack schlägt jede andere Hand mit 21 Punkten.
						</p>
					</div>

				</div>
			{/if}
		</div>

	</div>
</div>
