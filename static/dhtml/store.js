export function createStore(state) {
  const listeners = new Set();

  function get() {
    return state;
  }

  function set(next) {
    state = typeof next === 'function'
      ? next(state)
      : next;

    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn, immediate = true) {
    listeners.add(fn);

    if (immediate) {
      fn(state);
    }

    return () => listeners.delete(fn);
  }

  return {
    get,
    set,
    subscribe,
  };
}