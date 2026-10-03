import assert from "node:assert/strict";
import test from "node:test";
import { createGame, createRound, markReady, remainingSeconds, scoreRound, startResolving } from "../js/game.js";

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
