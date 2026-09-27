import { createGame, finishResolving, startResolving, startRound } from "./game.js";

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
