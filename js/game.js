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
    readyPlayerIds: [],
  };
}

export function createGame({ players, totalRounds, difficulty }) {
  if (!Array.isArray(players) || players.length < GAME_RULES.minPlayers || players.length > GAME_RULES.maxPlayers) throw new Error("Elige entre 1 y 4 jugadoras.");
  if (!Number.isInteger(totalRounds) || totalRounds < GAME_RULES.minRounds || totalRounds > GAME_RULES.maxRounds) throw new Error("Elige entre 5 y 10 rondas.");
  if (!DIFFICULTIES[difficulty]) throw new Error("Elige una dificultad válida.");
  return { players: players.map(({ name, icon }, index) => ({ id: `p${index + 1}`, name, icon, score: 0 })), settings: { totalRounds, difficulty, durationSeconds: DIFFICULTIES[difficulty].durationSeconds }, currentRound: null };
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

export function markReady(round, playerId) {
  return round.readyPlayerIds.includes(playerId) ? round : { ...round, readyPlayerIds: [...round.readyPlayerIds, playerId] };
}

const playerAnswerIn = (round, playerId) => round.answers.find((answer) => answer.playerId === playerId);

export const BADGES = Object.freeze([
  {
    id: "precision",
    icon: "🎯",
    label: "Precisión",
    description: "Alcanzó el objetivo exacto en alguna ronda.",
    check: (player, roundHistory) => roundHistory.some((round) => playerAnswerIn(round, player.id)?.points === 2),
  },
  {
    id: "racha",
    icon: "🔥",
    label: "Racha",
    description: "Puntuó en 3 rondas seguidas.",
    check: (player, roundHistory) => {
      let streak = 0;
      for (const round of roundHistory) {
        streak = (playerAnswerIn(round, player.id)?.points ?? 0) > 0 ? streak + 1 : 0;
        if (streak >= 3) return true;
      }
      return false;
    },
  },
  {
    id: "participacion",
    icon: "🧮",
    label: "Participación",
    description: "Respondió en todas las rondas jugadas.",
    check: (player, roundHistory) => roundHistory.length > 0 && roundHistory.every((round) => playerAnswerIn(round, player.id)),
  },
  {
    id: "campeona",
    icon: "🏆",
    label: "Campeona",
    description: "Terminó la partida con la puntuación más alta.",
    check: (player, roundHistory, players) => player.score === Math.max(...players.map((entry) => entry.score)),
  },
]);

/** Devuelve las insignias de una jugadora con su estado desbloqueado, a partir de datos reales de la partida. */
export function computeBadges(player, roundHistory, players) {
  return BADGES.map((badge) => ({ ...badge, unlocked: badge.check(player, roundHistory, players) }));
}
