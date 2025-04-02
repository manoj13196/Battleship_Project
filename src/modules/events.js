import GameController from "../modules/gamecontroller.js";
import createDOMController from "../modules/dom.js";

const Events = (() => {
  let game = new GameController();
  const domController = createDOMController(game);

  function setupEventListeners() {
    document.getElementById("start-game").addEventListener("click", () => {
      domController.renderBoards();
    });
  }

  return { setupEventListeners };
})();

export default Events;
