const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

function createElement(type, config, ...children) {
  return {
    type,
    props: {
      ...config,
      children: children.map((child) => {
        if (typeof child === 'string') {
          // 为什么对于这种类型的节点需要单独处理？
          // 为了在 render 的时候，可以更加简单
          return createTextElement(child);
        }
        return child;
      }),
    },
  }
}

function render(element, container) {
  const dom = element.type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(element.type);

  const isProperty = (key) => key !== 'children';
  Object.keys(element.props).filter(isProperty).forEach((key) => {
    dom[key] = element.props[key];
  });

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

const MyReact = {
  createElement,
  render,
};