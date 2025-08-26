
const mockData = {
  services: [
    {
      id: 1,
      name: 'Manicure',
      category: 'Unhas',
      price: 35.00,
      duration: 60,
      description: 'Manicure completa com esmaltação',
      image: '💅'
    },
    {
      id: 2,
      name: 'Pedicure',
      category: 'Unhas',
      price: 40.00,
      duration: 60,
      description: 'Pedicure completa com esmaltação',
      image: '🦶'
    },
    {
      id: 3,
      name: 'Corte',
      category: 'Cabelo',
      price: 50.00,
      duration: 45,
      description: 'Corte de cabelo feminino',
      image: '✂️'
    },
    {
      id: 4,
      name: 'Escova',
      category: 'Cabelo',
      price: 30.00,
      duration: 45,
      description: 'Escova modeladora',
      image: '💇‍♀️'
    },
    {
      id: 5,
      name: 'Luzes',
      category: 'Cabelo',
      price: 120.00,
      duration: 120,
      description: 'Luzes e mechas',
      image: '🌟'
    }
  ],

  professionals: [
    {
      id: 1,
      name: 'Lucia Andrade',
      specialties: ['Manicure', 'Pedicure'],
      rating: 4.8,
      workingHours: {
        monday: ['09:00', '18:00'],
        tuesday: ['09:00', '18:00'],
        wednesday: ['09:00', '18:00'],
        thursday: ['09:00', '18:00'],
        friday: ['09:00', '18:00'],
        saturday: ['09:00', '16:00'],
        sunday: []
      }
    },
    {
      id: 2,
      name: 'Adriano Estevão',
      specialties: ['Corte', 'Escova'],
      rating: 4.9,
      workingHours: {
        monday: ['10:00', '19:00'],
        tuesday: ['10:00', '19:00'],
        wednesday: ['10:00', '19:00'],
        thursday: ['10:00', '19:00'],
        friday: ['10:00', '19:00'],
        saturday: ['09:00', '17:00'],
        sunday: []
      }
    },
    {
      id: 3,
      name: 'Evandra Massielo',
      specialties: ['Luzes', 'Corte', 'Escova'],
      rating: 4.7,
      workingHours: {
        monday: ['08:00', '17:00'],
        tuesday: ['08:00', '17:00'],
        wednesday: ['08:00', '17:00'],
        thursday: ['08:00', '17:00'],
        friday: ['08:00', '17:00'],
        saturday: ['08:00', '15:00'],
        sunday: []
      }
    }
  ],


  appointments: [
    {
      id: 1,
      serviceId: 1,
      professionalId: 1,
      date: '2025-08-13',
      time: '15:30',
      status: 'confirmed',
      userId: 1
    },
    {
      id: 2,
      serviceId: 2,
      professionalId: 3,
      date: '2025-07-30',
      time: '17:00',
      status: 'completed',
      userId: 1
    },
    {
      id: 3,
      serviceId: 3,
      professionalId: 2,
      date: '2025-06-20',
      time: '17:00',
      status: 'completed',
      userId: 1
    }
  ],

  // Usuário exemplo
  currentUser: {
    id: 1,
    name: 'Fulana da Silva',
    email: 'fulana.silva@email.com',
    phone: '(11) 9 4002-8922',
    age: 50,
    profileImage: null
  },

  // Feedback/Avaliações
  feedback: [
    {
      id: 1,
      appointmentId: 2,
      rating: 5,
      comment: 'Excelente atendimento! Muito profissional.',
      date: '2025-07-30'
    },
    {
      id: 2,
      appointmentId: 3,
      rating: 4,
      comment: 'Gostei muito do resultado!',
      date: '2025-06-20'
    }
  ]
};


const dataUtils = {
  // Buscar serviço por ID
  getServiceById(id) {
    return mockData.services.find(service => service.id === id);
  },

  // Buscar profissional por ID
  getProfessionalById(id) {
    return mockData.professionals.find(prof => prof.id === id);
  },

  // Buscar agendamentos do usuário
  getUserAppointments(userId) {
    return mockData.appointments.filter(apt => apt.userId === userId);
  },

  // Buscar agendamentos futuros
  getFutureAppointments(userId) {
    const today = new Date();
    return this.getUserAppointments(userId).filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && apt.status !== 'cancelled';
    });
  },

  // Buscar agendamentos passados
  getPastAppointments(userId) {
    const today = new Date();
    return this.getUserAppointments(userId).filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate < today || apt.status === 'completed';
    });
  },

  // Buscar próximo agendamento
  getNextAppointment(userId) {
    const future = this.getFutureAppointments(userId);
    if (future.length === 0) return null;
    
    return future.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  },

  // Buscar profissionais que fazem um serviço
  getProfessionalsForService(serviceId) {
    const service = this.getServiceById(serviceId);
    if (!service) return [];
    
    return mockData.professionals.filter(prof => 
      prof.specialties.includes(service.name)
    );
  },

  // Gerar horários disponíveis para um profissional em uma data
  getAvailableSlots(professionalId, date) {
    const professional = this.getProfessionalById(professionalId);
    if (!professional) return [];

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const workingHours = professional.workingHours[dayOfWeek];
    
    if (!workingHours || workingHours.length === 0) return [];

    const [startTime, endTime] = workingHours;
    const slots = [];
    
    // Gerar slots de 30 em 30 minutos
    let current = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    
    while (current < end) {
      const timeStr = this.minutesToTime(current);
      
      // Verificar se o horário não está ocupado
      const isBooked = mockData.appointments.some(apt => 
        apt.professionalId === professionalId && 
        apt.date === date && 
        apt.time === timeStr &&
        apt.status !== 'cancelled'
      );
      
      if (!isBooked) {
        slots.push(timeStr);
      }
      
      current += 30; // 30 minutos
    }
    
    return slots;
  },

  // Converter tempo para minutos
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  },

  // Converter minutos para tempo
  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  },

  // Formatar data para exibição
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  },

  // Formatar data curta
  formatShortDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  },

  // Salvar dados no localStorage
  saveToStorage() {
    localStorage.setItem('glamour_appointments', JSON.stringify(mockData.appointments));
    localStorage.setItem('glamour_feedback', JSON.stringify(mockData.feedback));
    localStorage.setItem('glamour_user', JSON.stringify(mockData.currentUser));
  },

  // Carregar dados do localStorage
  loadFromStorage() {
    const appointments = localStorage.getItem('glamour_appointments');
    const feedback = localStorage.getItem('glamour_feedback');
    const user = localStorage.getItem('glamour_user');

    if (appointments) {
      mockData.appointments = JSON.parse(appointments);
    }
    if (feedback) {
      mockData.feedback = JSON.parse(feedback);
    }
    if (user) {
      mockData.currentUser = JSON.parse(user);
    }
  },

  // Adicionar novo agendamento
  addAppointment(appointment) {
    const newId = Math.max(...mockData.appointments.map(a => a.id)) + 1;
    const newAppointment = {
      id: newId,
      ...appointment,
      status: 'confirmed'
    };
    
    mockData.appointments.push(newAppointment);
    this.saveToStorage();
    return newAppointment;
  },

  // Cancelar agendamento
  cancelAppointment(appointmentId) {
    const appointment = mockData.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'cancelled';
      this.saveToStorage();
      return true;
    }
    return false;
  },

  // Adicionar feedback
  addFeedback(feedback) {
    const newId = Math.max(...mockData.feedback.map(f => f.id)) + 1;
    const newFeedback = {
      id: newId,
      ...feedback,
      date: new Date().toISOString().split('T')[0]
    };
    
    mockData.feedback.push(newFeedback);
    this.saveToStorage();
    return newFeedback;
  }
};

// Inicializar dados do localStorage
dataUtils.loadFromStorage();

