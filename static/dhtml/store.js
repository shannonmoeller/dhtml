export function createStore(state) {
  const listeners = new Set();

  function subscribe(fn, immediate = true) {
    listeners.add(fn);

    if (immediate) {
      fn(state);
    }

    return () => {
      listeners.delete(fn);
    };
  }

  function dispatch() {
    listeners.forEach((fn) => fn(state));
  }

  function get() {
    return state;
  }

  function set(next) {
    state = typeof next === 'function'
      ? next(state)
      : next;

    dispatch();
  }

  return {
    subscribe,
    dispatch,
    get,
    set,
  };
}