/*
  Asses argument if true or false
*/
export function bool(arg: string | boolean | number) {
  if (typeof arg === 'boolean') {
    return arg;
  }
  if (typeof arg === 'string') {
    return arg === 'true';
  }
  if (typeof arg === 'number') {
    return arg === 1;
  }
}
