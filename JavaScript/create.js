function create(proto) {
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Object prototype may only be an Object or null");
  }
  function F() {}
  F.prototype = proto;
  return new F();
}
