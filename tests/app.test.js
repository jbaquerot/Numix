import test from "node:test";
import assert from "node:assert/strict";

// app.js wires its browser UI at import time; stub the setup DOM to test its
// state transitions without a browser dependency.
const nodes = new Map();
function element(id) {
  if (!nodes.has(id)) nodes.set(id, {
    hidden: false,
    innerHTML: "",
    querySelector: () => ({ addEventListener() {} }),
    querySelectorAll: () => [],
  });
  return nodes.get(id);
}
globalThis.document = {
  documentElement: { dataset: {} },
  querySelector(selector) { return element(selector); },
};
const { createApp } = await import("../js/app.js");

test("last-round results are visible before the final score screen, then restart works", () => {
  const views = [];
  const app = createApp((state, finalShown) => views.push({ state, finalShown }));
  app.createGame({ players: [{ name: "Ana", icon: "➕" }, { name: "Bea", icon: "➖" }], totalRounds: 5, difficulty: "easy" });
  for (let round = 1; round <= 5; round++) {
    app.startRound();
    app.markReady("p1");
    app.markReady("p2");
    const card = app.getState().currentRound.cards[0];
    app.submitAnswer("p1", String(card));
    assert.equal(app.getState().currentRound.phase, "resolving");
    app.submitAnswer("p2", String(card));
    assert.equal(app.getState().currentRound.phase, "results");
    assert.equal(views.at(-1).finalShown, false);
    assert.equal(app.getState().roundHistory.length, round);
  }
  app.showFinal();
  assert.equal(views.at(-1).finalShown, true);
  assert.equal(views.at(-1).state.roundHistory.length, 5);
  app.restart();
  assert.equal(views.at(-1).state, null);
  assert.equal(views.at(-1).finalShown, false);
  app.dispose();
});

test("the round closes as soon as every ready player has answered, without waiting for a player who never pressed ready", () => {
  const app = createApp(() => {});
  app.createGame({ players: [{ name: "Ana", icon: "➕" }, { name: "Bea", icon: "➖" }], totalRounds: 5, difficulty: "easy" });
  app.startRound();
  app.markReady("p1");
  const card = app.getState().currentRound.cards[0];
  app.submitAnswer("p1", String(card));
  const round = app.getState().currentRound;
  assert.equal(round.phase, "results", "p1 was the only ready player, so the round closes once she answers");
  assert.equal(round.answers.length, 1);
  assert.equal(app.getState().players.find((player) => player.id === "p2").score, 0, "p2 never readied up and earns no points");
  app.dispose();
});

test("if nobody presses ready before time runs out, the round closes with no points for anyone", (t) => {
  t.mock.timers.enable({ apis: ["setInterval", "Date"] });
  const views = [];
  const app = createApp((state, finalShown) => views.push({ state, finalShown }));
  app.createGame({ players: [{ name: "Ana", icon: "➕" }, { name: "Bea", icon: "➖" }], totalRounds: 5, difficulty: "hard" });
  app.startRound();
  t.mock.timers.tick(30000);
  const round = app.getState().currentRound;
  assert.equal(round.phase, "results");
  assert.deepEqual(round.answers, []);
  assert.equal(app.getState().players[0].score, 0);
  assert.equal(app.getState().players[1].score, 0);
  assert.equal(app.getState().roundHistory.length, 1);
  app.dispose();
});

test("once time is up, a player who never readied can no longer press the button", (t) => {
  t.mock.timers.enable({ apis: ["setInterval", "Date"] });
  const app = createApp(() => {});
  app.createGame({ players: [{ name: "Ana", icon: "➕" }], totalRounds: 5, difficulty: "hard" });
  app.startRound();
  t.mock.timers.tick(30000);
  assert.equal(app.getState().currentRound.phase, "results", "lone player never readied, round auto-closed");
  app.dispose();
});

test("last-round result view offers the final screen instead of another round", async () => {
  const { renderRoundResults } = await import("../js/ui.js");
  let next = 0;
  const button = { addEventListener(event, callback) {
    assert.equal(event, "click");
    this.click = callback;
  } };
  const container = {
    innerHTML: "",
    querySelector(selector) {
      assert.equal(selector, "button");
      return button;
    },
  };
  renderRoundResults(container,
    [{ player: { name: "Ana", icon: "➕" }, expression: "2+3", result: 5, points: 2 }],
    [{ number: 5, target: 5 }],
    () => { next += 1; }, true);
  assert.match(container.innerHTML, /Ana: 2\+3 =/);
  assert.match(container.innerHTML, /\+2/);
  assert.match(container.innerHTML, /Ronda 5: objetivo 5/);
  assert.match(container.innerHTML, /Ver resultado final/);
  assert.doesNotMatch(container.innerHTML, /Siguiente ronda/);
  button.click();
  assert.equal(next, 1);
});
