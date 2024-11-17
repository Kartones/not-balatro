import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { GameRules } from "../js/GameRules.js";
import { HandRank } from "../js/HandRank.js";

describe("GameRules", () => {
  const emptyCardFrequencies = [];

  describe("Basic Rules", () => {
    it("has by default a hand size of 5", () => {
      const gameRules = new GameRules();
      assert.strictEqual(gameRules.handSize, 5);
    });

    it("has by default a play hand size of 5", () => {
      const gameRules = new GameRules();
      assert.strictEqual(gameRules.playHandSize, 5);
    });

    it("has by default 1 redraw available", () => {
      const gameRules = new GameRules();
      assert.strictEqual(gameRules.redrawsAvailable, 1);
    });

    it("has a deck size of 52", () => {
      const gameRules = new GameRules();
      assert.strictEqual(gameRules.deckSize, 52);
    });

    it("allows to mutate the hand size", () => {
      const gameRules = new GameRules();
      gameRules.handSize = 7;
      assert.strictEqual(gameRules.handSize, 7);
    });

    it("allows to mutate the play hand size", () => {
      const gameRules = new GameRules();
      gameRules.playHandSize = 7;
      assert.strictEqual(gameRules.playHandSize, 7);
    });

    it("allows to mutate the redraws available", () => {
      const gameRules = new GameRules();
      gameRules.redrawsAvailable = 3;
      assert.strictEqual(gameRules.redrawsAvailable, 3);
    });

    it("allows to add new cards to the deck", () => {
      const gameRules = new GameRules();
      gameRules._deckCards.push({ rank: 1, suit: "suit-A" });
      assert.strictEqual(gameRules.deckSize, 53);
      gameRules._deckCards.push({ rank: 2, suit: "suit-A" });
      assert.strictEqual(gameRules.deckSize, 54);
    });

    it("allow to add any card multiple times to the deck", () => {
      const gameRules = new GameRules();
      gameRules._deckCards.push({ rank: 1, suit: "suit-A" });
      gameRules._deckCards.push({ rank: 1, suit: "suit-A" });
      gameRules._deckCards.push({ rank: 1, suit: "suit-A" });
      assert.strictEqual(gameRules.deckSize, 55);
    });
  });

  describe("Scoring Rules", () => {
    describe("Flush", () => {
      it("is not a flush if played less than 5 cards", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isFlush(sortedCards, emptyCardFrequencies);
        assert.deepEqual(handRank, new HandRank(false, 0, 0));
      });

      it("is not a flush if cards belong to more than one suite", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 5, suit: "suit-B" },
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isFlush(sortedCards, emptyCardFrequencies);
        assert.deepEqual(handRank, new HandRank(false, 0, 0));
      });

      it("is a flush if all cards belong to the same suite - default play hand size", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 5, suit: "suit-A" },
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isFlush(sortedCards, emptyCardFrequencies);
        assert.deepEqual(
          handRank,
          new HandRank(true, 5 + 4 + 3 + 2 + 1, gameRules.playHandSize)
        );
      });

      it("is a flush if all cards belong to the same suite - mutated play hand size", () => {
        const gameRules = new GameRules();
        gameRules.playHandSize = 7;
        const sortedCards = [
          { rank: 9, suit: "suit-A" },
          { rank: 8, suit: "suit-A" },
          { rank: 5, suit: "suit-A" },
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isFlush(sortedCards, emptyCardFrequencies);
        assert.deepEqual(
          handRank,
          new HandRank(true, 9 + 8 + 5 + 4 + 3 + 2 + 1, gameRules.playHandSize)
        );
      });
    });

    describe("Straight", () => {
      it("is not a straight if played less than 5 cards", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isStraight(
          sortedCards,
          emptyCardFrequencies
        );
        assert.deepEqual(handRank, new HandRank(false, 0, 0));
      });

      it("is not a straigth if rank of all played cards is not consecutive", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 6, suit: "suit-A" },
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isStraight(
          sortedCards,
          emptyCardFrequencies
        );
        assert.deepEqual(handRank, new HandRank(false, 0, 0));
      });

      it("is a straigth if rank of all played cards is consecutive - default play hand size", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 5, suit: "suit-A" },
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isStraight(
          sortedCards,
          emptyCardFrequencies
        );
        assert.deepEqual(
          handRank,
          new HandRank(true, 5 + 4 + 3 + 2 + 1, gameRules.playHandSize)
        );
      });

      it("is a straigth if rank of all played cards is consecutive - mutated play hand size", () => {
        const gameRules = new GameRules();
        gameRules.playHandSize = 7;
        const sortedCards = [
          { rank: 7, suit: "suit-A" },
          { rank: 6, suit: "suit-A" },
          { rank: 5, suit: "suit-A" },
          { rank: 4, suit: "suit-A" },
          { rank: 3, suit: "suit-A" },
          { rank: 2, suit: "suit-A" },
          { rank: 1, suit: "suit-A" },
        ];

        const handRank = gameRules.isStraight(
          sortedCards,
          emptyCardFrequencies
        );
        assert.deepEqual(
          handRank,
          new HandRank(true, 7 + 6 + 5 + 4 + 3 + 2 + 1, gameRules.playHandSize)
        );
      });
    });

    describe("Full House", () => {
      it("is not a full house if played less than 5 cards", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 3, suit: "suit-A" },
          { rank: 3, suit: "suit-B" },
          { rank: 2, suit: "suit-A" },
          { rank: 2, suit: "suit-B" },
        ];
        const cardFrequencies = [2, 2];

        const handRank = gameRules.isFullHouse(sortedCards, cardFrequencies);
        assert.deepEqual(handRank, new HandRank(false, 0, 0));
      });

      it("is not a full house if there are not 3 & 2 cards of the same rank", () => {
        const gameRules = new GameRules();

        let handRank = gameRules.isFullHouse(
          [
            { rank: 3, suit: "suit-A" },
            { rank: 3, suit: "suit-B" },
            { rank: 2, suit: "suit-A" },
            { rank: 2, suit: "suit-B" },
            { rank: 1, suit: "suit-A" },
          ],
          [2, 2, 1]
        );
        assert.deepEqual(handRank, new HandRank(false, 0, 0));

        handRank = gameRules.isFullHouse(
          [
            { rank: 3, suit: "suit-A" },
            { rank: 3, suit: "suit-B" },
            { rank: 2, suit: "suit-A" },
            { rank: 2, suit: "suit-B" },
            { rank: 2, suit: "suit-C" },
          ],
          [2, 3]
        );
        assert.deepEqual(handRank, new HandRank(false, 0, 0));

        handRank = gameRules.isFullHouse(
          [
            { rank: 3, suit: "suit-A" },
            { rank: 3, suit: "suit-B" },
            { rank: 3, suit: "suit-C" },
            { rank: 2, suit: "suit-A" },
            { rank: 1, suit: "suit-A" },
          ],
          [3, 1, 1]
        );
        assert.deepEqual(handRank, new HandRank(false, 0, 0));
      });

      it("is a full house if there are 3 & 2 cards of the same rank - default play hand size", () => {
        const gameRules = new GameRules();
        const sortedCards = [
          { rank: 3, suit: "suit-A" },
          { rank: 3, suit: "suit-B" },
          { rank: 3, suit: "suit-C" },
          { rank: 2, suit: "suit-A" },
          { rank: 2, suit: "suit-B" },
        ];
        const cardFrequencies = [3, 2];

        const handRank = gameRules.isFullHouse(sortedCards, cardFrequencies);
        assert.deepEqual(
          handRank,
          new HandRank(true, 3 + 3 + 3 + 2 + 2, gameRules.playHandSize)
        );
      });

      it("is a full house if there are 3 & 2 cards of the same rank - mutated play hand size (even size)", () => {
        const gameRules = new GameRules();
        gameRules.playHandSize = 6;
        const sortedCards = [
          { rank: 3, suit: "suit-A" },
          { rank: 3, suit: "suit-B" },
          { rank: 3, suit: "suit-C" },
          { rank: 2, suit: "suit-A" },
          { rank: 2, suit: "suit-B" },
          { rank: 2, suit: "suit-C" },
        ];
        const cardFrequencies = [3, 3];

        const handRank = gameRules.isFullHouse(sortedCards, cardFrequencies);
        assert.deepEqual(
          handRank,
          new HandRank(true, 3 + 3 + 3 + 2 + 2 + 2, gameRules.playHandSize)
        );
      });

      it("is a full house if there are 3 & 3 cards of the same rank - mutated play hand size (odd size)", () => {
        const gameRules = new GameRules();
        gameRules.playHandSize = 7;
        const sortedCards = [
          { rank: 3, suit: "suit-A" },
          { rank: 3, suit: "suit-B" },
          { rank: 3, suit: "suit-C" },
          { rank: 3, suit: "suit-D" },
          { rank: 2, suit: "suit-A" },
          { rank: 2, suit: "suit-B" },
          { rank: 2, suit: "suit-C" },
        ];
        const cardFrequencies = [4, 3];

        const handRank = gameRules.isFullHouse(sortedCards, cardFrequencies);
        assert.deepEqual(
          handRank,
          new HandRank(true, 3 + 3 + 3 + 3 + 2 + 2 + 2, gameRules.playHandSize)
        );
      });
    });
  });
});
