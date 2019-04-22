const templateCache = new WeakMap();

export function refs(node) {
  const refs = {};

  node.querySelectorAll('[ref]').forEach(ref => {
    refs[ref.getAttribute('ref')] = ref;
    ref.removeAttribute('ref');
  });

  return refs;
}

export function tmpl(strings) {
  if (templateCache.has(strings)) {
    return templateCache.get(strings);
  }

  const template = document.createElement('template');

  template.innerHTML = strings.join('');
  
  const { content } = template;

  templateCache.set(strings, content);

  return content;
}

export function html(strings) {
  const content = tmpl(strings);
  
  return () => content.cloneNode(true);
}

export function svg(strings) {
  const content = tmpl(strings);
  
  return () => content.cloneNode(true);
}