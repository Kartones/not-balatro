import { HandRank } from "./HandRank.js";
import { Card } from "./Card.js";

const DEFAULT_HAND_SIZE = 5;
const DEFAULT_REDRAWS = 1;

export class GameRules {
  handSize;
  playHandSize;
  redrawsAvailable;
  _deckCards;

  constructor() {
    this.handSize = DEFAULT_HAND_SIZE;
    this.playHandSize = DEFAULT_HAND_SIZE;
    this.redrawsAvailable = DEFAULT_REDRAWS;
    this._deckCards = this._buildDeckCards();
  }

  _buildDeckCards() {
    const suits = ["hearts", "clubs", "diamonds", "spades"];
    const ranks = Array.from({ length: 13 }, (_, i) => i + 2);

    const cards = [];

    for (let suit of suits) {
      for (let rank of ranks) {
        cards.push(new Card(rank, suit));
      }
    }

    return cards;
  }

  deckCards() {
    const cards = [];

    this._deckCards.forEach((card) => {
      cards.push(new Card(card.rank, card.suit));
    });

    return cards;
  }

  get deckSize() {
    return this._deckCards.length;
  }

  // TODO: probably worth extracting to a separate `PokerHandScoring` or similarly named class
  // https://en.wikipedia.org/wiki/List_of_poker_hands

  isFlush(sortedCards, cardFrequencies) {
    const matches =
      sortedCards.length === this.playHandSize &&
      sortedCards.every((card) => card.suit === sortedCards[0].suit);

    if (!matches) {
      return new HandRank(false, 0, 0);
    }

    return new HandRank(
      matches,
      this._calculateRank(sortedCards, cardFrequencies, sortedCards.length),
      sortedCards.length
    );
  }

  isStraight(sortedCards, cardFrequencies) {
    const matches =
      sortedCards.length === this.playHandSize &&
      sortedCards.every((card, i) => {
        if (i === 0) return true;
        return card.rank === sortedCards[i - 1].rank - 1;
      });

    if (!matches) {
      return new HandRank(false, 0, 0);
    }

    return new HandRank(
      matches,
      this._calculateRank(sortedCards, cardFrequencies, sortedCards.length),
      sortedCards.length
    );
  }

  isFullHouse(sortedCards, cardFrequencies) {
    const evenPlayHandSize = this.playHandSize % 2 === 0;

    // base case: 3 & 2, but for even play hand sizes, 3 & 3 and so on
    const matches =
      cardFrequencies[0] >= Math.ceil(this.playHandSize / 2) &&
      cardFrequencies[1] >= Math.floor(this.playHandSize / 2) &&
      cardFrequencies[0] ===
        (evenPlayHandSize ? cardFrequencies[1] : cardFrequencies[1] + 1);

    const value = cardFrequencies[0] + cardFrequencies[1];

    if (!matches) {
      return new HandRank(false, 0, 0);
    }

    return new HandRank(
      matches,
      this._calculateRank(sortedCards, cardFrequencies, value),
      value
    );
  }

  getNOfAKind(sortedCards, cardFrequencies, frequencyIndex = 0) {
    const frequency = cardFrequencies[frequencyIndex];
    const matches = frequency > 1;

    if (!matches) {
      return new HandRank(false, 0, 0);
    }

    const rank = this._calculateRank(sortedCards, cardFrequencies, frequency);
    return new HandRank(matches, rank, frequency);
  }

  // TODO: support any number of pairs
  isNTuples(sortedCards, cardFrequencies) {
    const nOfAKindRank = this.getNOfAKind(sortedCards, cardFrequencies);

    const isTwoPairs =
      nOfAKindRank.matches &&
      nOfAKindRank.value === 2 &&
      this.getNOfAKind(sortedCards, cardFrequencies, 1).value === 2;
    const isPair = nOfAKindRank.matches;
    const rank = this._calculateRank(
      sortedCards,
      cardFrequencies,
      isTwoPairs ? 4 : 2
    );

    return new HandRank(isTwoPairs || isPair, rank, isTwoPairs ? 2 : 1);
  }

  // TODO: check if ranking is correctly calculated (other than the current naive sum of card ranks)
  _calculateRank(sortedCards, cardFrequencies, n) {
    let rank = 0;
    for (let i = 0; i < n; i++) {
      rank += sortedCards[i].rank;
    }
    return rank;
  }
}
