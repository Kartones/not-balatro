export class GameUI {
  setupEventListeners(dealNewHand, drawNewCards, evaluateHand, sortHand) {
    document.getElementById("deal").addEventListener("click", dealNewHand);
    document.getElementById("draw").addEventListener("click", drawNewCards);
    document.getElementById("evaluate").addEventListener("click", evaluateHand);
    document.getElementById("sort").addEventListener("click", sortHand);
  }
}
