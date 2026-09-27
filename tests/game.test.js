import assert from "node:assert/strict";
import test from "node:test";
import { createGame, createRound, finishResolving, remainingSeconds, scoreRound, startResolving } from "../js/game.js";

test("crea retos dentro de los rangos", () => {
  const round = createRound(1, () => 0);
  assert.equal(round.target, 1);
  assert.deepEqual(round.cards, [1, 1, 1, 1]);
});

test("admite partidas de cinco a diez rondas y de una a cuatro jugadoras", () => {
  assert.equal(createGame({ players: ["Ana"], totalRounds: 5, difficulty: "easy" }).settings.totalRounds, 5);
  assert.equal(createGame({ players: ["Ana"], totalRounds: 10, difficulty: "hard" }).settings.durationSeconds, 30);
  assert.equal(createGame({ players: ["Ana", "Bea", "Cami", "Dora"], totalRounds: 5, difficulty: "medium" }).players.length, 4);
  assert.throws(() => createGame({ players: ["Ana"], totalRounds: 4, difficulty: "easy" }), /5 y 10/);
  assert.throws(() => createGame({ players: ["Ana"], totalRounds: 11, difficulty: "easy" }), /5 y 10/);
  assert.throws(() => createGame({ players: ["A", "B", "C", "D", "E"], totalRounds: 5, difficulty: "easy" }), /1 y 4/);
});

test("puntúa aciertos y empates", () => {
  const exact = scoreRound(10, [{ playerId: "a", result: 10 }, { playerId: "b", result: 10 }]);
  assert.deepEqual(exact.map(({ points }) => points), [2, 2]);
  const near = scoreRound(10, [{ playerId: "a", result: 8 }, { playerId: "b", result: 12 }]);
  assert.deepEqual(near.map(({ points }) => points), [1, 1]);
});

test("avanza de resolución a introducción cuando termina el tiempo", () => {
  const round = startResolving(createRound(1), 30, 1000);
  assert.equal(remainingSeconds(round, 31000), 0);
  assert.equal(finishResolving(round, 31000).phase, "entering");
});
