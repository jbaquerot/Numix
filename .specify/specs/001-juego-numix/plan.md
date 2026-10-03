# Plan técnico: Numix

**Funcionalidad:** `001-juego-numix`  
**Basado en:** [spec.md](spec.md)  
**Estado:** Borrador  
**Fecha:** 2026-09-27

## Resumen técnico

Numix será una aplicación web estática, sin servidor ni persistencia, distribuida mediante GitHub Pages. Usará HTML semántico, CSS responsive y JavaScript moderno sin dependencias de ejecución. Todo el estado de la partida vivirá en memoria del navegador y se perderá al recargar o cerrar la página, conforme a la especificación.

No se usarán FastAPI, MongoDB ni React: son incompatibles con el requisito explícito de una página HTML + JavaScript desplegable sin infraestructura en GitHub Pages.

## Arquitectura

La aplicación se organiza en tres capas, comunicadas desde un punto de entrada:

```text
index.html
    |
    v
Interfaz (UI y eventos) <--> Estado de partida <--> Dominio matemático y reglas
                                      |
                                      v
                            Renderizado de pantallas
```

### Dominio matemático y reglas

Módulos JavaScript puros y sin acceso al DOM que se puedan probar de manera aislada:

- Generación de objetivo entero entre 1 y 100 y de cuatro cartas enteras entre 1 y 10, permitiendo repeticiones.
- Validación estructural de una operación: usa un subconjunto de las cartas dadas, sin repetir ninguna más veces de las disponibles, y solo `+`, `−`, `×`, `÷` y paréntesis.
- Evaluación segura de operaciones sin ejecutar texto arbitrario como código.
- Comprobación de que todos los resultados intermedios y final sean enteros positivos; rechaza divisiones por cero y divisiones no exactas.
- Cálculo de distancia al objetivo, puntuación de ronda —incluyendo empates— y clasificación final.

### Estado de partida

Un único objeto de estado en memoria representa la sesión:

```text
Partida
├── configuración: jugadoras (1–4), rondas (5–10), dificultad y duración
├── ronda actual: índice, objetivo, cartas, tiempo restante y fase
├── respuestas: operación y resultado por jugadora
└── marcador: puntos acumulados por jugadora
```

Las fases de una ronda serán: `preparada`, `resolviendo`, `resultados` y `finalizada`. Dentro de `resolviendo`, cada jugadora progresa de forma independiente: a la espera (puede pulsar su propio botón «Ya lo tengo» en cualquier momento), introduciendo su operación, o ya respondida. El temporizador compartido sigue corriendo para quien no haya pulsado su botón; al agotarse, las jugadoras pendientes pasan a introducir automáticamente. La ronda solo cambia a `resultados` cuando todas las jugadoras han enviado una operación válida. Las transiciones estarán centralizadas para impedir, por ejemplo, iniciar una ronda posterior antes de resolver la actual.

### Interfaz y renderizado

La interfaz se renderiza desde el estado actual y presenta estas vistas:

1. **Configuración:** nombre o identificador de 1 a 4 jugadoras, número de rondas de 5 a 10 y dificultad: fácil (60 s), medio (45 s) o difícil (30 s).
2. **Resolución y respuesta por jugadora:** objetivo, cuatro cartas y temporizador visibles para todas. Cada jugadora tiene su propio botón «Ya lo tengo»; al pulsarlo, su panel pasa a mostrar el formulario de introducción mientras las demás jugadoras siguen resolviendo en papel. Al enviar una respuesta válida, muestra inmediatamente su resultado; las respuestas ya enviadas no pueden reemplazarse.
3. **Resultado de ronda:** lista de operaciones, resultados, distancia al objetivo y puntos concedidos de la ronda.
4. **Resultado final:** clasificación, ganadora o ganadoras y acción para iniciar una partida nueva.

El marcador acumulado, ordenado de mayor a menor puntuación, se muestra en un panel persistente visible en todo momento durante la partida (a la derecha en pantallas anchas, debajo del contenido principal en móvil).

El diseño será mobile-first, con controles táctiles grandes, texto legible, contraste suficiente y distribución adaptable mediante CSS Grid/Flexbox y media queries. El HTML aportará estructura semántica, etiquetas y mensajes accesibles; JavaScript gestionará el foco y los avisos de validación.

## Estructura de archivos

```text
/
├── index.html
├── styles.css
├── js/
│   ├── app.js              # Inicio, estado y coordinación de vistas
│   ├── game.js             # Creación de partidas, rondas, temporizador y puntuación
│   ├── expression.js       # Tokenización, análisis, validación y evaluación segura
│   ├── ui.js               # Renderizado y gestión de eventos de interfaz
│   └── constants.js        # Rangos, duraciones y fases de partida
├── tests/
│   ├── expression.test.js
│   └── game.test.js
├── package.json            # Solo scripts de prueba y dependencias de desarrollo
└── README.md               # Uso local y despliegue en GitHub Pages
```

## Flujos y reglas críticas

### Ciclo de una ronda

1. `game.js` genera el objetivo y las cuatro cartas.
2. `app.js` cambia la fase a `resolviendo` e inicia un temporizador con la duración elegida.
3. Cada jugadora pulsa su propio botón «Ya lo tengo» cuando quiere empezar a responder; `ui.js` muestra su formulario de respuesta sin afectar a las demás. Al agotarse el tiempo, cualquier jugadora pendiente pasa a responder automáticamente.
4. Cada envío pasa a `expression.js`, que valida y evalúa la operación antes de guardarla.
5. La interfaz muestra de inmediato el resultado válido de esa jugadora.
6. Cuando todas hayan introducido una respuesta válida, `game.js` calcula los puntos de la ronda —repartiéndolos entre empates— y actualiza el marcador.
7. La interfaz muestra el resultado y permite continuar o cerrar la partida si se alcanzó el número de rondas elegido.

### Evaluación de operaciones

La expresión se convierte en tokens permitidos y se analiza con una gramática propia o un algoritmo de pilas; no se usa `eval`, `Function` ni mecanismos equivalentes. Cada operación binaria se comprueba al construir su resultado:

- Ambos operandos son enteros positivos.
- Una división exige divisor distinto de cero y resultado entero positivo.
- Una resta exige resultado estrictamente positivo.
- Suma y multiplicación deben conservar un entero positivo.

La validación también compara el multiconjunto de números utilizados con las cuatro cartas entregadas, lo que permite valores repetidos, el uso de un subconjunto de las cartas y nunca usar una carta más veces de las disponibles.

## Interfaces y servicios externos

No hay API HTTP, backend, base de datos ni autenticación. El navegador ejecuta toda la lógica localmente. GitHub Pages solo hospeda los archivos estáticos.

## Despliegue en GitHub Pages

La estructura propuesta se puede publicar directamente desde la raíz de la rama configurada para GitHub Pages, porque `index.html` está en la raíz y todos los recursos son archivos estáticos relativos:

```text
index.html
styles.css
js/app.js
js/game.js
js/expression.js
js/ui.js
js/constants.js
```

No requiere compilación ni servidor. El archivo HTML cargará los módulos mediante rutas relativas, por ejemplo `./js/app.js`, y no debe usar rutas absolutas dependientes del dominio ni API del sistema de archivos. `package.json` y `tests/` no se publican ni son necesarios para ejecutar el juego; sirven solo para desarrollo y verificación.

## Modelo de datos en memoria

```js
{
  players: [{ id: 'p1', name: 'Ana', score: 0 }],
  settings: { totalRounds: 5, difficulty: 'medium', durationSeconds: 45 },
  currentRound: {
    number: 1,
    target: 42,
    cards: [2, 3, 4, 5],
    phase: 'resolving',
    secondsRemaining: 45,
    answers: [{ playerId: 'p1', expression: '(5-3)*4+2', result: 10 }]
  }
}
```

## Pruebas y verificación

- Pruebas unitarias de generación dentro de rangos, aceptación de cartas repetidas y uso de subconjuntos de las cuatro cartas sin excederlas.
- Pruebas de expresiones válidas, paréntesis, precedencia, divisiones no exactas, división por cero, ceros y resultados negativos intermedios.
- Pruebas de puntuación: objetivo exacto, varios aciertos exactos, resultado más cercano y empates por proximidad.
- Pruebas de transiciones de fase y finalización tras 5, 7 y 10 rondas.
- Revisión manual responsive en móvil, tablet y portátil, con teclado y pantalla táctil cuando sea posible.
- Prueba de despliegue en GitHub Pages verificando carga de módulos y rutas relativas.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Evaluar expresiones de texto de forma insegura | Analizador propio con lista cerrada de tokens; prohibir ejecución dinámica. |
| Ambigüedad con cartas de igual valor | Validar por cantidades de cada valor, no por presencia simple. |
| Temporizador impreciso en segundo plano | Calcular el tiempo restante a partir de una marca temporal y no solo de intervalos acumulados. |
| Pantallas pequeñas con expresiones largas | Campo de entrada adaptable, vista previa legible y controles táctiles amplios. |
| Respuesta inválida al introducirla | Mensaje concreto que indique la regla incumplida y permita corregir sin alterar otras respuestas. |

## Suposiciones técnicas

- Una jugadora puede practicar en solitario o varias jugadoras pueden compartir un único dispositivo y una única sesión de navegador.
- Las operaciones se escribirán como texto usando números, `+`, `-`, `*`, `/` y paréntesis; la interfaz puede mostrar símbolos matemáticos equivalentes para facilitar su lectura.
- Una respuesta válida enviada queda bloqueada durante la ronda, ya que el resultado se muestra inmediatamente.
- Las pruebas se ejecutarán con una herramienta ligera de JavaScript configurada solo como dependencia de desarrollo; no afectará al despliegue estático.
