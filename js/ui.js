import { DIFFICULTIES, PLAYER_ICONS } from "./constants.js";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function playerLabel(player) {
  return `${player.icon} ${escapeHtml(player.name)}`;
}

function renderPlayerFields(count, previous) {
  return Array.from({ length: count }, (_, index) => {
    const prior = previous[index];
    const name = prior?.name ?? `Jugadora ${index + 1}`;
    const icon = prior?.icon ?? PLAYER_ICONS[index % PLAYER_ICONS.length];
    return `
      <fieldset class="player-fields" data-index="${index}">
        <legend>Jugadora ${index + 1}</legend>
        <label>Nombre <input type="text" name="playerName" value="${escapeHtml(name)}" maxlength="20" required></label>
        <div class="icon-picker" role="radiogroup" aria-label="Icono de la jugadora ${index + 1}">
          ${PLAYER_ICONS.map((option) => `<label class="icon-option"><input type="radio" name="playerIcon${index}" value="${option}" ${option === icon ? "checked" : ""}><span aria-hidden="true">${option}</span></label>`).join("")}
        </div>
      </fieldset>`;
  }).join("");
}

export function renderSetup(container, onSubmit) {
  function readPlayerFields() {
    return Array.from(container.querySelectorAll(".player-fields")).map((fieldset, index) => ({
      name: fieldset.querySelector("input[type=text]").value.trim() || `Jugadora ${index + 1}`,
      icon: fieldset.querySelector("input[type=radio]:checked")?.value ?? PLAYER_ICONS[0],
    }));
  }

  function render(count, previousPlayers) {
    container.innerHTML = `
    <form id="setup-form">
      <label>Número de jugadoras <select name="playerCount">${[1, 2, 3, 4].map((value) => `<option value="${value}" ${value === count ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <div id="player-fields">${renderPlayerFields(count, previousPlayers)}</div>
      <label>Rondas <select name="rounds">${[5, 6, 7, 8, 9, 10].map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>
      <fieldset><legend>Dificultad</legend>${Object.entries(DIFFICULTIES).map(([key, value]) =>
        `<label><input type="radio" name="difficulty" value="${key}" ${key === "medium" ? "checked" : ""}> ${value.label} (${value.durationSeconds} s)</label>`).join("")}</fieldset>
      <button type="submit">Empezar partida</button>
    </form>`;

    container.querySelector("select[name=playerCount]").addEventListener("change", (event) => {
      render(Number(event.target.value), readPlayerFields());
    });

    container.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      onSubmit({ players: readPlayerFields(), totalRounds: Number(data.get("rounds")), difficulty: data.get("difficulty") });
    });
  }

  render(1, []);
}

const KEYPAD_KEYS = ["1", "2", "3", "+", "-", "4", "5", "6", "*", "/", "7", "8", "9", "(", ")", "0", "enter", "del", "CE"];

function renderPlayerPanel(player, round) {
  const answer = round.answers.find((entry) => entry.playerId === player.id);
  if (answer) {
    return `
    <div class="answer-form" data-player-id="${player.id}">
      <p class="player-name">${playerLabel(player)}</p>
      <p class="answer-expression">${escapeHtml(answer.expression)}</p>
      <p class="answer-message success" role="status">Resultado: ${answer.result}</p>
    </div>`;
  }
  if (round.readyPlayerIds.includes(player.id)) {
    const keypad = KEYPAD_KEYS.map((key) => `<button type="button" class="key" data-key="${key}">${key === "/" ? "÷" : key}</button>`).join("");
    return `
    <form class="answer-form" data-player-id="${player.id}">
      <label>${playerLabel(player)}<input name="expression" inputmode="text" placeholder="(2 + 3) × 4" required></label>
      <div class="keypad" aria-label="Teclado matemático">${keypad}</div>
      <button>Comprobar</button><p class="answer-message" role="status"></p>
    </form>`;
  }
  return `
    <div class="answer-form" data-player-id="${player.id}">
      <p class="player-name">${playerLabel(player)}</p>
      <button type="button" class="ready-button" data-player-id="${player.id}">Ya lo tengo</button>
    </div>`;
}

export function renderRound(container, game, secondsRemaining, onReady, onAnswer) {
  const { currentRound: round, players } = game;
  container.innerHTML = `
    <h2>Ronda ${round.number} de ${game.settings.totalRounds}</h2>
    <p class="timer" aria-label="Tiempo restante">${secondsRemaining} s</p>
    <p class="target">Objetivo: <strong>${round.target}</strong></p>
    <ul class="cards" aria-label="Cartas disponibles">${round.cards.map((card) => `<li>${card}</li>`).join("")}</ul>
    <div class="players-panel">${players.map((player) => renderPlayerPanel(player, round)).join("")}</div>`;

  container.querySelectorAll(".ready-button").forEach((button) =>
    button.addEventListener("click", () => onReady(button.dataset.playerId)));

  container.querySelectorAll("form.answer-form").forEach((form) => {
    const input = form.elements.expression;
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

export function renderScoreboard(container, players) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  container.innerHTML = `<h2>Marcador</h2><ul class="scoreboard">${sorted.map((player) => `<li><span>${playerLabel(player)}</span><strong>${player.score}</strong></li>`).join("")}</ul>`;
}

export function renderRoundResults(container, answers, history, onNext, isLastRound = false) {
  container.innerHTML = `<ul class="round-results">${answers.map((answer) => `<li><span>${playerLabel(answer.player)}: ${escapeHtml(answer.expression)} = <strong class="result-value">${answer.result}</strong></span><strong class="earned-points">+${answer.points}</strong></li>`).join("")}</ul><section class="history"><h3>Rondas jugadas</h3>${history.map((round) => `<p>Ronda ${round.number}: objetivo ${round.target}</p>`).join("")}</section><button id="next-round">${isLastRound ? "Ver resultado final" : "Siguiente ronda"}</button>`;
  container.querySelector("button").addEventListener("click", onNext);
}

export function renderFinalResults(container, players, onRestart) {
  const bestScore = Math.max(...players.map((player) => player.score));
  const winners = players.filter((player) => player.score === bestScore).map((player) => playerLabel(player)).join(", ");
  const sorted = [...players].sort((a, b) => b.score - a.score);
  container.innerHTML = `<p>¡Ganadora${winners.includes(",") ? "s" : ""}: ${winners}!</p><ul>${sorted.map((player) => `<li>${playerLabel(player)}: ${player.score} puntos</li>`).join("")}</ul><button>Jugar de nuevo</button>`;
  container.querySelector("button").addEventListener("click", onRestart);
}
