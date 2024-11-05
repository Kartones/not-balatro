export class Deck {
  _randomFn;
  gamerules;
  cards;

  constructor(gamerules, randomFn = Math.random) {
    this._randomFn = randomFn;
    this.gameRules = gamerules;
    this.reset();
  }

  reset() {
    this.cards = [...this.gameRules.deckCards()];
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(this._randomFn() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(n) {
    return this.cards.splice(0, n);
  }

  remaining() {
    return this.cards.length;
  }
}
