# Especificación funcional: Numix

**Funcionalidad:** `001-juego-numix`  
**Estado:** Listo para revisión  
**Fecha:** 2026-09-27

## Propósito

Numix ayuda a niñas de 9 a 12 años a practicar operaciones combinadas, tanto individualmente como mediante partidas competitivas y amistosas. Una o más jugadoras intentan construir, a partir de las mismas cartas numéricas, una operación que dé exactamente un número objetivo o se aproxime lo máximo posible a él.

La partida transcurre íntegramente en una sesión de navegador y no requiere crear cuentas ni guardar datos al cerrarla.

## Personas usuarias

- **Jugadora:** niña de 9 a 12 años que participa en una partida, crea operaciones y obtiene puntos.
- **Persona que inicia la partida:** cualquier participante que configura el número de jugadoras e inicia las rondas.

## Recorrido principal

1. Las participantes abren Numix y crean una partida de 1 a 4 jugadoras.
2. Antes de cada ronda, el juego muestra un número objetivo aleatorio entre 1 y 100 y cuatro cartas aleatorias con valores entre 1 y 10, iguales para todas las jugadoras.
3. Cada jugadora resuelve el reto en papel, construyendo una operación combinada con suma, resta, multiplicación y división. En cuanto termina, pulsa su propio botón para pasar a introducir su operación en Numix, sin esperar a las demás jugadoras; el tiempo de la ronda sigue corriendo para quien no haya terminado.
4. Cuando el tiempo se agota, cualquier jugadora que no haya pulsado su botón pasa igualmente a introducir su operación en Numix.
5. El juego comprueba las operaciones, muestra el valor obtenido y compara la distancia de cada una respecto al objetivo.
6. Si una jugadora alcanza exactamente el objetivo, recibe 2 puntos. Si ninguna lo alcanza, la jugadora con el resultado más próximo recibe 1 punto.
7. Tras varias rondas, el juego muestra la puntuación acumulada y declara ganadora a la jugadora con más puntos.
8. Las participantes pueden iniciar una nueva partida desde el resultado final.

## Historias de usuario

### HU-01 — Iniciar una partida

Como participante, quiero crear una partida indicando quiénes jugarán para poder comenzar una sesión compartida de Numix.

**Criterios de aceptación**

- Se permite iniciar una partida de 1 a 4 jugadoras.
- La partida identifica a cada jugadora de forma clara durante todas las rondas.
- La configuración se entiende sin instrucciones externas.

### HU-02 — Conocer el reto de la ronda

Como jugadora, quiero ver claramente el objetivo y las cuatro cartas disponibles para saber qué operación debo intentar construir.

**Criterios de aceptación**

- El objetivo es un número entero aleatorio entre 1 y 100, ambos incluidos.
- Se muestran exactamente cuatro cartas, con valores enteros entre 1 y 10.
- Todas las jugadoras reciben el mismo objetivo y las mismas cuatro cartas en una ronda.

### HU-03 — Crear y comprobar una operación

Como jugadora, quiero construir mi operación combinada con las cartas y operaciones permitidas para demostrar mi razonamiento y saber cuánto me acerqué al objetivo.

**Criterios de aceptación**

- Durante el tiempo de resolución, cada jugadora anota su operación en papel; Numix no solicita todavía la respuesta digital.
- Cuando hay más de una jugadora, cada una pulsa su propio botón para pasar a introducir su operación en cuanto esté lista, sin esperar a las demás; el resto sigue viendo el tiempo restante hasta pulsar el suyo o hasta que se agote.
- Al agotarse el tiempo de la ronda, Numix habilita la introducción de las operaciones de las jugadoras que aún no la hayan pulsado.
- Al introducir una operación válida, Numix muestra inmediatamente su resultado.
- Se pueden emplear suma, resta, multiplicación y división.
- La operación puede usar cualquier subconjunto de las cuatro cartas mostradas, sin usar ninguna más veces de las disponibles, aunque dos o más cartas tengan el mismo valor.
- Cada paso de cálculo y el resultado final deben ser enteros positivos.
- El juego impide validar una operación inválida y explica el problema de forma comprensible.
- Tras validarla, la jugadora ve su operación y el resultado calculado.

### HU-04 — Obtener puntos de forma justa

Como jugadora, quiero que Numix calcule y muestre los puntos de cada ronda para saber quién ganó el reto.

**Criterios de aceptación**

- Una jugadora que obtiene exactamente el objetivo recibe 2 puntos.
- Si varias jugadoras obtienen exactamente el objetivo, cada una recibe 2 puntos.
- Si nadie obtiene exactamente el objetivo, la jugadora con menor distancia absoluta al objetivo recibe 1 punto.
- Si varias jugadoras empatan con la menor distancia al objetivo y nadie lo alcanza, cada una recibe 1 punto.
- El resultado de la ronda muestra las operaciones entregadas, sus resultados y los puntos concedidos.
- La puntuación acumulada se actualiza al concluir cada ronda.

### HU-05 — Completar la partida

Como jugadora, quiero saber cuándo termina la partida y quién ha ganado para cerrar la actividad con una conclusión clara.

**Criterios de aceptación**

- La partida termina tras el número de rondas establecido para ella.
- Las participantes eligen entre 5 y 10 rondas antes de comenzar la partida.
- Las participantes eligen, antes de comenzar, la duración de resolución de las rondas mediante tres niveles de dificultad: fácil (60 segundos), medio (45 segundos) y difícil (30 segundos).
- La pantalla final muestra las puntuaciones acumuladas y la ganadora o ganadoras.
- Se puede empezar una nueva partida sin recargar la página.

### HU-06 — Jugar desde distintos dispositivos

Como jugadora, quiero poder jugar cómodamente desde un portátil, tablet o móvil para usar Numix en el contexto disponible.

**Criterios de aceptación**

- El contenido sigue siendo legible y utilizable en pantallas de portátil, tablet y móvil.
- Los controles son cómodos tanto con ratón como con interacción táctil.
- El lenguaje y la presentación se adecuan a niñas de 9 a 12 años.

## Requisitos funcionales

- **RF-01:** El sistema debe permitir partidas de 1 a 4 jugadoras.
- **RF-02:** El sistema debe generar, en cada ronda, un objetivo entero aleatorio entre 1 y 100.
- **RF-03:** El sistema debe generar, en cada ronda, cuatro cartas con valores enteros aleatorios entre 1 y 10.
- **RF-04:** El sistema debe mostrar a todas las jugadoras exactamente el mismo reto de ronda.
- **RF-05:** El sistema debe permitir elegir, antes de iniciar la partida, un nivel de dificultad que determine el tiempo limitado de resolución de cada ronda: fácil (60 segundos), medio (45 segundos) o difícil (30 segundos).
- **RF-06:** Cuando hay más de una jugadora, el sistema debe ofrecer un botón individual por jugadora para que cada una, de forma independiente, pase a introducir su operación en cuanto esté lista, sin esperar a las demás. Al agotarse el tiempo de la ronda, el sistema debe permitir igualmente que cualquier jugadora pendiente introduzca su operación.
- **RF-06a:** Tras introducir y validar una operación, el sistema debe mostrar inmediatamente el resultado obtenido.
- **RF-06b:** El sistema debe mostrar en todo momento, mientras la partida está en curso, un marcador con la puntuación de todas las jugadoras ordenado de mayor a menor puntuación.
- **RF-07:** El sistema debe aceptar operaciones combinadas que usen suma, resta, multiplicación y división.
- **RF-07a:** El sistema debe permitir que una operación válida use cualquier subconjunto de las cuatro cartas mostradas, sin usar ninguna más veces de las disponibles; puede haber cartas con valores iguales.
- **RF-08:** El sistema debe calcular el resultado de cada operación respetando el orden de las operaciones y los paréntesis cuando se utilicen.
- **RF-09:** El sistema debe rechazar entradas matemáticamente inválidas, incluidas las divisiones entre cero y las que produzcan un resultado intermedio o final igual a cero, negativo o no entero.
- **RF-10:** El sistema debe asignar 2 puntos a cada jugadora que alcance exactamente el objetivo; si varias lo alcanzan, todas reciben 2 puntos.
- **RF-11:** Si nadie alcanza el objetivo, el sistema debe asignar 1 punto a cada jugadora con la menor distancia absoluta al objetivo; los empates reciben el mismo punto.
- **RF-12:** El sistema debe conservar las puntuaciones únicamente durante la sesión de la partida abierta.
- **RF-13:** El sistema debe permitir elegir entre 5 y 10 rondas antes de comenzar y mostrar el resultado acumulado y la ganadora o ganadoras al terminar las rondas configuradas.
- **RF-14:** El sistema debe permitir comenzar una nueva partida desde la pantalla final.

## Límites del producto

- Numix no requiere cuentas, inicio de sesión ni almacenamiento de partidas o datos personales.
- Numix no incluye juego remoto, chat ni comunicación entre dispositivos: una jugadora practica en solitario o varias participantes comparten una misma pantalla durante la sesión.
- Numix se centra en operaciones con suma, resta, multiplicación y división; no incluye potencias, raíces ni otros operadores.

## Métricas de éxito

- Una niña de 9 a 12 años puede comenzar una partida individual o con otras jugadoras y comprender el reto de la primera ronda sin instrucciones externas.
- En una partida completa, los resultados de las operaciones y los puntos concedidos coinciden con las reglas aprobadas en todos los casos.
- Las participantes pueden completar una partida desde portátil, tablet o móvil sin que la interfaz impida introducir una operación o consultar la puntuación.

## Revisión y aceptación

- [x] **Claridad:** se definen objetivo, cartas, operaciones permitidas, uso de subconjuntos de cartas sin exceder las disponibles, temporizador, puntuación y final de partida.
- [x] **Completitud:** se cubren la configuración, el desarrollo de una ronda, la introducción de respuestas, los empates, la puntuación acumulada y una nueva partida.
- [x] **Comprobabilidad:** todos los requisitos incluyen límites o comportamientos observables, incluidos rangos, tiempos, puntuaciones y validaciones matemáticas.
- [x] **Valor para la usuaria:** el flujo se alinea con la práctica de operaciones combinadas para niñas de 9 a 12 años mediante retos breves y compartidos.
- [x] **Límites definidos:** no hay persistencia, cuentas, juego remoto, chat ni operadores distintos de suma, resta, multiplicación y división.
- [x] **Suposiciones sin resolver:** ninguna.
