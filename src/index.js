import "../styles/styles.css"; // Import the CSS file
import GameController from "../src/modules/gamecontroller.js";
import createDOMController from "../src/modules/dom.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new GameController();
  const domController = createDOMController(game);

  domController.renderBoards();

  // Rotate ship button
  const rotateButton = document.getElementById("rotate-ship");
  rotateButton.addEventListener("click", () => {
    game.rotateShip();
    alert(`Ship orientation: ${game.isVertical ? "Vertical" : "Horizontal"}`);
  });

  // Start game button
  const startButton = document.getElementById("start-game");
  startButton.addEventListener("click", () => {
    if (!game.isGameStarted) {
      game.startGame();
      domController.updateGameInfo(); // Update game info when the game starts
    }
  });
});
