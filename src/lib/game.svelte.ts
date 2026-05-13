export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

export type GameStatus = 'playing' | 'playerWon' | 'dealerWon' | 'draw' | 'idle';

export interface GameStats {
    played: number;
    wins: number;
    losses: number;
    draws: number;
}

export const stats: GameStats = $state({
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0
});

export function loadStats() {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('blackjack_stats');
        if (stored) {
            Object.assign(stats, JSON.parse(stored));
        }
    }
}

export function saveStats() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('blackjack_stats', JSON.stringify(stats));
    }
}

const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getCardValue(rank: Rank): number {
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    if (rank === 'A') return 11;
    return parseInt(rank);
}

function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank, value: getCardValue(rank) });
        }
    }
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export function calculateScore(cards: Card[]): number {
    let score = 0;
    let aces = 0;
    for (const card of cards) {
        score += card.value;
        if (card.rank === 'A') aces += 1;
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }
    return score;
}

export class GameState {
    deck: Card[] = $state([]);
    playerHand: Card[] = $state([]);
    dealerHand: Card[] = $state([]);
    status: GameStatus = $state('idle');
    
    startGame() {
        this.deck = createDeck();
        this.playerHand = [this.deck.pop()!, this.deck.pop()!];
        this.dealerHand = [this.deck.pop()!, this.deck.pop()!];
        this.status = 'playing';
    }
    
    hit() {
        if (this.status !== 'playing') return;
        this.playerHand.push(this.deck.pop()!);
        if (this.playerScore > 21) {
            this.endGame('dealerWon');
        }
    }
    
    stand() {
        if (this.status !== 'playing') return;
        let dScore = this.dealerScore;
        while (dScore < 17) {
            this.dealerHand.push(this.deck.pop()!);
            dScore = this.dealerScore;
        }
        
        const pScore = this.playerScore;
        if (dScore > 21 || pScore > dScore) {
            this.endGame('playerWon');
        } else if (dScore > pScore) {
            this.endGame('dealerWon');
        } else {
            this.endGame('draw');
        }
    }
    
    private endGame(finalStatus: GameStatus) {
        this.status = finalStatus;
        stats.played++;
        if (finalStatus === 'playerWon') stats.wins++;
        if (finalStatus === 'dealerWon') stats.losses++;
        if (finalStatus === 'draw') stats.draws++;
        saveStats();
    }
    
    get playerScore() {
        return calculateScore(this.playerHand);
    }
    
    get dealerScore() {
        return calculateScore(this.dealerHand);
    }
}

export const game = new GameState();
