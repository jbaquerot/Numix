import { DIFFICULTIES, GAME_RULES, ROUND_PHASES } from "./constants.js";

const randomInteger = (minimum, maximum, random = Math.random) =>
  Math.floor(random() * (maximum - minimum + 1)) + minimum;

export function createRound(number, random = Math.random) {
  return {
    number,
    target: randomInteger(GAME_RULES.targetMin, GAME_RULES.targetMax, random),
    cards: Array.from({ length: GAME_RULES.cardsPerRound }, () =>
      randomInteger(GAME_RULES.cardMin, GAME_RULES.cardMax, random)),
    phase: ROUND_PHASES.prepared,
    answers: [],
  };
}

export function createGame({ players, totalRounds, difficulty }) {
  if (!Array.isArray(players) || players.length < GAME_RULES.minPlayers) throw new Error("Añade al menos una jugadora.");
  if (!Number.isInteger(totalRounds) || totalRounds < 1 || totalRounds > GAME_RULES.maxRounds) throw new Error("Elige entre 1 y 10 rondas.");
  if (!DIFFICULTIES[difficulty]) throw new Error("Elige una dificultad válida.");
  return { players: players.map((name, index) => ({ id: `p${index + 1}`, name, score: 0 })), settings: { totalRounds, difficulty, durationSeconds: DIFFICULTIES[difficulty].durationSeconds }, currentRound: null };
}

export function startRound(game, random = Math.random) {
  const number = game.currentRound ? game.currentRound.number + 1 : 1;
  if (number > game.settings.totalRounds) throw new Error("La partida ya ha terminado.");
  return { ...game, currentRound: createRound(number, random) };
}

export function scoreRound(target, answers) {
  const exact = answers.filter(({ result }) => result === target);
  const winners = exact.length ? exact : answers.filter(({ result }) =>
    Math.abs(result - target) === Math.min(...answers.map((answer) => Math.abs(answer.result - target))));
  return answers.map((answer) => ({
    ...answer,
    distance: Math.abs(answer.result - target),
    points: winners.some((winner) => winner.playerId === answer.playerId) ? (exact.length ? 2 : 1) : 0,
  }));
}

export function startResolving(round, durationSeconds, now = Date.now()) {
  return { ...round, phase: ROUND_PHASES.resolving, endsAt: now + durationSeconds * 1000 };
}

export function remainingSeconds(round, now = Date.now()) {
  return Math.max(0, Math.ceil((round.endsAt - now) / 1000));
}

export function finishResolving(round, now = Date.now()) {
  return remainingSeconds(round, now) === 0 ? { ...round, phase: ROUND_PHASES.entering } : round;
}
