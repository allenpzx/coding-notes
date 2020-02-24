/**
 * @param {object}
 * @return {string}
 */

function getType(obj) {
  return Object.prototype.toString
    .call(obj)
    .match(/\s[a-zA-Z]+/)[0]
    .toLowerCase();
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

isFinite(Infinity);  // false
isFinite(NaN);       // false
isFinite(-Infinity); // false

isFinite(0);         // true
isFinite(2e64);      // true
isFinite(910);       // true
isFinite(null);      // true, would've been false with the 
                     // more robust Number.isFinite(null)
isFinite('0');       // true, would've been false with the 
                     // more robust Number.isFinite("0")

function isArray(value) {
  return value && typeof value === "object" && value.constructor === Array;
  // return value && String.prototype.toLowerCase.call(value.constructor.name) === 'array'
}

Array.isArray(value);

function isFunction(value) {
  return typeof value === "function";
}

function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}

function isNull(value) {
  return value === null;
}

// Returns if a value is undefined
function isUndefined(value) {
  return typeof value === "undefined";
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isRegExp(value) {
  return value && typeof value === "object" && value.constructor === RegExp;
}

function isError(value) {
  return value instanceof Error && typeof value.message !== "undefined";
}

function isDate(value) {
  return value instanceof Date;
}

function isSymbol(value) {
  return typeof value === "symbol";
}
