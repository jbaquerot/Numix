import { createGame, markReady, remainingSeconds, scoreRound, startResolving, startRound } from "./game.js";
import { evaluateExpression, parseExpression, validateCards } from "./expression.js";
import { renderFinalResults, renderRound, renderRoundResults, renderScoreboard, renderSetup, updateHourglass } from "./ui.js";

export function createApp(render, onTimerTick) {
  let game = null;
  let timerId = null;
  let finalShown = false;
  const notify = () => render(game, finalShown);

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function pendingPlayerIds() {
    const round = game.currentRound;
    return game.players
      .map((player) => player.id)
      .filter((id) => !round.readyPlayerIds.includes(id) && !round.answers.some((answer) => answer.playerId === id));
  }

  function completeRound(answers) {
    const scored = scoreRound(game.currentRound.target, answers);
    const completedRound = { ...game.currentRound, phase: "results", answers: scored };
    game = {
      ...game,
      roundHistory: [...(game.roundHistory ?? []), completedRound],
      players: game.players.map((player) => ({ ...player, score: player.score + (scored.find((answer) => answer.playerId === player.id)?.points ?? 0) })),
      currentRound: completedRound,
    };
  }

  function tick() {
    if (!game?.currentRound) return;
    if (remainingSeconds(game.currentRound) > 0) {
      onTimerTick?.(remainingSeconds(game.currentRound), game.settings.durationSeconds);
      return;
    }
    stopTimer();
    if (game.currentRound.readyPlayerIds.length === 0) completeRound([]);
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
    markReady(playerId) {
      if (remainingSeconds(game.currentRound) === 0) return;
      game = { ...game, currentRound: markReady(game.currentRound, playerId) };
      if (pendingPlayerIds().length === 0) stopTimer();
      notify();
    },
    submitAnswer(playerId, source) {
      const tree = parseExpression(source);
      validateCards(tree, game.currentRound.cards);
      const result = evaluateExpression(tree);
      const answers = [...game.currentRound.answers, { playerId, expression: source, result }];
      game = { ...game, currentRound: { ...game.currentRound, answers } };
      if (answers.length === game.currentRound.readyPlayerIds.length) completeRound(answers);
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
const scoreboardContainer = document.querySelector("#scoreboard-content");
const setupView = document.querySelector("#setup-view");
const roundView = document.querySelector("#round-view");
const finalView = document.querySelector("#final-view");
const scoreboardView = document.querySelector("#scoreboard-view");

function captureDrafts(container) {
  const drafts = {};
  container.querySelectorAll("form.answer-form input[name=expression]").forEach((input) => {
    if (!input.disabled && input.value) drafts[input.closest("form").dataset.playerId] = input.value;
  });
  return drafts;
}

function restoreDrafts(container, drafts) {
  Object.entries(drafts).forEach(([playerId, value]) => {
    const input = container.querySelector(`form.answer-form[data-player-id="${playerId}"] input[name=expression]`);
    if (input) input.value = value;
  });
}

const app = createApp(
  (game, finalShown) => {
    if (!game?.currentRound) {
      setupView.hidden = false;
      roundView.hidden = true;
      finalView.hidden = true;
      scoreboardView.hidden = true;
      return;
    }
    const round = game.currentRound;
    const isLastRound = round.number === game.settings.totalRounds;
    const isGameOver = round.phase === "results" && isLastRound && finalShown;
    setupView.hidden = true;
    roundView.hidden = isGameOver;
    finalView.hidden = !isGameOver;
    scoreboardView.hidden = false;
    renderScoreboard(scoreboardContainer, game.players);
    if (isGameOver) {
      renderFinalResults(finalContainer, game.players, game.roundHistory, () => app.restart());
      return;
    }
    const drafts = captureDrafts(roundContainer);
    if (round.phase === "resolving") renderRound(roundContainer, game, remainingSeconds(round), app.markReady, app.submitAnswer);
    if (round.phase === "results") renderRoundResults(roundContainer, round.answers.map((answer) => ({ ...answer, player: game.players.find((player) => player.id === answer.playerId) })), game.roundHistory, isLastRound ? () => app.showFinal() : () => app.startRound(), isLastRound);
    restoreDrafts(roundContainer, drafts);
  },
  (seconds, durationSeconds) => {
    const timerEl = roundContainer.querySelector(".timer");
    if (timerEl) timerEl.textContent = `${seconds} s`;
    updateHourglass(roundContainer, durationSeconds > 0 ? seconds / durationSeconds : 0);
  },
);

renderSetup(setupContainer, (settings) => {
  app.createGame(settings);
  app.startRound();
});
