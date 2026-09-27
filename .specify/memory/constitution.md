# Constitution de Numix

## Propósito

Numix es un juego de cálculo mental para niñas de 9 a 12 años, que puede jugarse individualmente o de forma competitiva con varias participantes. Las jugadoras forman operaciones combinadas con cartas numéricas para acercarse a un objetivo. El producto debe hacer que cada ronda sea rápida de comprender, justa de resolver y agradable de repetir.

## Principios rectores

### I. Reglas claras y resultados verificables

Toda regla mostrada a las personas jugadoras debe ser inequívoca: objetivo, cartas disponibles, operaciones permitidas, criterios de puntuación y condición de victoria. El resultado de cada operación y la asignación de puntos deben poder comprobarse de forma explícita al terminar una ronda.

### II. Juego justo y reproducible

Las cartas y el objetivo de una ronda son comunes para todas las personas jugadoras. La evaluación aplica las mismas reglas a todas, trata con precisión las operaciones combinadas y resuelve los empates conforme a una regla documentada. Cualquier aleatoriedad relevante debe poder registrarse o reproducirse durante las pruebas.

### III. Ritmo accesible de partida

Una persona nueva debe poder iniciar una partida sin ayuda externa. La interfaz prioriza un flujo corto: crear partida, conocer objetivo y cartas, introducir una operación, revisar el resultado y continuar la ronda. Los mensajes deben ser comprensibles y las acciones importantes, visibles.

El lenguaje, la dificultad, el tamaño de los controles y la presentación visual se adecuan a niñas de 9 a 12 años: son claros, respetuosos, inclusivos y no infantilizan ni exigen destrezas ajenas al cálculo propuesto.

### IV. Corrección antes que sofisticación

La lógica matemática y de puntuación es la fuente de verdad. Cada cambio que afecte a operaciones, validación de expresiones, generación aleatoria, rondas o puntos requiere pruebas automatizadas de casos normales, límites y errores. Ninguna mejora visual puede ocultar un resultado incorrecto.

### V. Diseño modular y mantenible

Las reglas de dominio se mantienen separadas de la interfaz. Los componentes y módulos tienen responsabilidades acotadas, nombres comprensibles y documentación breve cuando una decisión no sea evidente. Numix no requiere persistencia de datos: el estado de una partida existe únicamente mientras la página está abierta.

### VI. Web estática y multiplataforma

La experiencia se entrega como una página web estática de HTML y JavaScript apta para GitHub Pages, sin depender de servidor ni de servicios externos para jugar. La interfaz debe adaptarse y ser utilizable en portátil, tablet y móvil, incluyendo interacción táctil en pantallas pequeñas.

### VII. Privacidad proporcional

Numix no recopila ni persiste datos personales. Los nombres visibles de participantes, si se solicitan, se usan solo durante la sesión activa de la partida.

### VIII. Rendimiento percibido

Las acciones de ronda —crear objetivo, repartir cartas, validar una operación y calcular puntuaciones— deben dar respuesta inmediata en condiciones normales. Las esperas, fallos y estados vacíos se comunican con claridad y nunca dejan a la persona jugadora sin saber qué hacer.

## Estándares de entrega

- Toda historia funcional incluye criterios de aceptación observables.
- Las reglas nuevas o modificadas se acompañan de pruebas automatizadas de dominio.
- Las interfaces se revisan en los recorridos principales de partida y en estados de error.
- Los cambios se mantienen pequeños, revisables y documentan cualquier decisión que afecte a las reglas.
- Antes de publicar una versión se verifica que una partida completa puede jugarse de principio a fin y que el ganador se determina correctamente.

## Gobernanza

Esta Constitution prevalece sobre decisiones de diseño y planificación posteriores. Toda excepción debe justificarse en el plan técnico o en la solicitud de cambio, indicar su impacto y quedar validada antes de implementarse. Las modificaciones a este documento requieren revisar los artefactos afectados para mantener la coherencia.

**Versión:** 1.0.0  
**Adoptada:** 2026-09-23  
**Última modificación:** 2026-09-23
