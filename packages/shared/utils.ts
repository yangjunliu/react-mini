export function getCurrentTime(): number {
  return performance.now();
}

export function isArray<T>(arg: any): arg is Array<T> {
  return Array.isArray(arg);
}

export function isFunction(arg: any): arg is Function {
  return typeof arg === "function";
}

export function isNumber(arg: any): arg is number {
  return typeof arg === "number";
}

export function isString(arg: any): arg is string {
  return typeof arg === "string";
}

export function isObject(arg: any): arg is Object {
  return typeof arg === "object" && arg !== null;
}