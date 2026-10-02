import { DIFFICULTIES } from "./constants.js";

export function renderSetup(container, onSubmit) {
  container.innerHTML = `
    <form id="setup-form">
      <label>Número de jugadoras <select name="playerCount">${[1, 2, 3, 4].map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>
      <label>Rondas <select name="rounds">${[5, 6, 7, 8, 9, 10].map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>
      <fieldset><legend>Dificultad</legend>${Object.entries(DIFFICULTIES).map(([key, value]) =>
        `<label><input type="radio" name="difficulty" value="${key}" ${key === "medium" ? "checked" : ""}> ${value.label} (${value.durationSeconds} s)</label>`).join("")}</fieldset>
      <button type="submit">Empezar partida</button>
    </form>`;
  container.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const players = Array.from({ length: Number(data.get("playerCount")) }, (_, index) => `Jugadora ${index + 1}`);
    onSubmit({ players, totalRounds: Number(data.get("rounds")), difficulty: data.get("difficulty") });
  });
}

export function renderRound(container, game, secondsRemaining, onReady) {
  const { currentRound: round, players } = game;
  container.innerHTML = `
    <h2>Ronda ${round.number} de ${game.settings.totalRounds}</h2>
    <p class="timer" aria-label="Tiempo restante">${secondsRemaining} s</p><button class="ready-button">Ya lo tengo</button>
    <p class="target">Objetivo: <strong>${round.target}</strong></p>
    <ul class="cards" aria-label="Cartas disponibles">${round.cards.map((card) => `<li>${card}</li>`).join("")}</ul>
    <h3>Marcador</h3>
    <ul class="scoreboard">${players.map((player) => `<li>${player.name}: ${player.score} puntos</li>`).join("")}</ul>`;
  container.querySelector(".ready-button").addEventListener("click", onReady);
}

export function renderAnswerForms(container, game, onAnswer) {
  const { target, cards, answers } = game.currentRound;
  const keypad = ["1", "2", "3", "+", "-", "4", "5", "6", "*", "/", "7", "8", "9", "(", ")", "0", "enter", "del", "CE"].map((key) => `<button type="button" class="key" data-key="${key}">${key === "/" ? "÷" : key}</button>`).join("");
  container.innerHTML = `<p class="target">Objetivo: <strong>${target}</strong></p><ul class="cards">${cards.map((card) => `<li>${card}</li>`).join("")}</ul>` + game.players.map((player) => {
    const answer = answers.find((entry) => entry.playerId === player.id);
    if (answer) {
      return `
    <form class="answer-form" data-player-id="${player.id}">
      <label>${player.name}<input name="expression" value="${answer.expression}" disabled></label>
      <p class="answer-message success" role="status">Resultado: ${answer.result}</p>
    </form>`;
    }
    return `
    <form class="answer-form" data-player-id="${player.id}">
      <label>${player.name}<input name="expression" inputmode="text" placeholder="(2 + 3) × 4" required></label>
      <div class="keypad" aria-label="Teclado matemático">${keypad}</div>
      <button>Comprobar</button><p class="answer-message" role="status"></p>
    </form>`;
  }).join("");
  container.querySelectorAll(".answer-form").forEach((form) => {
    const input = form.elements.expression;
    if (input.disabled) return;
    form.querySelectorAll(".key").forEach((button) => button.addEventListener("click", () => { const key = button.dataset.key; if (key === "del") input.value = input.value.slice(0, -1); else if (key === "CE") input.value = ""; else if (key === "enter") form.requestSubmit(); else input.value += key; input.focus(); }));
    form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector(".answer-message");
    try {
      const result = onAnswer(form.dataset.playerId, input.value);
      message.textContent = `Resultado: ${result}`;
      message.classList.add("success");
    } catch (error) {
      message.textContent = error.message;
      message.classList.add("error");
    }
    });
  });
}

export function renderRoundResults(container, answers, players, history, onNext, isLastRound = false) {
  container.innerHTML = `<ul class="round-results">${answers.map((answer) => `<li><span>${answer.playerName}: ${answer.expression} = <strong class="result-value">${answer.result}</strong></span><strong class="earned-points">+${answer.points}</strong></li>`).join("")}</ul><section class="round-scoreboard"><h3>Marcador acumulado</h3><ul>${players.map((player) => `<li><span>${player.name}</span><strong>${player.score}</strong></li>`).join("")}</ul></section><section class="history"><h3>Rondas jugadas</h3>${history.map((round) => `<p>Ronda ${round.number}: objetivo ${round.target}</p>`).join("")}</section><button id="next-round">${isLastRound ? "Ver resultado final" : "Siguiente ronda"}</button>`;
  container.querySelector("button").addEventListener("click", onNext);
}

export function renderFinalResults(container, players, onRestart) {
  const bestScore = Math.max(...players.map((player) => player.score));
  const winners = players.filter((player) => player.score === bestScore).map((player) => player.name).join(", ");
  container.innerHTML = `<p>¡Ganadora${winners.includes(",") ? "s" : ""}: ${winners}!</p><ul>${players.map((player) => `<li>${player.name}: ${player.score} puntos</li>`).join("")}</ul><button>Jugar de nuevo</button>`;
  container.querySelector("button").addEventListener("click", onRestart);
}
