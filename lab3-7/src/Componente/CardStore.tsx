// CardStore.tsx
import { makeAutoObservable } from 'mobx';

export class CardStore {
    cards: Card1[] = [];
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
        // Load cards from localStorage when CardStore is instantiated
        const storedCards = localStorage.getItem('cards');
        if (storedCards) {
            this.cards = JSON.parse(storedCards);
        }
    }

    addCard(newCard: Card1) {
        this.cards.push(newCard);
        this.saveCards();
    }

    deleteCard(index: number) {
        this.cards.splice(index, 1);
        this.saveCards();
    }

    private saveCards() {
        localStorage.setItem('cards', JSON.stringify(this.cards));
    }
}

// Definiți interfața Card aici
interface Card1 {
    title: string;
    content: string;
    owner: string;
}
