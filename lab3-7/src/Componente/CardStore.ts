import { observable, action } from 'mobx';

export interface Card1 {
    title: string;
    content: string;
    owner: string;
}

export class CardStore {
    @observable
    cards: Card1[] = [];

    @observable
    loading: boolean = false;

    @action
    addCard(newCard: Card1) {
        this.cards.push(newCard);
        this.saveCardsToLocalStorage();
    }

    @action
    deleteCard(index: number) {
        this.cards.splice(index, 1);
        this.saveCardsToLocalStorage();
    }

    @action
    editCard(index: number, updatedCard: Card1) {
        this.cards[index] = updatedCard;
        this.saveCardsToLocalStorage();
    }

    @action
    setCards(newCards: Card1[]) {
        this.cards = newCards;
        this.saveCardsToLocalStorage();
    }

    private saveCardsToLocalStorage() {
        localStorage.setItem('cards', JSON.stringify(this.cards));
    }

    constructor() {
        this.loadCardsFromLocalStorage();
    }

    private loadCardsFromLocalStorage() {
        const savedCards = localStorage.getItem('cards');
        if (savedCards) {
            this.cards = JSON.parse(savedCards);
        }
    }
}

// Utilizăm hook-ul pentru a returna o instanță a magazinului
export function useCardStore() {
    return new CardStore();
}
