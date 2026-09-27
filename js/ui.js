import { DIFFICULTIES } from "./constants.js";

export function renderSetup(container, onSubmit) {
  container.innerHTML = `
    <form id="setup-form">
      <label>Jugadoras (una por línea)<textarea name="players" required>Jugadora 1</textarea></label>
      <label>Rondas <input name="rounds" type="number" min="1" max="10" value="5" required></label>
      <fieldset><legend>Dificultad</legend>${Object.entries(DIFFICULTIES).map(([key, value]) =>
        `<label><input type="radio" name="difficulty" value="${key}" ${key === "medium" ? "checked" : ""}> ${value.label} (${value.durationSeconds} s)</label>`).join("")}</fieldset>
      <button type="submit">Empezar partida</button>
    </form>`;
  container.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const players = data.get("players").split("\n").map((name) => name.trim()).filter(Boolean);
    onSubmit({ players, totalRounds: Number(data.get("rounds")), difficulty: data.get("difficulty") });
  });
}

export function renderRound(container, game, secondsRemaining) {
  const { currentRound: round, players } = game;
  container.innerHTML = `
    <p class="timer" aria-label="Tiempo restante">${secondsRemaining} s</p>
    <p class="target">Objetivo: <strong>${round.target}</strong></p>
    <ul class="cards" aria-label="Cartas disponibles">${round.cards.map((card) => `<li>${card}</li>`).join("")}</ul>
    <h3>Marcador</h3>
    <ul class="scoreboard">${players.map((player) => `<li>${player.name}: ${player.score} puntos</li>`).join("")}</ul>`;
}

export function renderAnswerForms(container, game, onAnswer) {
  container.innerHTML = game.players.map((player) => `
    <form class="answer-form" data-player-id="${player.id}">
      <label>${player.name}<input name="expression" inputmode="text" placeholder="(2 + 3) × 4" required></label>
      <button>Comprobar</button><p class="answer-message" role="status"></p>
    </form>`).join("");
  container.querySelectorAll("form").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.elements.expression;
    const message = form.querySelector(".answer-message");
    try {
      const result = onAnswer(form.dataset.playerId, input.value);
      message.textContent = `Resultado: ${result}`;
      input.disabled = true;
      form.querySelector("button").disabled = true;
    } catch (error) {
      message.textContent = error.message;
    }
  }));
}

export function renderRoundResults(container, answers, onNext) {
  container.innerHTML = `<ul>${answers.map((answer) => `<li>${answer.playerName}: ${answer.expression} = ${answer.result} · ${answer.points} puntos</li>`).join("")}</ul><button id="next-round">Siguiente ronda</button>`;
  container.querySelector("button").addEventListener("click", onNext);
}

export function renderFinalResults(container, players, onRestart) {
  const bestScore = Math.max(...players.map((player) => player.score));
  const winners = players.filter((player) => player.score === bestScore).map((player) => player.name).join(", ");
  container.innerHTML = `<p>¡Ganadora${winners.includes(",") ? "s" : ""}: ${winners}!</p><ul>${players.map((player) => `<li>${player.name}: ${player.score} puntos</li>`).join("")}</ul><button>Jugar de nuevo</button>`;
  container.querySelector("button").addEventListener("click", onRestart);
}
