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

// arrastar 
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

// o ngc de dar o autoplay
let autoplayInterval;
function iniciarAutoplay() {
  autoplayInterval = setInterval(() => {
    index = (index + 1) % carrossel.children.length;
    atualizarCarrossel();
  }, 5500);
}
function pararAutoplay() {
  clearInterval(autoplayInterval);
}
iniciarAutoplay();

// agora e a parte dos principais servicos

document .addEventListener("DOMContentLoaded", () => {
  const servicos = {//o conteudo que vai aparecer no modal
    servico1: {
      titulo: "Corte de Cabelo",
      detalhes: "Corte a sua escolha com lavagem especial e técnica moderna.\nDuração em média: 30-45min.\nA partir de: R$80,00",
    },
    servico2: {
      titulo: "Maquiagem",
      detalhes: "Todos os tipos de maquiagem.\nDuração média de 50-1h30min.\n A partir de R$90,00.",
    },
    servico3: {
      titulo: "Mani e Pedicure",
      detalhes: "Tratamento para mãos e pés com produtos e esmaltes profissionais. \n Duração média de 1h25min a depender do serviço prestado.\n Preços a partir de R$115,00.",
  },
  servico4: {
    titulo: "SkinCare",
    detalhes: "Hidratação, tratamento para cravos, aplicação de máscara e muito mais.\nDuração média de 1h.\n R$75,00."
  },
};

const itensServico = document.querySelectorAll(".servico-item");
const modal = document.getElementById ("modal_servico");
const titulo = document.getElementById ("titulo_servico");
const detalhes = document.getElementById("detalhes_servico");
const fechar = document.querySelector(.modal .fechar)


});