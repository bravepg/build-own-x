// 首先我们来看最直观的 jsx 的写法
let foo = '<div class="myDiv">Hello world</div>';
// 经过 babel 编译后会变成
// let foo = h('div', { class: 'myDov' }, 'Hello world');

// 先暂时抛开通过 抽象语法树的编译过程，直击 h 函数是如何实现的
function h(nodeName, attributes, ...args) {
  return {
    nodeName,
    attributes,
    children: args.length ? args : null
  }
}

// 递归的时候要注意输入的参数形式，在此例中，如果写成
function renderE(nodeName, attributes, ...args) {
  // 这种形式就会很难进行终止条件的判断
}

function render(vnode) {
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  const n = document.createElement(vnode.nodeName);

  const a = vnode.attributes || {};

  Object.keys(a).forEach(k => n.setAttribute(key, a[k]));

  (vnode.children || []).forEach(node => n.appendChild(render(node)));

  return n;
}