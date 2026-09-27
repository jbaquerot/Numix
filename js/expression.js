import { OPERATORS } from "./constants.js";

const OPERATOR_SET = new Set(OPERATORS);

export class ExpressionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExpressionError";
  }
}

/** Convierte texto matemático permitido en tokens sin evaluarlo. */
export function tokenizeExpression(source) {
  if (typeof source !== "string" || source.trim() === "") {
    throw new ExpressionError("Escribe una operación.");
  }

  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const character = source[index];
    if (/\s/.test(character)) {
      index += 1;
    } else if (/\d/.test(character)) {
      const start = index;
      while (index < source.length && /\d/.test(source[index])) index += 1;
      tokens.push({ type: "number", value: Number(source.slice(start, index)) });
    } else if (OPERATOR_SET.has(character)) {
      tokens.push({ type: "operator", value: character });
      index += 1;
    } else if (character === "(" || character === ")") {
      tokens.push({ type: "parenthesis", value: character });
      index += 1;
    } else {
      throw new ExpressionError(`El símbolo «${character}» no está permitido.`);
    }
  }

  return tokens;
}

/** Analiza una expresión con precedencia aritmética y devuelve un árbol seguro. */
export function parseExpression(source) {
  const tokens = tokenizeExpression(source);
  let position = 0;

  const current = () => tokens[position];
  const consume = () => tokens[position++];

  function parsePrimary() {
    const token = consume();
    if (!token) throw new ExpressionError("La operación está incompleta.");
    if (token.type === "number") return { type: "number", value: token.value };
    if (token.value === "(") {
      const expression = parseAdditive();
      if (consume()?.value !== ")") {
        throw new ExpressionError("Falta cerrar un paréntesis.");
      }
      return expression;
    }
    throw new ExpressionError("Se esperaba un número o un paréntesis.");
  }

  function parseMultiplicative() {
    let node = parsePrimary();
    while (["*", "/"].includes(current()?.value)) {
      const operator = consume().value;
      node = { type: "operation", operator, left: node, right: parsePrimary() };
    }
    return node;
  }

  function parseAdditive() {
    let node = parseMultiplicative();
    while (["+", "-"].includes(current()?.value)) {
      const operator = consume().value;
      node = { type: "operation", operator, left: node, right: parseMultiplicative() };
    }
    return node;
  }

  const tree = parseAdditive();
  if (current()) throw new ExpressionError("La operación contiene elementos sin conectar.");
  return tree;
}

function collectNumbers(node, numbers = []) {
  if (node.type === "number") {
    numbers.push(node.value);
  } else {
    collectNumbers(node.left, numbers);
    collectNumbers(node.right, numbers);
  }
  return numbers;
}

/** Comprueba que ninguna carta se use más veces de las disponibles. */
export function validateCards(tree, cards) {
  if (!Array.isArray(cards) || cards.length !== 4 || !cards.every(Number.isInteger)) {
    throw new ExpressionError("Las cartas de la ronda no son válidas.");
  }

  const available = cards.reduce((counts, card) => ({ ...counts, [card]: (counts[card] ?? 0) + 1 }), {});
  const used = collectNumbers(tree);
  if (used.some((card) => !available[card] || --available[card] < 0)) throw new ExpressionError("Solo puedes usar cada carta una vez.");
  return true;
}

/** Evalúa un árbol válido y exige enteros positivos en cada paso. */
export function evaluateExpression(tree) {
  if (tree.type === "number") {
    if (!Number.isInteger(tree.value) || tree.value <= 0) {
      throw new ExpressionError("Solo se permiten números enteros positivos.");
    }
    return tree.value;
  }
  const left = evaluateExpression(tree.left);
  const right = evaluateExpression(tree.right);
  let result;
  switch (tree.operator) {
    case "+": result = left + right; break;
    case "-": result = left - right; break;
    case "*": result = left * right; break;
    case "/":
      if (right === 0 || left % right !== 0) throw new ExpressionError("La división debe dar un entero positivo.");
      result = left / right;
      break;
    default: throw new ExpressionError("El operador no está permitido.");
  }
  if (!Number.isInteger(result) || result <= 0) throw new ExpressionError("Cada resultado debe ser un entero positivo.");
  return result;
}
