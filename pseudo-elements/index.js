const element = document.querySelector('.pseudo-parent')
const getContent = (el) => window.getComputedStyle(el, ':before').getPropertyValue('content')

let counter = 0
const emoji = ['🙂', '😬', '🤔', '🥴']

setInterval(() => {
  element.setAttribute('data-before-content', emoji[counter])
  counter = counter === emoji.length - 1 ? 0 : counter + 1;
}, 500)
