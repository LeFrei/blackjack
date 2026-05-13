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
    tokens: number;
    jokers: number;
    peeks: number;
    swaps: number;
}

export const stats: GameStats = $state({
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    tokens: 10, // Start mit 10 Token
    jokers: 0,
    peeks: 0,
    swaps: 0
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
    
    // Match-Status
    matchRound: number = $state(0); // 0 = kein Match aktiv
    matchWinsPlayer: number = $state(0);
    matchWinsDealer: number = $state(0);
    matchStatus: 'none' | 'active' | 'finished' = $state('none');
    isPeekActive: boolean = $state(false);

    startMatch() {
        this.matchRound = 1;
        this.matchWinsPlayer = 0;
        this.matchWinsDealer = 0;
        this.matchStatus = 'active';
        this.startRound();
    }

    startRound() {
        this.deck = createDeck();
        this.playerHand = [this.deck.pop()!, this.deck.pop()!];
        this.dealerHand = [this.deck.pop()!, this.deck.pop()!];
        this.status = 'playing';
        this.isPeekActive = false;
    }
    
    hit() {
        if (this.status !== 'playing') return;
        
        // Spieler zieht
        this.playerHand.push(this.deck.pop()!);
        
        if (this.playerScore > 21) {
            this.endRound('dealerWon');
            return;
        }

        // Dealer zieht abwechselnd (wenn unter 17)
        if (this.dealerScore < 17) {
            this.dealerHand.push(this.deck.pop()!);
            if (this.dealerScore > 21) {
                this.endRound('playerWon');
            }
        }
    }
    
    stand() {
        if (this.status !== 'playing') return;
        
        // Dealer zieht den Rest bis 17
        let dScore = this.dealerScore;
        while (dScore < 17) {
            this.dealerHand.push(this.deck.pop()!);
            dScore = this.dealerScore;
        }
        
        const pScore = this.playerScore;
        if (dScore > 21 || pScore > dScore) {
            this.endRound('playerWon');
        } else if (dScore > pScore) {
            this.endRound('dealerWon');
        } else {
            this.endRound('draw');
        }
    }

    useJoker(rank: Rank) {
        if (this.status !== 'playing' || stats.jokers <= 0) return;
        
        // Finde Karte im Deck oder erstelle eine neue
        const cardIndex = this.deck.findIndex(c => c.rank === rank);
        let card: Card;
        
        if (cardIndex !== -1) {
            card = this.deck.splice(cardIndex, 1)[0];
        } else {
            // Falls Rank nicht mehr im Deck (unwahrscheinlich bei 52 Karten), erstelle eine
            card = { suit: 'Hearts', rank, value: getCardValue(rank) };
        }
        
        this.playerHand.push(card);
        stats.jokers--;
        saveStats();

        if (this.playerScore > 21) {
            this.endRound('dealerWon');
        }
    }

    buyJoker() {
        if (stats.tokens >= 3) {
            stats.tokens -= 3;
            stats.jokers++;
            saveStats();
            return true;
        }
        return false;
    }

    buyPeek() {
        if (stats.tokens >= 2) {
            stats.tokens -= 2;
            stats.peeks++;
            saveStats();
            return true;
        }
        return false;
    }

    buySwap() {
        if (stats.tokens >= 4) {
            stats.tokens -= 4;
            stats.swaps++;
            saveStats();
            return true;
        }
        return false;
    }

    useSwap() {
        if (this.status === 'playing' && stats.swaps > 0 && this.playerHand.length > 0) {
            stats.swaps--;
            this.playerHand.pop();
            this.playerHand.push(this.deck.pop()!);
            saveStats();
            return true;
        }
        return false;
    }

    usePeek() {
        if (this.status === 'playing' && stats.peeks > 0 && !this.isPeekActive) {
            stats.peeks--;
            this.isPeekActive = true;
            saveStats();
            return true;
        }
        return false;
    }
    
    private endRound(roundResult: GameStatus) {
        this.status = roundResult;
        
        // Match-Wins tracken
        if (roundResult === 'dealerWon') {
            this.matchWinsDealer++;
        } else if (roundResult === 'playerWon') {
            this.matchWinsPlayer++;
        }

        // Match-Verlauf prüfen
        if (this.matchRound >= 5) {
            this.endMatch();
        }
        
        saveStats();
    }

    private endMatch() {
        this.matchStatus = 'finished';
        stats.played++;
        
        // Token-Logik: Nur wenn mehr als die Hälfte (3 von 5) gewonnen oder verloren wurden
        if (this.matchWinsPlayer >= 3) {
            this.status = 'playerWon';
            stats.wins++;
            stats.tokens += 1; // +1 Token bei > 50% Siegen
        } else if (this.matchWinsDealer >= 3) {
            this.status = 'dealerWon';
            stats.losses++;
            stats.tokens = Math.max(0, stats.tokens - 1); // -1 Token bei > 50% Niederlagen
        } else {
            // Unentschieden oder knapper Stand ohne absolute Mehrheit
            if (this.matchWinsPlayer > this.matchWinsDealer) {
                this.status = 'playerWon';
                stats.wins++;
            } else if (this.matchWinsDealer > this.matchWinsPlayer) {
                this.status = 'dealerWon';
                stats.losses++;
            } else {
                this.status = 'draw';
                stats.draws++;
            }
        }
        saveStats();
    }

    nextRound() {
        if (this.matchRound < 5) {
            this.matchRound++;
            this.startRound();
        }
    }
    
    get playerScore() {
        return calculateScore(this.playerHand);
    }
    
    get dealerScore() {
        return calculateScore(this.dealerHand);
    }
}

export const game = new GameState();
