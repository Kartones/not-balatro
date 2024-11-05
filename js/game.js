import { VISUAL_CARD_BACK, VISUAL_CARDS_DECK } from "./constants.js";

import { GameRules } from "./GameRules.js";
import { Deck } from "./Deck.js";
import { PokerHand } from "./PokerHand.js";
import { GameUI } from "./GameUI.js";

export class Game {
  gameRules;
  gameUI;
  deck;
  playerHand;
  selectedCards;
  redrawsAvailable;
  hasPlayedHand;

  constructor() {
    this.gameRules = new GameRules();
    this.gameUI = new GameUI();
    this.selectedCards = new Set();
    this.reset();

    this.gameUI.setupEventListeners(
      this.dealNewHand.bind(this),
      this.drawNewCards.bind(this),
      this.evaluateHand.bind(this),
      this.sortHand.bind(this)
    );

    this.updateControls();
  }

  cheat() {
    this.gameRules.handSize = 14;
    this.gameRules.redrawsAvailable = 12;
    this.gameRules.playHandSize = 10;
  }

  reset() {
    this.deck = new Deck(this.gameRules);
    this.deck.shuffle();
    this.playerHand = [];
    this.selectedCards.clear();
    this.redrawsAvailable = this.gameRules.redrawsAvailable;
    this.hasPlayedHand = false;
    document.getElementById("message").textContent = "";
  }

  dealNewHand() {
    this.reset();
    this.playerHand = this.deck.deal(this.gameRules.handSize);

    this.sortHand(true);
  }

  // aka "discard"
  drawNewCards() {
    const newCards = this.deck.deal(this.selectedCards.size);
    let newCardIndex = 0;

    this.playerHand = this.playerHand.map((card, index) => {
      if (this.selectedCards.has(index)) {
        const newCard = newCards[newCardIndex++];
        return newCard;
      }
      return card;
    });

    const newCardIndices = Array.from(this.selectedCards);

    this.selectedCards.clear();
    this.renderHand(false, newCardIndices);
    this.redrawsAvailable--;
    this.updateControls();
  }

  evaluateHand() {
    this.hasPlayedHand = true;
    this.updateControls();

    const playedHand = this.playerHand.filter((_, index) =>
      this.selectedCards.has(index)
    );
    const result = PokerHand.evaluate(playedHand, this.gameRules);
    document.getElementById("message").textContent = `Your Hand: ${result}`;
  }

  sortHand(isNewDeal = false) {
    this.playerHand.sort((a, b) => b.rank - a.rank);
    this.selectedCards.clear();
    this.renderHand(
      isNewDeal,
      Array.from({ length: this.playerHand.length }, (_, i) => i)
    );
    this.updateControls();
  }

  toggleCardSelection(index) {
    if (this.playerHand.length === 0) {
      return;
    }

    if (this.selectedCards.has(index)) {
      this.selectedCards.delete(index);
    } else {
      this.selectedCards.add(index);
    }
    this.renderHand(false);
    this.updateControls();
  }

  updateControls() {
    const drawButton = document.getElementById("draw");
    const evaluateButton = document.getElementById("evaluate");
    const sortButton = document.getElementById("sort");

    drawButton.disabled =
      this.hasPlayedHand ||
      this.selectedCards.size === 0 ||
      this.redrawsAvailable === 0 ||
      this.deck.remaining() < this.selectedCards.size;

    evaluateButton.disabled =
      this.hasPlayedHand ||
      this.playerHand.length == 0 ||
      this.selectedCards.size === 0 ||
      this.selectedCards.size > this.gameRules.playHandSize;

    sortButton.disabled = this.hasPlayedHand || this.playerHand.length == 0;

    document.getElementById(
      "redraws-available"
    ).textContent = `Discards: ${this.redrawsAvailable}`;
    document.getElementById(
      "play-hand-size"
    ).textContent = `Play Hand Size: ${this.gameRules.playHandSize}`;
    document.getElementById(
      "remaining-deck-cards"
    ).textContent = `Deck Cards: ${this.deck.remaining()}/${
      this.gameRules.deckSize
    }`;
  }

  renderHand(isNewDeal, newCardIndices = []) {
    const handElement = document.getElementById("player-hand");

    if (isNewDeal) {
      handElement.innerHTML = "";
    }

    this.playerHand.forEach((card, index) => {
      const cardBackground = isNewDeal
        ? document.createElement("div")
        : document.getElementById("player-hand").children[index];
      const cardElement = isNewDeal
        ? document.createElement("img")
        : cardBackground.children[0];

      if (isNewDeal || newCardIndices.includes(index)) {
        cardElement.src = VISUAL_CARD_BACK;
        cardElement.className = "card-base card";
        if (isNewDeal) {
          cardBackground.appendChild(cardElement);

          cardBackground.className = "card-base card-container";
        } else {
          cardElement.style.objectPosition = "0px 0px";
          cardBackground.classList.remove("card-background");
        }

        setTimeout(() => {
          cardElement.src = VISUAL_CARDS_DECK;
          cardElement.className = `card-base card ${card.suit}`;
          cardElement.style.objectPosition = card.getBackgroundPosition();
          cardBackground.classList.add("card-background");
        }, 500);

        if (isNewDeal) {
          cardElement.addEventListener("click", () =>
            this.toggleCardSelection(index)
          );
          handElement.appendChild(cardBackground);
        }
      }

      if (this.selectedCards.has(index)) {
        cardBackground.classList.add("selected");
      } else {
        cardBackground.classList.remove("selected");
      }
    });
  }
}
