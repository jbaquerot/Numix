# Tareas de implementación: Numix

**Funcionalidad:** `001-juego-numix`  
**Basado en:** [spec.md](spec.md) y [plan.md](plan.md)  
**Estado:** Listo para implementación  
**Fecha:** 2026-09-27

## Convenciones

- Las tareas marcadas con `[P]` pueden desarrollarse en paralelo una vez completadas sus dependencias indicadas.
- Cada tarea incluye sus archivos objetivo; si al implementarla fuera necesario ampliar ese alcance, deberá documentarse en el commit correspondiente.
- La lógica de dominio se prueba sin depender del DOM.

## 1. Preparación del proyecto

- [x] T001 Crear la estructura base de la aplicación estática en `index.html`, `styles.css`, `js/app.js`, `js/constants.js`, `js/game.js`, `js/expression.js` y `js/ui.js`.
- [x] T002 Configurar el entorno de pruebas de JavaScript y los scripts de desarrollo en `package.json`.
- [x] T003 [P] Documentar la ejecución local, las pruebas y el despliegue en GitHub Pages en `README.md`.

## 2. Reglas matemáticas y dominio

- [x] T004 Definir constantes de reglas, dificultades, duraciones y fases de partida en `js/constants.js`.
- [x] T005 Implementar tokenización y análisis seguro de operaciones con números, operadores y paréntesis en `js/expression.js`.
- [x] T006 Implementar la validación de uso exacto de las cuatro cartas —incluyendo valores repetidos— en `js/expression.js`.
- [x] T007 Implementar la evaluación de operaciones, la precedencia y las restricciones de resultados enteros positivos en `js/expression.js`.
- [x] T008 [P] Crear pruebas de operaciones válidas, paréntesis, precedencia, cartas repetidas, divisiones no exactas, división por cero y resultados no positivos en `tests/expression.test.js`.
- [x] T009 Implementar creación de partida, generación de objetivos y cartas, y creación de rondas en `js/game.js`.
- [x] T010 Implementar cálculo de distancia, puntos y empates exactos o por proximidad en `js/game.js`.
- [x] T011 Implementar transiciones de fase, control de temporizador basado en marca temporal y cierre de partidas en `js/game.js`.
- [x] T012 [P] Crear pruebas de rangos aleatorios, puntuación, empates, transiciones y partidas de 1 a 10 rondas en `tests/game.test.js`.

## 3. Flujo y experiencia de juego

- [x] T013 Crear la estructura semántica y las regiones accesibles de las vistas de configuración, ronda, resultados y final en `index.html`.
- [ ] T014 Implementar el estado central de aplicación y la coordinación entre dominio, temporizador y renderizado en `js/app.js`.
- [ ] T015 Implementar el renderizado de configuración para una o más jugadoras, de 1 a 10 rondas y dificultad fácil, media o difícil en `js/ui.js`.
- [ ] T016 Implementar el renderizado del reto, cartas, objetivo, temporizador y marcador durante la fase de resolución en `js/ui.js`.
- [ ] T017 Implementar formularios de introducción de operaciones por jugadora, mensajes de error y resultado inmediato tras una respuesta válida en `js/ui.js`.
- [ ] T018 Implementar la vista de resultado de ronda, puntos concedidos, marcador acumulado, resultado final y reinicio de partida en `js/ui.js`.
- [ ] T019 Conectar los eventos de interfaz con las acciones de dominio, incluyendo bloqueo de respuestas ya enviadas y avance de ronda, en `js/app.js` y `js/ui.js`.

## 4. Diseño responsive y accesibilidad

- [ ] T020 Diseñar estilos base mobile-first, tipografía, color, jerarquía visual y estados de interacción adecuados para niñas de 9 a 12 años en `styles.css`.
- [ ] T021 Añadir diseño adaptable para tablet y portátil, controles táctiles amplios, foco visible, contraste y mensajes de validación accesibles en `styles.css` y `index.html`.

## 5. Verificación y publicación

- [x] T022 Ejecutar la suite de pruebas y corregir cualquier fallo en `tests/expression.test.js`, `tests/game.test.js` y los módulos afectados.
- [ ] T023 Verificar manualmente el flujo completo en vista móvil, tablet y portátil; documentar el resultado en `README.md`.
- [ ] T024 Verificar el sitio publicado en GitHub Pages y ajustar rutas relativas de recursos si fuera necesario en `index.html`, `js/app.js` y `README.md`.

## Orden de ejecución y dependencias

```text
T001 ──> T002, T004, T013, T020
T004 ──> T005 ──> T006 ──> T007 ──> T008
T004 ──> T009 ──> T010, T011 ──> T012
T007 + T009 + T010 + T011 ──> T014
T013 + T014 ──> T015 ──> T016 ──> T017 ──> T018 ──> T019
T020 ──> T021
T008 + T012 + T019 + T021 ──> T022 ──> T023 ──> T024
```
