import { createGame, finishResolving, remainingSeconds, startResolving, startRound } from "./game.js";
import { evaluateExpression, parseExpression, validateCards } from "./expression.js";
import { renderAnswerForms, renderRound, renderSetup } from "./ui.js";

export function createApp(render) {
  let game = null;
  let timerId = null;
  const notify = () => render(game);

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function tick() {
    if (!game?.currentRound) return;
    const currentRound = finishResolving(game.currentRound);
    if (currentRound !== game.currentRound) {
      game = { ...game, currentRound };
      stopTimer();
    }
    notify();
  }

  return {
    getState: () => game,
    createGame(settings) {
      stopTimer();
      game = createGame(settings);
      notify();
    },
    startRound() {
      game = startRound(game);
      game = { ...game, currentRound: startResolving(game.currentRound, game.settings.durationSeconds) };
      stopTimer();
      timerId = setInterval(tick, 250);
      notify();
    },
    dispose: stopTimer,
  };
}

document.documentElement.dataset.app = "numix";

const setupContainer = document.querySelector("#setup-content");
const roundContainer = document.querySelector("#round-content");
const setupView = document.querySelector("#setup-view");
const roundView = document.querySelector("#round-view");

const app = createApp((game) => {
  if (!game) return;
  setupView.hidden = true;
  roundView.hidden = false;
  const round = game.currentRound;
  renderRound(roundContainer, game, remainingSeconds(round));
  if (round.phase === "entering") renderAnswerForms(roundContainer, game, (playerId, source) => {
    const tree = parseExpression(source);
    validateCards(tree, round.cards);
    return evaluateExpression(tree);
  });
});

renderSetup(setupContainer, (settings) => {
  app.createGame(settings);
  app.startRound();
});
