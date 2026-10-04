import assert from "node:assert/strict";
import test from "node:test";
import { computeBadges, createGame, createRound, markReady, remainingSeconds, scoreRound, startResolving } from "../js/game.js";

test("crea retos dentro de los rangos", () => {
  const round = createRound(1, () => 0);
  assert.equal(round.target, 1);
  assert.deepEqual(round.cards, [1, 1, 1, 1]);
});

const player = (name, icon = "➕") => ({ name, icon });

test("admite partidas de cinco a diez rondas y de una a cuatro jugadoras", () => {
  assert.equal(createGame({ players: [player("Ana")], totalRounds: 5, difficulty: "easy" }).settings.totalRounds, 5);
  assert.equal(createGame({ players: [player("Ana")], totalRounds: 10, difficulty: "hard" }).settings.durationSeconds, 30);
  const game = createGame({ players: [player("Ana", "🔢"), player("Bea"), player("Cami"), player("Dora")], totalRounds: 5, difficulty: "medium" });
  assert.equal(game.players.length, 4);
  assert.equal(game.players[0].icon, "🔢");
  assert.throws(() => createGame({ players: [player("Ana")], totalRounds: 4, difficulty: "easy" }), /5 y 10/);
  assert.throws(() => createGame({ players: [player("Ana")], totalRounds: 11, difficulty: "easy" }), /5 y 10/);
  assert.throws(() => createGame({ players: ["A", "B", "C", "D", "E"].map((name) => player(name)), totalRounds: 5, difficulty: "easy" }), /1 y 4/);
});

test("puntúa aciertos y empates", () => {
  const exact = scoreRound(10, [{ playerId: "a", result: 10 }, { playerId: "b", result: 10 }]);
  assert.deepEqual(exact.map(({ points }) => points), [2, 2]);
  const near = scoreRound(10, [{ playerId: "a", result: 8 }, { playerId: "b", result: 12 }]);
  assert.deepEqual(near.map(({ points }) => points), [1, 1]);
});

test("remainingSeconds llega a cero y se queda ahí cuando pasa el tiempo", () => {
  const round = startResolving(createRound(1), 30, 1000);
  assert.equal(remainingSeconds(round, 15000), 16);
  assert.equal(remainingSeconds(round, 31000), 0);
  assert.equal(remainingSeconds(round, 60000), 0);
});

test("una jugadora puede marcarse lista en cualquier momento, sin duplicarse", () => {
  const round = createRound(1);
  const ready = markReady(round, "p1");
  assert.deepEqual(ready.readyPlayerIds, ["p1"]);
  assert.equal(markReady(ready, "p1"), ready);
});

test("computeBadges calcula insignias reales a partir del historial de la partida", () => {
  const players = [{ id: "p1", name: "Ana", score: 6 }, { id: "p2", name: "Bea", score: 3 }];
  const roundHistory = [
    { number: 1, target: 10, answers: [{ playerId: "p1", points: 2 }, { playerId: "p2", points: 0 }] },
    { number: 2, target: 20, answers: [{ playerId: "p1", points: 1 }, { playerId: "p2", points: 1 }] },
    { number: 3, target: 30, answers: [{ playerId: "p1", points: 1 }, { playerId: "p2", points: 0 }] },
    { number: 4, target: 40, answers: [{ playerId: "p2", points: 1 }] },
  ];
  const unlocked = (player) => Object.fromEntries(
    computeBadges(player, roundHistory, players).map((badge) => [badge.id, badge.unlocked]),
  );

  const ana = unlocked(players[0]);
  assert.equal(ana.precision, true, "acertó el objetivo exacto en la ronda 1");
  assert.equal(ana.racha, true, "puntuó en las rondas 1, 2 y 3 seguidas");
  assert.equal(ana.participacion, false, "no respondió en la ronda 4");
  assert.equal(ana.campeona, true, "terminó con la puntuación más alta");

  const bea = unlocked(players[1]);
  assert.equal(bea.precision, false, "nunca acertó el objetivo exacto");
  assert.equal(bea.racha, false, "su racha máxima fue de 1 ronda");
  assert.equal(bea.participacion, true, "respondió en las cuatro rondas");
  assert.equal(bea.campeona, false, "no tuvo la puntuación más alta");
});

test("computeBadges no exige participación cuando no se ha jugado ninguna ronda", () => {
  const players = [{ id: "p1", name: "Ana", score: 0 }];
  const unlocked = Object.fromEntries(
    computeBadges(players[0], [], players).map((badge) => [badge.id, badge.unlocked]),
  );
  assert.equal(unlocked.participacion, false);
  assert.equal(unlocked.precision, false);
  assert.equal(unlocked.campeona, true, "es la única jugadora, así que tiene la puntuación más alta");
});
