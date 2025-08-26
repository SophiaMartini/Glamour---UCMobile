// JavaScript para página de feedback

let currentAppointment = null;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!utils.requireAuth()) return;
    
    // Carregar componentes
    loadComponents();
    
    // Carregar dados do agendamento
    loadAppointmentData();
    
    // Configurar eventos
    setupEventListeners();
});


// Carregar dados do agendamento
function loadAppointmentData() {
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('appointment');
    
    if (!appointmentId) {
        utils.showNotification('Agendamento não encontrado', 'error');
        setTimeout(() => {
            window.location.href = 'agendamento.html';
        }, 2000);
        return;
    }
    
    currentAppointment = mockData.appointments.find(a => a.id === parseInt(appointmentId));
    
    if (!currentAppointment) {
        utils.showNotification('Agendamento não encontrado', 'error');
        setTimeout(() => {
            window.location.href = 'agendamento.html';
        }, 2000);
        return;
    }
    
    // Verificar se já tem feedback
    const existingFeedback = mockData.feedback.find(f => f.appointmentId === currentAppointment.id);
    if (existingFeedback) {
        showExistingFeedback(existingFeedback);
        return;
    }
    
    // Carregar informações do serviço
    loadServiceInfo();
}

// Carregar informações do serviço
function loadServiceInfo() {
    const service = dataUtils.getServiceById(currentAppointment.serviceId);
    const professional = dataUtils.getProfessionalById(currentAppointment.professionalId);
    
    const container = document.getElementById('serviceInfo');
    
    container.innerHTML = `
        <h3>${service.name}</h3>
        <p><i class="fas fa-user" style="margin-right: 8px;"></i> Profissional: ${professional.name}</p>
        <p><i class="fas fa-calendar" style="margin-right: 8px;"></i> ${dataUtils.formatDate(currentAppointment.date)}</p>
        <p><i class="fas fa-clock" style="margin-right: 8px;"></i> ${currentAppointment.time}</p>
    `;
}

// Configurar event listeners
function setupEventListeners() {
    const stars = document.querySelectorAll('.star');
    const textarea = document.getElementById('feedbackComment');
    const form = document.getElementById('feedbackForm');
    
    // Sistema de avaliação
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            setRating(rating);
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
        });
    });
    
    // Reset ao sair da área de estrelas
    document.getElementById('ratingStars').addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });
    
    // Contador de caracteres
    textarea.addEventListener('input', updateCharCounter);
    
    // Formulário
    form.addEventListener('submit', handleFormSubmit);
}

// Definir avaliação
function setRating(rating) {
    selectedRating = rating;
    highlightStars(rating);
    updateRatingText(rating);
    updateSubmitButton();
    
    // Adicionar efeito de pulse na estrela clicada
    const clickedStar = document.querySelector(`[data-rating="${rating}"]`);
    clickedStar.classList.add('pulse');
    setTimeout(() => {
        clickedStar.classList.remove('pulse');
    }, 300);
    
    // Vibrar dispositivo se suportado
    utils.vibrate([50]);
}

// Destacar estrelas
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Atualizar texto da avaliação
function updateRatingText(rating) {
    const ratingText = document.getElementById('ratingText');
    const texts = {
        1: 'Muito insatisfeito 😞',
        2: 'Insatisfeito 😐',
        3: 'Neutro 😊',
        4: 'Satisfeito 😄',
        5: 'Muito satisfeito 🤩'
    };
    
    ratingText.textContent = texts[rating] || 'Toque nas estrelas para avaliar';
}

// Atualizar contador de caracteres
function updateCharCounter() {
    const textarea = document.getElementById('feedbackComment');
    const charCount = document.getElementById('charCount');
    
    const currentLength = textarea.value.length;
    charCount.textContent = currentLength;
    
    // Mudar cor se próximo do limite
    if (currentLength > 450) {
        charCount.style.color = '#ff6b6b';
    } else if (currentLength > 400) {
        charCount.style.color = '#ffa500';
    } else {
        charCount.style.color = '#666';
    }
}

// Atualizar botão de enviar
function updateSubmitButton() {
    const button = document.getElementById('submitButton');
    
    if (selectedRating > 0) {
        button.disabled = false;
        button.innerHTML = `
            <i class="fas fa-star" style="margin-right: 8px;"></i>
            Enviar Feedback (${selectedRating} estrela${selectedRating > 1 ? 's' : ''})
        `;
    } else {
        button.disabled = true;
        button.innerHTML = `
            <i class="fas fa-star" style="margin-right: 8px;"></i>
            Enviar Feedback
        `;
    }
}

// Manipular submissão do formulário
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (selectedRating === 0) {
        utils.showNotification('Por favor, selecione uma avaliação', 'error');
        return;
    }
    
    const comment = document.getElementById('feedbackComment').value.trim();
    
    if (!comment) {
        utils.showNotification('Por favor, escreva um comentário', 'error');
        return;
    }
    
    // Criar feedback
    const feedback = {
        appointmentId: currentAppointment.id,
        rating: selectedRating,
        comment: comment
    };
    
    // Salvar feedback
    const newFeedback = dataUtils.addFeedback(feedback);
    
    if (newFeedback) {
        showSuccessMessage();
    } else {
        utils.showNotification('Erro ao enviar feedback', 'error');
    }
}

// Mostrar mensagem de sucesso
function showSuccessMessage() {
    const mainContent = document.querySelector('.main-content');
    
    mainContent.innerHTML = `
        <section class="section">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <button class="header-icon" onclick="goBack()" style="background: #f0f0f0;">
                    <i class="fas fa-arrow-left" style="color: #333;"></i>
                </button>
                <h1 style="margin: 0; font-size: 24px;">Feedback Enviado</h1>
            </div>
        </section>
        
        <section class="section">
            <div class="feedback-success fade-in">
                <i class="fas fa-check-circle"></i>
                <h3>Obrigado pelo seu feedback!</h3>
                <p>Sua avaliação é muito importante para nós e ajuda outros clientes a escolherem o melhor serviço.</p>
                
                <div style="margin: 32px 0;">
                    <div class="rating-stars">
                        ${generateStarsDisplay(selectedRating)}
                    </div>
                    <p style="margin-top: 12px; font-weight: 500;">${selectedRating} estrela${selectedRating > 1 ? 's' : ''}</p>
                </div>
                
                <button class="btn btn-full" onclick="goToHistory()" style="margin-top: 24px;">
                    <i class="fas fa-history" style="margin-right: 8px;"></i>
                    Ver Histórico
                </button>
                
                <button class="btn btn-secondary btn-full" onclick="goToHome()" style="margin-top: 12px;">
                    <i class="fas fa-home" style="margin-right: 8px;"></i>
                    Voltar ao Início
                </button>
            </div>
        </section>
    `;
}

// Gerar display de estrelas
function generateStarsDisplay(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star star ${i <= rating ? 'active' : ''}" style="font-size: 24px;"></i>`;
    }
    return stars;
}

// Mostrar feedback existente
function showExistingFeedback(feedback) {
    const mainContent = document.querySelector('.main-content');
    const service = dataUtils.getServiceById(currentAppointment.serviceId);
    const professional = dataUtils.getProfessionalById(currentAppointment.professionalId);
    
    mainContent.innerHTML = `
        <section class="section">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <button class="header-icon" onclick="goBack()" style="background: #f0f0f0;">
                    <i class="fas fa-arrow-left" style="color: #333;"></i>
                </button>
                <h1 style="margin: 0; font-size: 24px;">Sua Avaliação</h1>
            </div>
        </section>
        
        <section class="section">
            <div class="feedback-card">
                <div class="feedback-header">
                    <h2>Avaliação Enviada</h2>
                </div>
                
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <p><i class="fas fa-user" style="margin-right: 8px;"></i> Profissional: ${professional.name}</p>
                    <p><i class="fas fa-calendar" style="margin-right: 8px;"></i> ${dataUtils.formatDate(currentAppointment.date)}</p>
                    <p><i class="fas fa-clock" style="margin-right: 8px;"></i> ${currentAppointment.time}</p>
                </div>
                
                <div class="rating-section">
                    <div class="rating-stars">
                        ${generateStarsDisplay(feedback.rating)}
                    </div>
                    <p class="rating-text">${feedback.rating} estrela${feedback.rating > 1 ? 's' : ''}</p>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Seu comentário:</label>
                    <div style="background: rgba(255,255,255,0.9); border-radius: 12px; padding: 16px; border: 2px solid rgba(255,255,255,0.8);">
                        "${feedback.comment}"
                    </div>
                </div>
                
                <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
                    Avaliação enviada em ${dataUtils.formatDate(feedback.date)}
                </p>
            </div>
        </section>
    `;
}

// Navegar para histórico
function goToHistory() {
    window.location.href = 'historico.html';
}

// Navegar para home
function goToHome() {
    window.location.href = 'index.html';
}

// Voltar
function goBack() {
    window.history.back();
}

