// Dados simulados
const professionals = [
    {
        id: 1,
        name: "Adriana Estevão",
        rating: 4.5,
        feedbacks: [
            { rating: 5, text: "Excelente profissional, muito atenciosa!", author: "Maria Silva" },
            { rating: 4, text: "Ótimo trabalho, recomendo!", author: "Ana Costa" },
            { rating: 5, text: "Sempre saio satisfeita!", author: "Carla Santos" }
        ],
        availability: {
            segunda: ["09:00", "10:00", "14:00", "15:00", "16:00"],
            terca: ["09:00", "11:00", "14:00", "15:00"],
            quarta: ["10:00", "11:00", "14:00", "16:00", "17:00"],
            quinta: ["09:00", "10:00", "15:00", "16:00"],
            sexta: ["09:00", "14:00", "15:00", "16:00", "17:00"]
        }
    },
    {
        id: 2,
        name: "Luzia Fernandes",
        rating: 4.8,
        feedbacks: [
            { rating: 5, text: "Profissional incrível, super recomendo!", author: "Beatriz Lima" },
            { rating: 5, text: "Trabalho perfeito, muito cuidadosa!", author: "Fernanda Rocha" },
            { rating: 4, text: "Muito boa, voltarei sempre!", author: "Juliana Melo" }
        ],
        availability: {
            segunda: ["08:00", "09:00", "14:00", "15:00", "16:00", "17:00"],
            terca: ["09:00", "10:00", "11:00", "14:00", "15:00"],
            quarta: ["08:00", "09:00", "14:00", "16:00", "17:00"],
            quinta: ["09:00", "10:00", "14:00", "15:00", "16:00"],
            sexta: ["08:00", "09:00", "14:00", "15:00", "16:00"]
        }
    },
    {
        id: 3,
        name: "Camila Santos",
        rating: 4.2,
        feedbacks: [
            { rating: 4, text: "Boa profissional, trabalho de qualidade!", author: "Patricia Alves" },
            { rating: 5, text: "Adorei o resultado!", author: "Roberta Silva" },
            { rating: 4, text: "Muito atenciosa e cuidadosa!", author: "Luciana Costa" }
        ],
        availability: {
            segunda: ["10:00", "11:00", "15:00", "16:00"],
            terca: ["09:00", "10:00", "14:00", "15:00", "16:00"],
            quarta: ["09:00", "11:00", "14:00", "15:00"],
            quinta: ["10:00", "11:00", "14:00", "16:00", "17:00"],
            sexta: ["09:00", "10:00", "15:00", "16:00"]
        }
    }
];

const appointments = [
    {
        id: 1,
        service: "Corte",
        professional: "Adriana Estevão",
        time: "17h00",
        client: {
            name: "Maria Silva",
            email: "maria.silva@email.com",
            phone: "(11) 99999-9999",
            photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        }
    },
    {
        id: 2,
        service: "Luzes",
        professional: "Adriana Estevão",
        time: "17h00",
        client: {
            name: "Ana Costa",
            email: "ana.costa@email.com",
            phone: "(11) 88888-8888",
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
    },
    {
        id: 3,
        service: "Maquiagem",
        professional: "Luzia",
        time: "17h00",
        client: {
            name: "Carla Santos",
            email: "carla.santos@email.com",
            phone: "(11) 77777-7777",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
        }
    },
    {
        id: 4,
        service: "Corte",
        professional: "Adriana Estevão",
        time: "17h00",
        client: {
            name: "Beatriz Lima",
            email: "beatriz.lima@email.com",
            phone: "(11) 66666-6666",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
    }
];

let currentAppointment = null;

// Navegação entre telas
function navigateTo(screenId) {
    // Remove classe active de todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Adiciona classe active na tela desejada
    document.getElementById(screenId).classList.add('active');
    
    // Carrega dados específicos da tela
    if (screenId === 'appointments-screen') {
        loadAppointments();
    } else if (screenId === 'professionals-screen') {
        loadProfessionals();
    }
}

// Carrega lista de agendamentos
function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        appointmentCard.innerHTML = `
            <div class="appointment-header">
                <div>
                    <div class="service-name">${appointment.service}</div>
                    <div class="appointment-time">Profissional: ${appointment.professional}</div>
                    <div class="appointment-time">${appointment.time}</div>
                </div>
            </div>
            <button class="appointment-details-btn" onclick="showAppointmentDetails(${appointment.id})">
                Detalhes
            </button>
        `;
        appointmentsList.appendChild(appointmentCard);
    });
}

// Mostra detalhes do agendamento
function showAppointmentDetails(appointmentId) {
    currentAppointment = appointments.find(app => app.id === appointmentId);
    
    const detailsContent = document.getElementById('appointment-details-content');
    detailsContent.innerHTML = `
        <div class="service-title">(${currentAppointment.service})</div>
        
        <div class="detail-item">
            <div class="detail-label">Profissional</div>
            <div class="detail-value">${currentAppointment.professional}</div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">Horário</div>
            <div class="detail-value">${currentAppointment.time}</div>
        </div>
        
        <img src="${currentAppointment.client.photo}" alt="Foto do cliente" class="client-photo">
        
        <div class="detail-item">
            <div class="detail-label">Cliente</div>
            <div class="detail-value">${currentAppointment.client.name}</div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">email cliente</div>
            <div class="detail-value">${currentAppointment.client.email}</div>
        </div>
        
        <div class="detail-item">
            <div class="detail-label">numero cliente</div>
            <div class="detail-value">${currentAppointment.client.phone}</div>
        </div>
        
        <button class="reschedule-btn" onclick="rescheduleAppointment()">
            Reagendar
        </button>
    `;
    
    navigateTo('appointment-details-screen');
}

// Reagenda agendamento
function rescheduleAppointment() {
    if (currentAppointment) {
        alert(`Reagendamento solicitado para ${currentAppointment.service} - ${currentAppointment.client.name}`);
        // Aqui seria implementada a lógica de reagendamento
    }
}

// Carrega lista de profissionais
function loadProfessionals() {
    const dropdown = document.getElementById('professional-dropdown');
    dropdown.innerHTML = '<option value="">Escolher Profissional</option>';
    
    professionals.forEach(professional => {
        const option = document.createElement('option');
        option.value = professional.id;
        option.textContent = professional.name;
        dropdown.appendChild(option);
    });
}

// Carrega dados do profissional selecionado
function loadProfessionalData() {
    const dropdown = document.getElementById('professional-dropdown');
    const professionalId = parseInt(dropdown.value);
    const detailsDiv = document.getElementById('professional-details');
    
    if (!professionalId) {
        detailsDiv.style.display = 'none';
        return;
    }
    
    const professional = professionals.find(p => p.id === professionalId);
    if (!professional) return;
    
    // Mostra seção de detalhes
    detailsDiv.style.display = 'block';
    
    // Atualiza avaliação
    updateRating(professional.rating);
    
    // Carrega feedbacks
    loadFeedbacks(professional.feedbacks);
    
    // Carrega disponibilidade
    loadAvailability(professional.availability);
}

// Atualiza exibição da avaliação
function updateRating(rating) {
    const stars = document.querySelectorAll('#rating-stars i');
    stars.forEach((star, index) => {
        if (index < Math.floor(rating)) {
            star.className = 'fas fa-star active';
        } else if (index < rating) {
            star.className = 'fas fa-star-half-alt active';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// Carrega feedbacks
function loadFeedbacks(feedbacks) {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';
    
    feedbacks.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        
        const starsHtml = Array(5).fill(0).map((_, i) => 
            `<i class="fas fa-star${i < feedback.rating ? '' : ' far'}" style="color: ${i < feedback.rating ? '#ffd700' : '#ddd'}"></i>`
        ).join('');
        
        feedbackItem.innerHTML = `
            <div class="feedback-rating">${starsHtml}</div>
            <div class="feedback-text">${feedback.text}</div>
            <div class="feedback-author">- ${feedback.author}</div>
        `;
        
        feedbackList.appendChild(feedbackItem);
    });
}

// Carrega disponibilidade
function loadAvailability(availability) {
    Object.keys(availability).forEach(day => {
        const slotsContainer = document.getElementById(`${day}-slots`);
        slotsContainer.innerHTML = '';
        
        // Gera horários de 8h às 18h
        for (let hour = 8; hour <= 18; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            timeSlot.textContent = timeString;
            
            if (availability[day].includes(timeString)) {
                timeSlot.classList.add('available');
                timeSlot.title = 'Disponível';
            } else {
                timeSlot.classList.add('busy');
                timeSlot.title = 'Ocupado';
            }
            
            timeSlot.addEventListener('click', () => toggleTimeSlot(timeSlot, day, timeString));
            slotsContainer.appendChild(timeSlot);
        }
    });
}

// Alterna disponibilidade de horário
function toggleTimeSlot(slot, day, time) {
    const dropdown = document.getElementById('professional-dropdown');
    const professionalId = parseInt(dropdown.value);
    const professional = professionals.find(p => p.id === professionalId);
    
    if (!professional) return;
    
    if (slot.classList.contains('available')) {
        slot.classList.remove('available');
        slot.classList.add('busy');
        slot.title = 'Ocupado';
        
        // Remove da lista de disponibilidade
        const index = professional.availability[day].indexOf(time);
        if (index > -1) {
            professional.availability[day].splice(index, 1);
        }
    } else {
        slot.classList.remove('busy');
        slot.classList.add('available');
        slot.title = 'Disponível';
        
        // Adiciona à lista de disponibilidade
        if (!professional.availability[day].includes(time)) {
            professional.availability[day].push(time);
            professional.availability[day].sort();
        }
    }
    
    // Feedback visual
    slot.style.transform = 'scale(0.95)';
    setTimeout(() => {
        slot.style.transform = 'scale(1)';
    }, 150);
}

// Sistema de avaliação interativo
document.addEventListener('DOMContentLoaded', function() {
    const ratingStars = document.querySelectorAll('#rating-stars i');
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            updateRating(rating);
            
            // Aqui você salvaria a nova avaliação
            const dropdown = document.getElementById('professional-dropdown');
            const professionalId = parseInt(dropdown.value);
            const professional = professionals.find(p => p.id === professionalId);
            
            if (professional) {
                professional.rating = rating;
                showNotification(`Avaliação atualizada: ${rating} estrelas`);
            }
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = index + 1;
            updateRatingHover(rating);
        });
    });
    
    document.getElementById('rating-stars').addEventListener('mouseleave', () => {
        const dropdown = document.getElementById('professional-dropdown');
        const professionalId = parseInt(dropdown.value);
        const professional = professionals.find(p => p.id === professionalId);
        
        if (professional) {
            updateRating(professional.rating);
        }
    });
});

// Atualiza avaliação no hover
function updateRatingHover(rating) {
    const stars = document.querySelectorAll('#rating-stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star active';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// Mostra notificação
function showNotification(message) {
    // Cria elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adiciona animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados iniciais se necessário
    console.log('Sistema Glamour Manager carregado com sucesso!');
    
    // Adiciona efeitos de hover nos botões
    document.querySelectorAll('.action-btn, .appointment-details-btn, .reschedule-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Adiciona efeito de clique nos cards
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('appointment-card') || e.target.closest('.appointment-card')) {
            const card = e.target.classList.contains('appointment-card') ? e.target : e.target.closest('.appointment-card');
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

