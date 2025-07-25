const carrossel = document.getElementById('carrossel');
const btnProx = document.querySelector('.proximo');
const btnAnt = document.querySelector('.anterior');
const dotsContainer = document.getElementById('carrossel-dots');
let index = 0;

function atualizarCarrossel() {
  carrossel.style.transform = `translateX(-${index * 100}%)`;

  const todosDots = dotsContainer.querySelectorAll('button');
  todosDots.forEach(dot => dot.classList.remove('ativo'));
  todosDots[index].classList.add('ativo');
}

// Botões
btnProx.addEventListener('click', () => {
  pararAutoplay();
  index = Math.min(index + 1, carrossel.children.length - 1);
  atualizarCarrossel();
  iniciarAutoplay();
});
btnAnt.addEventListener('click', () => {
  pararAutoplay();
  index = Math.max(index - 1, 0);
  atualizarCarrossel();
  iniciarAutoplay();
});

// Swipe touch
let startX = 0;
carrossel.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  pararAutoplay();
});
carrossel.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50 && index < carrossel.children.length - 1) index++;
  else if (endX - startX > 50 && index > 0) index--;
  atualizarCarrossel();
  iniciarAutoplay();
});

// Dots
[...carrossel.children].forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('ativo');
  dot.addEventListener('click', () => {
    index = i;
    atualizarCarrossel();
    pararAutoplay();
    iniciarAutoplay();
  });
  dotsContainer.appendChild(dot);
});

// Autoplay
let autoplayInterval;
function iniciarAutoplay() {
  autoplayInterval = setInterval(() => {
    index = (index + 1) % carrossel.children.length;
    atualizarCarrossel();
  }, 4000);
}
function pararAutoplay() {
  clearInterval(autoplayInterval);
}
iniciarAutoplay();