import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { Deck } from "../js/Deck.js";

const randomFn = () => 0;

const cardsFixture = () => [
  { rank: 1, suit: "suit-A" },
  { rank: 1, suit: "suit-B" },
  { rank: 2, suit: "suit-A" },
];

describe("Deck", () => {
  it("cards are set via GameRules", () => {
    const cards = cardsFixture();
    const gameRulesMock = {
      deckCards: () => cards,
    };

    const deck = new Deck(gameRulesMock, randomFn);

    assert.strictEqual(deck.cards.length, 3);
    assert.deepStrictEqual(deck.cards, cards);
  });

  it("removes cards from deck when dealt", () => {
    const cards = cardsFixture();
    const gameRulesMock = {
      deckCards: () => cards,
    };

    const deck = new Deck(gameRulesMock, randomFn);

    const dealt = deck.deal(2);

    assert.strictEqual(dealt.length, 2);
    assert.strictEqual(deck.cards.length, 1);
    assert.deepStrictEqual(deck.cards[0], cards[2]);
  });

  it("returns remaining cards", () => {
    const cards = cardsFixture();
    const gameRulesMock = {
      deckCards: () => cards,
    };

    const deck = new Deck(gameRulesMock, randomFn);

    deck.deal(2);

    assert.strictEqual(deck.remaining(), 1);
  });

  it("shuffles cards", () => {
    const cards = cardsFixture();
    const gameRulesMock = {
      deckCards: () => cards,
    };

    const deck = new Deck(gameRulesMock, randomFn);

    const originalOrder = [...deck.cards];

    deck.shuffle();

    assert.notDeepStrictEqual(deck.cards, originalOrder);
  });

  it("shuffing is deterministic when using the same randomFn", () => {
    const cards = cardsFixture();
    const gameRulesMock = {
      deckCards: () => cards,
    };

    const deck1 = new Deck(gameRulesMock, randomFn);
    const deck2 = new Deck(gameRulesMock, randomFn);

    deck1.shuffle();
    deck2.shuffle();

    assert.deepStrictEqual(deck1.cards, deck2.cards);
  });

  it("can reset the deck", () => {
    const cards = cardsFixture();
    const gameRulesMock = {
      deckCards: () => cards,
    };

    const deck = new Deck(gameRulesMock, randomFn);

    deck.deal(2);
    deck.reset();

    assert.strictEqual(deck.cards.length, 3);
    // Should also reset the order to the original one provided via GameRules
    assert.deepStrictEqual(deck.cards, cards);
  });
});
