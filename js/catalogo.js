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

// dots
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
      imgs: "assets/imgs/imagens_principais_produtos/Espaço (500 x 400px)",
      titulo: "Corte de Cabelo",
      detalhes: "Corte a sua escolha com lavagem especial e técnica moderna.<br>Duração em média: 30-45min.<br>A partir de: R$80,00",
    },
    servico2: {
      titulo: "Maquiagem",
      detalhes: "Todos os tipos de maquiagem.<br>Duração média de 50-1h30min.<br>A partir de R$90,00.",
    },
    servico3: {
      titulo: "Mani e Pedicure",
      detalhes: "Tratamento para mãos e pés com produtos e esmaltes profissionais. <br>Duração média de 1h25min a depender do serviço prestado.\n Preços a partir de R$115,00.",
  },
  servico4: {
    titulo: "SkinCare",
    detalhes: "Hidratação, tratamento para cravos, aplicação de máscara e muito mais.<br>Duração média de 1h.<br>R$75,00."
  },
};

//declarando as constantes pra colocar em cada modal
const itensServico = document.querySelectorAll(".prservico-item");
const imgs = document.getElementById ("img_servico");
const modal = document.getElementById ("modal_servico");
const titulo = document.getElementById ("titulo_servico");
const detalhes = document.getElementById("detalhes_servico");
const fechar = document.querySelector(".modal .fechar");
const btnAgendar = document.getElementById("btn_agendar");

itensServico.forEach ((item, index) => {
  const key = `servico${index + 1}`;
  item.setAttribute ("data-key", key);

  item.addEventListener ("click", () => {
    const servico = servicos[key];
    if (servico) {
     
      titulo.textContent = servico.titulo;
      detalhes.innerHTML = servico.detalhes.replace("\n", "<br>");
      modal.style.display = "flex"; 
      imgs.src = servico.imgs;
      imgs.alt = servico.titulo;
    }
  });

});

fechar.addEventListener ("click", () => {
  modal.style.display = "none";
});


});


const container = document.getElementById("otherServices");
const modal = document.getElementById("modal_servico");
const modalImg = document.getElementById("img_servico");
const modalTitulo = document.getElementById("titulo_servico");
const modalCategoria = document.getElementById("categoria_servico");
const modalDetalhes = document.getElementById("detalhes_servico");
const modalPreco = document.getElementById("preco_servico");
const btnAgendar = document.getElementById("btn_agendar");
const btnFechar = modal.querySelector(".fechar"); // garantir dentro do modal

let currentServiceId = null;

function renderServices() {
    container.innerHTML = "";
    mockData.services.forEach(service => {
        const card = document.createElement("div");
        card.classList.add("card-servico");

        let imgHtml;
        if (service.image.endsWith(".png") || service.image.endsWith(".jpg")) {
            imgHtml = `<img src="${service.image}" alt="${service.name}">`;
        } else {
            imgHtml = `<div class="card-img">${service.image}</div>`;
        }

        card.innerHTML = `
            ${imgHtml}
            <h3 class="card-titulo">${service.name}</h3>
            <p class="card-cat">${service.category}</p>
            <p class="card-preco">R$ ${service.price.toFixed(2)}</p>
        `;

        card.addEventListener("click", () => abrirModal(service));
        container.appendChild(card);
    });
}

function abrirModal(service) {
    currentServiceId = service.id;
    modal.style.display = "flex";
    modalImg.src = service.image.endsWith(".png") || service.image.endsWith(".jpg") ? service.image : "";
    modalImg.alt = service.name;
    modalTitulo.textContent = service.name;
    modalCategoria.textContent = service.category;
    modalDetalhes.textContent = service.description;
    modalPreco.textContent = `R$ ${service.price.toFixed(2)}`;
}

// Fechar modal
btnFechar.addEventListener("click", () => modal.style.display = "none");

// Fechar clicando fora do conteúdo
modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

// Botão Agendar
btnAgendar.addEventListener("click", () => {
    if (currentServiceId) {
        window.location.href = `agendar.html?service=${currentServiceId}`;
    }
});

document.addEventListener("DOMContentLoaded", renderServices);