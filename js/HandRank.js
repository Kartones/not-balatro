export class HandRank {
  matches;
  rank;
  // `value` is used for n in n-of-a-kind, number of pairs, etc.
  value;

  constructor(matches, rank, value) {
    this.matches = matches;
    this.rank = rank;
    this.value = value;
  }
}
