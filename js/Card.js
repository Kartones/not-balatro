import { VISUAL_CARD_WIDTH, VISUAL_CARD_HEIGHT } from "./constants.js";

export class Card {
  rank;
  suit;

  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  getBackgroundPosition() {
    const suitOrder = { hearts: 0, clubs: 1, diamonds: 2, spades: 3 };
    const rankOffset = (this.rank - 2) * VISUAL_CARD_WIDTH;
    const suitOffset = suitOrder[this.suit] * VISUAL_CARD_HEIGHT;
    return `-${rankOffset}px -${suitOffset}px`;
  }
}
