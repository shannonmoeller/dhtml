export function typeOf(a) {
  return Object.prototype.toString.call(a).slice(8, -1);
}

export function deepEqualArray(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((x, i) => deepEqual(a[i], b[i]));
}

export function deepEqualObject(a, b) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  
  if (aKeys.join() !== bKeys.join()) {
    return false;
  }

  return aKeys.every((key) => deepEqual(a[key], b[key]));
}

export function deepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }

  const typeOfA = typeOf(a);
  const typeOfB = typeOf(b);

  if (typeOfA !== typeOfB) {
    return false;
  }

  if (typeOfA === 'Array') {
    return deepEqualArray(a, b);
  }

  if (typeOfA === 'Object') {
    return deepEqualObject(a, b);
  }

  return false;
}