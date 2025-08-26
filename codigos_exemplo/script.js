
const servicesData = {
    'corte-cabelo': {
        title: 'Corte de Cabelo',
        category: 'Cabelo',
        price: 'R$ 45,00',
        icon: 'fas fa-cut',
        description: 'Corte moderno e personalizado de acordo com o formato do seu rosto e estilo pessoal. Inclui lavagem, corte e finalização com produtos profissionais.'
    },
    'manicure': {
        title: 'Manicure',
        category: 'Unhas',
        price: 'R$ 25,00',
        icon: 'fas fa-hand-sparkles',
        description: 'Cuidado completo das unhas das mãos, incluindo remoção de cutículas, modelagem, esmaltação e hidratação. Variedade de cores disponíveis.'
    },
    'escova': {
        title: 'Escova',
        category: 'Cabelo',
        price: 'R$ 35,00',
        icon: 'fas fa-wind',
        description: 'Escova modeladora para deixar seus cabelos lisos, com movimento e brilho natural. Inclui lavagem com produtos específicos para seu tipo de cabelo.'
    },
    'sobrancelha': {
        title: 'Design de Sobrancelha',
        category: 'Estética',
        price: 'R$ 20,00',
        icon: 'fas fa-eye',
        description: 'Modelagem e design personalizado de sobrancelhas com técnicas de depilação e definição para realçar o olhar e harmonizar o rosto.'
    },
    'hidratacao': {
        title: 'Hidratação',
        category: 'Cabelo',
        price: 'R$ 60,00',
        icon: 'fas fa-tint',
        description: 'Tratamento intensivo de hidratação para cabelos ressecados e danificados. Utiliza máscaras nutritivas e produtos reparadores profissionais.'
    },
    'pedicure': {
        title: 'Pedicure',
        category: 'Unhas',
        price: 'R$ 30,00',
        icon: 'fas fa-spa',
        description: 'Cuidado completo dos pés, incluindo remoção de calosidades, corte e esmaltação das unhas, além de hidratação e massagem relaxante.'
    }
};

// Elementos do DOM
const modal = document.getElementById('serviceModal');
const schedulingPage = document.getElementById('schedulingPage');
const serviceCards = document.querySelectorAll('.service-card');
const closeBtn = document.querySelector('.close');
const scheduleBtn = document.getElementById('scheduleBtn');
const backBtn = document.getElementById('backBtn');
const schedulingForm = document.querySelector('.scheduling-form');

// Elementos do modal
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');

// Elementos da página de agendamento
const schedulingServiceTitle = document.getElementById('schedulingServiceTitle');
const schedulingServicePrice = document.getElementById('schedulingServicePrice');

// Variável para armazenar o serviço selecionado
let selectedService = null;

// Função para abrir o modal
function openModal(serviceKey) {
    const service = servicesData[serviceKey];
    if (!service) return;

    selectedService = service;

    // Atualizar conteúdo do modal
    modalIcon.className = service.icon;
    modalTitle.textContent = service.title;
    modalCategory.textContent = service.category;
    modalPrice.textContent = service.price;
    modalDescription.textContent = service.description;

    // Mostrar modal com animação
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Função para fechar o modal
function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Função para abrir a página de agendamento
function openSchedulingPage() {
    if (!selectedService) return;

    // Atualizar informações do serviço na página de agendamento
    schedulingServiceTitle.textContent = selectedService.title;
    schedulingServicePrice.textContent = selectedService.price;

    // Fechar modal
    closeModal();

    // Mostrar página de agendamento
    setTimeout(() => {
        schedulingPage.classList.remove('hidden');
        schedulingPage.classList.add('active');
    }, 300);
}

// Função para voltar da página de agendamento
function goBackToServices() {
    schedulingPage.classList.remove('active');
    setTimeout(() => {
        schedulingPage.classList.add('hidden');
    }, 300);
}

// Função para formatar data para exibição
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para confirmar agendamento
function confirmScheduling(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    // Validação básica
    if (!clientName || !clientPhone || !appointmentDate || !appointmentTime) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Simular confirmação do agendamento
    const confirmationMessage = `
Agendamento Confirmado! ✅

Serviço: ${selectedService.title}
Cliente: ${clientName}
Telefone: ${clientPhone}
Data: ${formatDate(appointmentDate)}
Horário: ${appointmentTime}
Valor: ${selectedService.price}

Obrigado por escolher nosso salão!
    `;

    alert(confirmationMessage);

    // Limpar formulário
    event.target.reset();

    // Voltar para a tela principal
    goBackToServices();
}

// Função para definir data mínima (hoje)
function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('appointmentDate');
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Definir data mínima
    setMinDate();

    // Event listeners para os cards de serviço
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceKey = this.getAttribute('data-service');
            openModal(serviceKey);
        });

        // Adicionar efeito de toque para mobile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Event listener para fechar modal
    closeBtn.addEventListener('click', closeModal);

    // Event listener para botão de agendar
    scheduleBtn.addEventListener('click', openSchedulingPage);

    // Event listener para botão voltar
    backBtn.addEventListener('click', goBackToServices);

    // Event listener para formulário de agendamento
    schedulingForm.addEventListener('submit', confirmScheduling);

    // Fechar modal clicando fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Prevenir scroll do body quando modal estiver aberto
    modal.addEventListener('wheel', function(e) {
        e.preventDefault();
    });

    // Adicionar suporte a gestos de swipe para voltar (mobile)
    let startX = 0;
    let startY = 0;

    schedulingPage.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    schedulingPage.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        const diffX = startX - currentX;
        const diffY = startY - currentY;

        // Se o movimento horizontal for maior que o vertical e for para a direita
        if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50) {
            goBackToServices();
        }

        startX = 0;
        startY = 0;
    });
});

// Função para adicionar animação de loading nos botões
function addLoadingAnimation(button, duration = 1000) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, duration);
}

// Melhorar a experiência do usuário com feedback visual
scheduleBtn.addEventListener('click', function() {
    addLoadingAnimation(this, 500);
});

// Adicionar validação em tempo real para o formulário
document.getElementById('clientPhone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    e.target.value = value;
});

// Adicionar efeito de vibração para dispositivos móveis (se suportado)
function vibrateDevice(pattern = [100]) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Usar vibração quando clicar nos cards
serviceCards.forEach(card => {
    card.addEventListener('click', () => vibrateDevice([50]));
});

console.log('🎉 Aplicação do Salão de Beleza carregada com sucesso!');

