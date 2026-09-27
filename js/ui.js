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
