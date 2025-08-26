let currentAppointment = null;
let selectedProfessional = null;
let selectedDate = null;
let selectedTime = null;
let availableProfessionals = [];

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
    
    // Verificar se o agendamento pode ser alterado
    const appointmentDate = new Date(currentAppointment.date);
    const today = new Date();
    const diffHours = (appointmentDate - today) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
        showCannotModifyMessage();
        return;
    }
    
    // Carregar informações do agendamento atual
    loadCurrentAppointmentInfo();
    
    // Carregar próximos 7 dias
    loadWeekDays();
    
    // Configurar data mínima para o calendário
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('calendarInput').min = utils.formatDateForInput(tomorrow);
}

// Carregar informações do agendamento atual
function loadCurrentAppointmentInfo() {
    const service = dataUtils.getServiceById(currentAppointment.serviceId);
    const professional = dataUtils.getProfessionalById(currentAppointment.professionalId);
    
    const container = document.getElementById('currentAppointment');
    
    container.innerHTML = `
        <div class="appointment-details">
            <h3>${service.name}</h3>
            <p><i class="fas fa-user"></i> Profissional: ${professional.name}</p>
            <p><i class="fas fa-calendar"></i> ${dataUtils.formatDate(currentAppointment.date)}</p>
            <p><i class="fas fa-clock"></i> ${currentAppointment.time}</p>
            <p><i class="fas fa-dollar-sign"></i> ${utils.formatPrice(service.price)}</p>
        </div>
    `;
}

// Mostrar mensagem de não pode modificar
function showCannotModifyMessage() {
    const mainContent = document.querySelector('.main-content');
    
    mainContent.innerHTML = `
        <section class="section">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <button class="header-icon" onclick="goBack()" style="background: #f0f0f0;">
                    <i class="fas fa-arrow-left" style="color: #333;"></i>
                </button>
                <h1 style="margin: 0; font-size: 24px;">Reagendar ou Cancelar</h1>
            </div>
        </section>
        
        <section class="section">
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #ffa500; margin-bottom: 16px;"></i>
                <h3>Não é possível modificar este agendamento</h3>
                <p>Agendamentos só podem ser alterados com pelo menos 24 horas de antecedência.</p>
                <p style="margin-top: 20px;">Para cancelamentos de última hora, entre em contato conosco:</p>
                <p style="font-weight: bold; color: var(--primary-color);">(11) 9999-9999</p>
                
                <button class="btn btn-full" onclick="goBack()" style="margin-top: 24px;">
                    <i class="fas fa-arrow-left" style="margin-right: 8px;"></i>
                    Voltar
                </button>
            </div>
        </section>
    `;
}

// Carregar próximos 7 dias (excluindo hoje)
function loadWeekDays() {
    const container = document.getElementById('weekDays');
    const days = [];
    const today = new Date();
    
    // Começar de amanhã
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        days.push({
            date: utils.formatDateForInput(date),
            dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
            dayNumber: date.getDate(),
            isToday: false
        });
    }
    
    container.innerHTML = '';
    
    days.forEach(day => {
        const dayButton = document.createElement('button');
        dayButton.type = 'button';
        dayButton.className = 'day-button';
        dayButton.dataset.date = day.date;
        
        dayButton.innerHTML = `
            <div style="font-weight: 500;">${day.dayName}</div>
            <div style="font-size: 18px; margin-top: 4px;">${day.dayNumber}</div>
        `;
        
        dayButton.addEventListener('click', () => selectDate(day.date, dayButton));
        
        container.appendChild(dayButton);
    });
}

// Configurar event listeners
function setupEventListeners() {
    const periodSelect = document.getElementById('periodSelect');
    const professionalSelect = document.getElementById('professionalSelect');
    const form = document.getElementById('rescheduleForm');
    
    periodSelect.addEventListener('change', onPeriodChange);
    professionalSelect.addEventListener('change', onProfessionalChange);
    form.addEventListener('submit', onFormSubmit);
}

// Mostrar confirmação de cancelamento
function showCancelConfirmation() {
    utils.show('#cancelModal');
}

// Esconder confirmação de cancelamento
function hideCancelConfirmation() {
    utils.hide('#cancelModal');
}

// Confirmar cancelamento
function confirmCancellation() {
    const success = dataUtils.cancelAppointment(currentAppointment.id);
    
    if (success) {
        hideCancelConfirmation();
        showSuccessMessage('Agendamento cancelado com sucesso!', 'cancel');
    } else {
        utils.showNotification('Erro ao cancelar agendamento', 'error');
    }
}

// Mostrar formulário de reagendamento
function showRescheduleForm() {
    utils.show('#rescheduleSection');
    
    // Carregar profissionais disponíveis para o mesmo serviço
    loadAvailableProfessionals();
    
    // Scroll para o formulário
    utils.scrollTo('#rescheduleSection');
}

// Esconder formulário de reagendamento
function hideRescheduleForm() {
    utils.hide('#rescheduleSection');
    
    // Reset do formulário
    resetRescheduleForm();
}

// Carregar profissionais disponíveis
function loadAvailableProfessionals() {
    const professionalSelect = document.getElementById('professionalSelect');
    const service = dataUtils.getServiceById(currentAppointment.serviceId);
    
    // Limpar opções anteriores
    professionalSelect.innerHTML = '<option value="">Selecione um profissional</option>';
    
    // Buscar profissionais que fazem o serviço
    availableProfessionals = dataUtils.getProfessionalsForService(service.id);
    
    if (availableProfessionals.length === 0) {
        professionalSelect.innerHTML = '<option value="">Nenhum profissional disponível</option>';
        professionalSelect.disabled = true;
        return;
    }
    
    availableProfessionals.forEach(professional => {
        const option = document.createElement('option');
        option.value = professional.id;
        option.textContent = `${professional.name} (⭐ ${professional.rating})`;
        
        // Marcar o profissional atual como selecionado
        if (professional.id === currentAppointment.professionalId) {
            option.selected = true;
            selectedProfessional = professional;
        }
        
        professionalSelect.appendChild(option);
    });
    
    professionalSelect.disabled = false;
}

// Quando período é selecionado
function onPeriodChange() {
    const periodSelect = document.getElementById('periodSelect');
    const period = periodSelect.value;
    
    if (!period) {
        clearTimeSlots();
        return;
    }
    
    // Se já tem data e profissional selecionados, carregar horários
    if (selectedDate && selectedProfessional) {
        loadTimeSlots();
    }
}

// Quando profissional é selecionado
function onProfessionalChange() {
    const professionalSelect = document.getElementById('professionalSelect');
    const professionalId = parseInt(professionalSelect.value);
    
    if (!professionalId) {
        selectedProfessional = null;
        clearTimeSlots();
        return;
    }
    
    selectedProfessional = dataUtils.getProfessionalById(professionalId);
    
    // Se já tem data selecionada, carregar horários
    if (selectedDate) {
        loadTimeSlots();
    }
}

// Selecionar data
function selectDate(date, buttonElement) {
    // Remover seleção anterior
    document.querySelectorAll('.day-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Selecionar nova data
    buttonElement.classList.add('selected');
    selectedDate = date;
    
    // Carregar horários se profissional já foi selecionado
    if (selectedProfessional) {
        loadTimeSlots();
    }
}

// Carregar horários disponíveis
function loadTimeSlots() {
    const container = document.getElementById('timeSlots');
    
    if (!selectedProfessional || !selectedDate) {
        container.innerHTML = '<p class="text-center" style="color: #666;">Selecione um profissional e uma data</p>';
        return;
    }
    
    // Mostrar loading
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Carregando horários...</div>';
    
    // Simular delay de carregamento
    setTimeout(() => {
        const slots = dataUtils.getAvailableSlots(selectedProfessional.id, selectedDate);
        
        if (slots.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: #666;">Nenhum horário disponível para esta data</p>';
            return;
        }
        
        // Filtrar por período se selecionado
        const period = document.getElementById('periodSelect').value;
        const filteredSlots = filterSlotsByPeriod(slots, period);
        
        if (filteredSlots.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: #666;">Nenhum horário disponível para este período</p>';
            return;
        }
        
        container.innerHTML = '';
        
        filteredSlots.forEach(slot => {
            const timeButton = document.createElement('button');
            timeButton.type = 'button';
            timeButton.className = 'time-slot';
            timeButton.textContent = slot;
            timeButton.addEventListener('click', () => selectTime(slot, timeButton));
            container.appendChild(timeButton);
        });
    }, 500);
}

// Filtrar horários por período
function filterSlotsByPeriod(slots, period) {
    if (!period) return slots;
    
    return slots.filter(slot => {
        const hour = parseInt(slot.split(':')[0]);
        
        switch (period) {
            case 'morning':
                return hour >= 8 && hour < 12;
            case 'afternoon':
                return hour >= 12 && hour < 18;
            case 'evening':
                return hour >= 18 && hour < 22;
            default:
                return true;
        }
    });
}

// Selecionar horário
function selectTime(time, buttonElement) {
    // Remover seleção anterior
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Selecionar novo horário
    buttonElement.classList.add('selected');
    selectedTime = time;
    
    // Habilitar botão de confirmar
    updateConfirmButton();
}

// Atualizar botão de confirmar
function updateConfirmButton() {
    const button = document.getElementById('confirmReschedule');
    const isValid = selectedProfessional && selectedDate && selectedTime;
    
    button.disabled = !isValid;
    
    if (isValid) {
        button.innerHTML = `Confirmar para ${selectedTime}`;
    } else {
        button.innerHTML = 'Confirmar Reagendamento';
    }
}

// Submeter formulário de reagendamento
function onFormSubmit(e) {
    e.preventDefault();
    
    if (!selectedProfessional || !selectedDate || !selectedTime) {
        utils.showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Verificar se é diferente do agendamento atual
    if (selectedProfessional.id === currentAppointment.professionalId && 
        selectedDate === currentAppointment.date && 
        selectedTime === currentAppointment.time) {
        utils.showNotification('Selecione uma data/horário diferente do atual', 'error');
        return;
    }
    
    // Atualizar agendamento
    currentAppointment.professionalId = selectedProfessional.id;
    currentAppointment.date = selectedDate;
    currentAppointment.time = selectedTime;
    
    // Salvar alterações
    dataUtils.saveToStorage();
    
    showSuccessMessage('Agendamento reagendado com sucesso!', 'reschedule');
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message, type) {
    const mainContent = document.querySelector('.main-content');
    
    const icon = type === 'cancel' ? 'fa-check-circle' : 'fa-calendar-check';
    const color = type === 'cancel' ? '#4caf50' : '#4caf50';
    
    mainContent.innerHTML = `
        <section class="section">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <button class="header-icon" onclick="goToAppointments()" style="background: #f0f0f0;">
                    <i class="fas fa-arrow-left" style="color: #333;"></i>
                </button>
                <h1 style="margin: 0; font-size: 24px;">${type === 'cancel' ? 'Cancelado' : 'Reagendado'}</h1>
            </div>
        </section>
        
        <section class="section">
            <div class="success-message fade-in">
                <i class="fas ${icon}" style="color: ${color};"></i>
                <h3>${message}</h3>
                ${type === 'reschedule' ? `
                    <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h4 style="margin: 0 0 12px 0; color: #333;">Novo agendamento:</h4>
                        <p style="margin: 4px 0; color: #666;"><i class="fas fa-user" style="margin-right: 8px;"></i> ${selectedProfessional.name}</p>
                        <p style="margin: 4px 0; color: #666;"><i class="fas fa-calendar" style="margin-right: 8px;"></i> ${dataUtils.formatDate(selectedDate)}</p>
                        <p style="margin: 4px 0; color: #666;"><i class="fas fa-clock" style="margin-right: 8px;"></i> ${selectedTime}</p>
                    </div>
                ` : ''}
                
                <button class="btn btn-full" onclick="goToAppointments()" style="margin-top: 24px;">
                    <i class="fas fa-calendar-alt" style="margin-right: 8px;"></i>
                    Ver Agendamentos
                </button>
                
                <button class="btn btn-secondary btn-full" onclick="goToHome()" style="margin-top: 12px;">
                    <i class="fas fa-home" style="margin-right: 8px;"></i>
                    Voltar ao Início
                </button>
            </div>
        </section>
    `;
}

// Abrir calendário
function openCalendar() {
    utils.show('#calendarModal');
}

// Fechar calendário
function closeCalendar() {
    utils.hide('#calendarModal');
}

// Selecionar data do calendário
function selectCalendarDate() {
    const calendarInput = document.getElementById('calendarInput');
    const selectedCalendarDate = calendarInput.value;
    
    if (!selectedCalendarDate) {
        utils.showNotification('Selecione uma data', 'error');
        return;
    }
    
    // Verificar se a data não é no passado
    const today = new Date();
    const selected = new Date(selectedCalendarDate);
    
    if (selected <= today) {
        utils.showNotification('Selecione uma data futura', 'error');
        return;
    }
    
    // Adicionar data aos dias da semana se não existir
    addCustomDate(selectedCalendarDate);
    
    closeCalendar();
}

// Adicionar data customizada
function addCustomDate(date) {
    const container = document.getElementById('weekDays');
    const dateObj = new Date(date);
    
    // Verificar se já existe
    const existing = container.querySelector(`[data-date="${date}"]`);
    if (existing) {
        selectDate(date, existing);
        return;
    }
    
    // Criar novo botão
    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'day-button';
    dayButton.dataset.date = date;
    dayButton.style.borderColor = '#ffd93d';
    
    dayButton.innerHTML = `
        <div style="font-weight: 500;">${dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
        <div style="font-size: 18px; margin-top: 4px;">${dateObj.getDate()}</div>
    `;
    
    dayButton.addEventListener('click', () => selectDate(date, dayButton));
    
    container.appendChild(dayButton);
    
    // Selecionar automaticamente
    selectDate(date, dayButton);
}

// Reset do formulário de reagendamento
function resetRescheduleForm() {
    document.getElementById('periodSelect').value = '';
    selectedProfessional = null;
    selectedDate = null;
    selectedTime = null;
    
    // Limpar seleções visuais
    document.querySelectorAll('.day-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    clearTimeSlots();
    updateConfirmButton();
}

// Limpar horários
function clearTimeSlots() {
    const container = document.getElementById('timeSlots');
    container.innerHTML = '';
    selectedTime = null;
    updateConfirmButton();
}

// Navegar para agendamentos
function goToAppointments() {
    window.location.href = 'agendamento.html';
}

// Navegar para home
function goToHome() {
    window.location.href = 'index.html';
}

// Voltar
function goBack() {
    window.history.back();
}

// Fechar modais ao clicar fora
document.addEventListener('click', (e) => {
    const cancelModal = document.getElementById('cancelModal');
    const calendarModal = document.getElementById('calendarModal');
    
    if (e.target === cancelModal) {
        hideCancelConfirmation();
    }
    
    if (e.target === calendarModal) {
        closeCalendar();
    }
});

