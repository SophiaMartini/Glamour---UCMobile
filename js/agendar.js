const timeSlotsContainer = document.getElementById('timeSlots');
const days = document.querySelectorAll('.calendar-day');
const openCalendarBtn = document.querySelector('.open-calendar');

const mockTimes = {
    '27': ['09:00', '10:00', '11:00', '14:00', '15:00'],
    '28': ['10:00', '11:00', '13:00', '14:00', '16:00'],
    '29': ['09:30', '10:30', '14:30', '16:30'],
    '30': ['10:00', '11:00', '15:00', '17:00'],
    '31': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
};
 
let selectedTime = null;

function renderTimes(day) {
    timeSlotsContainer.innerHTML = '';
    const times = mockTimes[day] || [];
    times.forEach(time => {
        const slot = document.createElement('div');
        slot.classList.add('time-slot');
        slot.textContent = time;
        slot.addEventListener('click', () => {
            if (selectedTime) {
                selectedTime.classList.remove('selected');
            }
            slot.classList.add('selected');
            selectedTime = slot;
        });
        timeSlotsContainer.appendChild(slot);
    });
}
 
days.forEach(day => {
    day.addEventListener('click', () => {
        days.forEach(d => d.classList.remove('active'));
        day.classList.add('active');
        
        const selectedDay = day.getAttribute('data-day');
        renderTimes(selectedDay);
    });
});
 

renderTimes('27');

openCalendarBtn.addEventListener('click', () => {
    window.location.href = 'calendario.html';
});

const form = document.getElementById('agendarForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const servico = document.getElementById('servico').value;
    const profissional = document.getElementById('profissional').value;
    const dia = document.querySelector('.calendar-day.active').getAttribute('data-day');
    
    if (!selectedTime) {
        alert('Por favor, selecione um horário.');
        return;
    }
    
    const horario = selectedTime.textContent;
    
    if (servico && profissional && dia && horario) {
        alert(`Agendamento confirmado para:\nServiço: ${servico}\nProfissional: ${profissional}\nDia: ${dia}\nHorário: ${horario}`);
        
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});