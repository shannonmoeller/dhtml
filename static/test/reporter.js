const el = document.body;
const { log, error } = console;

function reportLog(...args) {
  const message = args.join(' ');
  const classes = [];

  if (message.match(/^# \w/)) {
    classes.push('test--comment');
  }

  if (message.startsWith('ok')) {
    classes.push('test--success');
  }

  if (message.startsWith('not ok')) {
    classes.push('test--error');
  }

  if (message.includes('# SKIP')) {
    classes.push('test--skip');
  }

  if (message.includes('# TODO')) {
    classes.push('test--todo');
  }

  el.insertAdjacentHTML('beforeend', `
    <pre class="test ${classes.join(' ')}">${message}</pre>
  `);

  window.scrollTo(0, el.scrollHeight);

  log(...args);
}

function reportError(...args) {
  const message = args
    .map(x => JSON.stringify(x, null, 2))
    .join(' ');

  const stack = (args[0] && args[0].stack) || '';

  el.insertAdjacentHTML('beforeend', `
    <pre class="test test--error">${message}${stack}</pre>
  `);

  window.scrollTo(0, el.scrollHeight);

  error(...args);
}

export function hook() {
  console.log = reportLog;
  console.error = reportError;
  window.onerror = reportError;
}

export function unhook() {
  console.log = log;
  console.error = error;
  delete window.onerror;
}