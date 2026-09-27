import assert from "node:assert/strict";
import test from "node:test";
import { ExpressionError, evaluateExpression, parseExpression, validateCards } from "../js/expression.js";

const evaluate = (source) => evaluateExpression(parseExpression(source));

test("respeta precedencia y paréntesis", () => {
  assert.equal(evaluate("2 + 3 * 4"), 14);
  assert.equal(evaluate("(2 + 3) * 4"), 20);
});

test("acepta las cuatro cartas, incluso repetidas", () => {
  assert.equal(validateCards(parseExpression("2 * 2 + 3 + 4"), [2, 2, 3, 4]), true);
});

test("rechaza cartas omitidas o añadidas", () => {
  assert.throws(() => validateCards(parseExpression("2 + 3 + 4"), [2, 3, 4, 5]), ExpressionError);
});

test("rechaza divisiones no exactas y resultados no positivos", () => {
  assert.throws(() => evaluate("5 / 2 + 1"), ExpressionError);
  assert.throws(() => evaluate("2 - 5 + 4"), ExpressionError);
  assert.throws(() => evaluate("3 - 3 + 4"), ExpressionError);
});

test("rechaza símbolos y paréntesis inválidos", () => {
  assert.throws(() => parseExpression("2 ^ 3"), ExpressionError);
  assert.throws(() => parseExpression("(2 + 3"), ExpressionError);
});
