import { createGame, finishResolving, remainingSeconds, scoreRound, startResolving, startRound } from "./game.js";
import { evaluateExpression, parseExpression, validateCards } from "./expression.js";
import { renderAnswerForms, renderRound, renderRoundResults, renderSetup } from "./ui.js";

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
    submitAnswer(playerId, source) {
      const tree = parseExpression(source);
      validateCards(tree, game.currentRound.cards);
      const result = evaluateExpression(tree);
      const answers = [...game.currentRound.answers, { playerId, expression: source, result }];
      game = { ...game, currentRound: { ...game.currentRound, answers } };
      if (answers.length === game.players.length) {
        const scored = scoreRound(game.currentRound.target, answers);
        game = { ...game, players: game.players.map((player) => ({ ...player, score: player.score + (scored.find((answer) => answer.playerId === player.id)?.points ?? 0) })), currentRound: { ...game.currentRound, phase: "results", answers: scored } };
      }
      notify();
      return result;
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
  if (!game.currentRound) return;
  setupView.hidden = true;
  roundView.hidden = false;
  const round = game.currentRound;
  renderRound(roundContainer, game, remainingSeconds(round));
  if (round.phase === "entering") renderAnswerForms(roundContainer, game, app.submitAnswer);
  if (round.phase === "results") renderRoundResults(roundContainer, round.answers.map((answer) => ({ ...answer, playerName: game.players.find((player) => player.id === answer.playerId).name })), game.players, () => app.startRound());
});

renderSetup(setupContainer, (settings) => {
  app.createGame(settings);
  app.startRound();
});
