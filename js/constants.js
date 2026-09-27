/** Reglas y valores compartidos de Numix. */
export const GAME_RULES = Object.freeze({
  minPlayers: 1,
  minRounds: 1,
  maxRounds: 10,
  cardsPerRound: 4,
  targetMin: 1,
  targetMax: 100,
  cardMin: 1,
  cardMax: 10,
});

export const DIFFICULTIES = Object.freeze({
  easy: Object.freeze({ label: "Fácil", durationSeconds: 60 }),
  medium: Object.freeze({ label: "Medio", durationSeconds: 45 }),
  hard: Object.freeze({ label: "Difícil", durationSeconds: 30 }),
});

export const ROUND_PHASES = Object.freeze({
  prepared: "prepared",
  resolving: "resolving",
  entering: "entering",
  results: "results",
  finished: "finished",
});

export const OPERATORS = Object.freeze(["+", "-", "*", "/"]);
