# Handoff de implementación — Numix

Implementa la funcionalidad `001-juego-numix` siguiendo los artefactos fuente enlazados al final de este documento. Este handoff resume las decisiones aprobadas y no debe sustituir las reglas detalladas de la especificación.

## Objetivo

Construir Numix, una aplicación web estática para niñas de 9 a 12 años que permite practicar operaciones combinadas. Puede jugar una sola persona o varias en un mismo dispositivo. En cada ronda, las jugadoras resuelven en papel un reto compartido y después introducen sus operaciones en el navegador.

La aplicación debe funcionar en portátil, tablet y móvil, y desplegarse directamente en GitHub Pages. No debe requerir cuentas, servidor, API, base de datos ni persistencia: el estado existe solo mientras el navegador permanece abierto.

## Reglas de juego obligatorias

- La partida admite una o más jugadoras.
- Antes de empezar se eligen de 1 a 10 rondas y una dificultad: fácil (60 s), medio (45 s) o difícil (30 s).
- Cada ronda genera un objetivo entero aleatorio de 1 a 100 y cuatro cartas con valores enteros aleatorios de 1 a 10. Las cartas pueden repetir valores.
- Todas las jugadoras reciben el mismo objetivo y las mismas cartas.
- Cada operación usa obligatoriamente las cuatro cartas, cada una exactamente una vez.
- Solo se permiten suma, resta, multiplicación, división y paréntesis.
- Todo resultado intermedio y final debe ser un entero positivo. Por tanto, se rechazan división entre cero, división no exacta, cero, negativos y decimales/fracciones.
- Durante el temporizador las jugadoras resuelven en papel; Numix no acepta respuestas digitales hasta que termine.
- Tras el tiempo, cada jugadora introduce una operación. Al validarla, Numix muestra inmediatamente su resultado y no permite modificar esa respuesta en esa ronda.
- Si una o varias jugadoras alcanzan el objetivo exacto, todas reciben 2 puntos.
- Si nadie alcanza el objetivo, cada jugadora cuya distancia absoluta sea la menor recibe 1 punto.
- Al acabar las rondas configuradas, mostrar puntuaciones y ganadora(s), con opción de iniciar una partida nueva.

## Decisiones de arquitectura

- Aplicación estática sin dependencias de ejecución: HTML semántico, CSS responsive y JavaScript moderno por módulos.
- Usar esta estructura:

```text
index.html
styles.css
js/app.js
js/constants.js
js/game.js
js/expression.js
js/ui.js
tests/expression.test.js
tests/game.test.js
package.json
README.md
```

- Mantener las reglas de dominio separadas del DOM.
- `expression.js` debe tokenizar, analizar, validar y evaluar expresiones sin `eval`, `Function` ni ejecución dinámica. Usa una gramática o algoritmo de pilas con una lista cerrada de tokens permitidos.
- `game.js` contiene generación de retos, ciclo de ronda, temporizador basado en una marca temporal, puntuación y desempates.
- `app.js` mantiene el estado en memoria y orquesta transiciones de fase: `preparada`, `resolviendo`, `introduciendo`, `resultados` y `finalizada`.
- `ui.js` renderiza las vistas y traduce eventos de interfaz a acciones de dominio.
- Emplear rutas relativas —por ejemplo, `./js/app.js`— para que GitHub Pages sirva el sitio sin configuración adicional.

## Criterios de calidad

- Diseño mobile-first, controles táctiles amplios, contraste suficiente, foco visible y mensajes de error claros.
- Lenguaje claro, respetuoso e inclusivo, adecuado para niñas de 9 a 12 años sin infantilizar.
- Todas las validaciones matemáticas y reglas de puntuación deben tener pruebas automatizadas.
- Probar cartas repetidas, uso exacto de cartas, paréntesis, precedencia, divisiones no exactas, división por cero, valores no positivos, empates exactos y empates por proximidad.
- Verificar manualmente una partida completa en móvil, tablet y portátil.
- El temporizador debe calcular el tiempo restante desde una marca temporal para resistir pausas o pérdida de precisión de intervalos.

## Orden de implementación

1. Preparar estructura base, scripts de prueba y documentación de desarrollo.
2. Implementar primero `constants.js`, `expression.js` y sus pruebas.
3. Implementar `game.js`, la lógica de rondas, temporizador y puntuación, junto a sus pruebas.
4. Construir la estructura HTML, el estado de aplicación y la UI de configuración.
5. Completar las vistas de reto, introducción de operaciones, resultados y final de partida.
6. Aplicar diseño responsive y accesibilidad.
7. Ejecutar pruebas, comprobar el flujo completo y verificar el despliegue de GitHub Pages.

## Restricciones y riesgos

- No añadir backend, persistencia, autenticación, juego remoto, chat ni operadores adicionales.
- No usar mecanismos de evaluación de código para calcular expresiones introducidas por las jugadoras.
- Al validar las cartas, comparar cantidades por valor para permitir duplicados correctamente.
- Mantener los cambios pequeños y revisar que toda modificación de reglas incluya sus pruebas.

## Artefactos fuente

- [Constitution](../../memory/constitution.md)
- [Especificación funcional](spec.md)
- [Plan técnico](plan.md)
- [Tareas de implementación](tasks.md)
