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

function createDom(fiber) {
  const dom = fiber.type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(fiber.type);

  const isProperty = (key) => key !== 'children';
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = fiber.props[key];
    });
  
  return dom;
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  console.log('fiber', fiber);
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

const MyReact = {
  createElement,
  render,
};