// let foo = <div id="foo">Hello!</div>;
// 通过 tanspilation，会变成

// var foo = h('div', { id: 'foo' }, 'Hello!');

function h(nodeName, attributes, ...args) {
  let children = args.length ? [].concat(...args) : null;
  return {
    nodeName,
    attributes,
    children,
  }
}

function render(vnode) {
  // Strings just convert #text Nodes.
  if (vnode.split) {
    return document.createTextNode(vnode);
  }

  // create a DOM element with the nodeName of our VDOM element.
  const n = document.createElement(vnode.nodeName);

  // copy attributes onto the new node
  const a = vnode.attributes || {};
  Object.keys(a).forEach(k => n.setAttribute(k, a[k]));

  // render and then append child nodes
  (vnode.children || []).forEach(c  => n.appendChild(render(c)));

  return n;
}

const arr = ['1', '2', '3'];

function foo(items) {
  return items.map(val => <li>{val}</li>);
}

let vdom = <ul>{foo(arr)}</ul>;

document.body.appendChild(render(vdom));