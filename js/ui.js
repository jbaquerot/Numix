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
