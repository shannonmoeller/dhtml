const isInitialized = Symbol('com.npmjs.dhtml.define.initialized');

export function hyphenate(value) {
  return value
    .split(/([A-Z]?[a-z]+)/)
    .filter(Boolean)
    .join('-')
    .toLowerCase();
}

export function normalizeAttribute([name, def = {}]) {
  return {
    ...def,
    name,
    attr: def.attr || hyphenate(name),
    get: def.get || String,
    set: def.set || String,
  };
}

export function reflectAttribute(node, def) {
  const { name, attr, get, set } = def;
  const isBoolean = get === Boolean;

  Object.defineProperty(node, name, {
    get() {
      return isBoolean
        ? node.hasAttribute(attr)
        : get(node.getAttribute(attr));
    },

    set(value) {
      return isBoolean
        ? node.toggleAttribute(attr, value)
        : node.setAttribute(attr, set(value));
    },
  });
}

export function define(tagName, attrs, init) {
  if (arguments.length < 3) {
    init = attrs;
    attrs = {};
  }

  const attrDefs = Object
    .entries(attrs)
    .map(normalizeAttribute);

  const observedAttributes = attrDefs
    .map((x) => x.attr);

  class CustomElement extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }

    constructor() {
      super();

      attrDefs.forEach(def => {
        reflectAttribute(this, def);
      });
    }

    connectedCallback() {
      if (!this[isInitialized]) {
        const children = init(this);

        if (children) {
          if (Array.isArray(children)) {
            this.append(...children);
          } else {
            this.append(children);
          }
        }

        this[isInitialized] = true;
      }

      if (this.onconnect) {
        this.onconnect();
      }
    }

    disconnectedCallback() {
      if (this.ondisconnect) {
        this.ondisconnect();
      }
    }

    adoptedCallback() {
      if (this.onadopt) {
        this.onadopt();
      }
    }

    attributeChangedCallback() {
      if (this.onattributechange) {
        this.onattributechange();
      }
    }
  }

  customElements.define(tagName, CustomElement);

  return CustomElement;
}