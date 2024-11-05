export class PokerHand {
  static evaluate(cards, gameRules) {
    cards.sort((a, b) => b.rank - a.rank);

    const rankCounts = {};
    cards.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });
    const frequencies = Object.values(rankCounts).sort((a, b) => b - a);
    if (frequencies.length < 2) {
      frequencies.push(0);
    }

    console.log("Played hand:", cards);
    console.log("Frequencies:", frequencies);

    const isFlushRank = gameRules.isFlush(cards, frequencies);
    const isStraightRank = gameRules.isStraight(cards, frequencies);
    const isFullHouseRank = gameRules.isFullHouse(cards, frequencies);
    const nOfAKindRank = gameRules.getNOfAKind(cards, frequencies);
    const pairsRank = gameRules.isNTuples(cards, frequencies);

    if (isFlushRank.matches && isStraightRank.matches) {
      return "Straight Flush";
    }
    if (nOfAKindRank.matches && nOfAKindRank.value === 4) {
      return this.stringifyNOfAKind(nOfAKindRank.value);
    }
    if (isFullHouseRank.matches) {
      return "Full House";
    }
    if (isFlushRank.matches) {
      return "Flush";
    }
    if (isStraightRank.matches) {
      return "Straight";
    }
    if (nOfAKindRank.matches && nOfAKindRank.value === 3) {
      return this.stringifyNOfAKind(nOfAKindRank.value);
    }
    if (pairsRank.matches) {
      if (pairsRank.value >= 2) {
        return `${this.stringifyNumberOfTuples(pairsRank.value)} Pair`;
      } else {
        return this.stringifyNOfAKind(nOfAKindRank.value);
      }
    }
    return "High Card";
  }

  static stringifyNumberOfTuples(n) {
    const values = {
      2: "Two",
      3: "Three",
      4: "Four",
      5: "Five",
      6: "Six",
      7: "Seven",
      8: "Eight",
      9: "Nine",
    };
    return `${values[n]}`;
  }

  static stringifyNOfAKind(n) {
    const values = {
      2: "Pair",
      3: "Three",
      4: "Four",
      5: "Five",
      6: "Six",
      7: "Seven",
      8: "Eight",
      9: "Nine",
      10: "Ten",
      11: "Eleven",
      12: "Twelve",
    };
    return n === 2 ? `${values[n]}` : `${values[n]} of a Kind`;
  }
}
