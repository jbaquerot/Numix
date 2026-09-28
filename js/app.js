import { createGame, finishResolving, remainingSeconds, scoreRound, startResolving, startRound } from "./game.js";
import { evaluateExpression, parseExpression, validateCards } from "./expression.js";
import { renderAnswerForms, renderFinalResults, renderRound, renderRoundResults, renderSetup } from "./ui.js";

export function createApp(render) {
  let game = null;
  let timerId = null;
  let finalShown = false;
  const notify = () => render(game, finalShown);

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
      finalShown = false;
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
    finishRoundEarly() {
      stopTimer();
      game = { ...game, currentRound: { ...game.currentRound, phase: "entering" } };
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
        const completedRound = { ...game.currentRound, phase: "results", answers: scored };
        game = { ...game, roundHistory: [...(game.roundHistory ?? []), completedRound], players: game.players.map((player) => ({ ...player, score: player.score + (scored.find((answer) => answer.playerId === player.id)?.points ?? 0) })), currentRound: completedRound };
      }
      notify();
      return result;
    },
    showFinal() {
      finalShown = true;
      notify();
    },
    restart() {
      stopTimer();
      game = null;
      finalShown = false;
      notify();
    },
    dispose: stopTimer,
  };
}

document.documentElement.dataset.app = "numix";

const setupContainer = document.querySelector("#setup-content");
const roundContainer = document.querySelector("#round-content");
const finalContainer = document.querySelector("#final-content");
const setupView = document.querySelector("#setup-view");
const roundView = document.querySelector("#round-view");
const finalView = document.querySelector("#final-view");

const app = createApp((game, finalShown) => {
  if (!game?.currentRound) {
    setupView.hidden = false;
    roundView.hidden = true;
    finalView.hidden = true;
    return;
  }
  const round = game.currentRound;
  const isLastRound = round.number === game.settings.totalRounds;
  const isGameOver = round.phase === "results" && isLastRound && finalShown;
  setupView.hidden = true;
  roundView.hidden = isGameOver;
  finalView.hidden = !isGameOver;
  if (isGameOver) {
    renderFinalResults(finalContainer, game.players, () => app.restart());
    return;
  }
  renderRound(roundContainer, game, remainingSeconds(round), app.finishRoundEarly);
  if (round.phase === "entering") renderAnswerForms(roundContainer, game, app.submitAnswer);
  if (round.phase === "results") renderRoundResults(roundContainer, round.answers.map((answer) => ({ ...answer, playerName: game.players.find((player) => player.id === answer.playerId).name })), game.players, game.roundHistory, isLastRound ? () => app.showFinal() : () => app.startRound(), isLastRound);
});

renderSetup(setupContainer, (settings) => {
  app.createGame(settings);
  app.startRound();
});
