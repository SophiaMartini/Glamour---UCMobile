fetch('footerheader.html')
  .then(response => {
    if (!response.ok) throw new Error("Erro ao carregar footer");
    return response.text();
  })
  .then(data => {
    const nav = document.getElementById('navigation');
    const head = document.getElementById('header');

    if (!nav) return;


    nav.innerHTML = data;

    const currentPage = window.location.pathname.split('/').pop();

    nav.querySelectorAll('.list').forEach(item => {
      const matches = item.getAttribute('data-match')?.split(',');
      if (matches && matches.includes(currentPage)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  })
  .catch(error => console.error('Erro ao carregar footer:', error));
  


//

// Funções Utilitárias - GLAMOUR

const utils = {
  // Verificar se usuário está logado
  isLoggedIn() {
    return localStorage.getItem('usuarioLogado') !== null;
  },

  // Obter dados do usuário logado
  getCurrentUser() {
    const userData = localStorage.getItem('usuarioLogado');
    return userData ? JSON.parse(userData) : null;
  },

  // Redirecionar para login se não estiver logado
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // Fazer logout
  logout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('lembrarLogin');
    window.location.href = 'login.html';
  },

  // Mostrar/esconder elementos
  show(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('visible');
    }
  },

  hide(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.remove('visible');
      element.classList.add('hidden');
    }
  },

  // Toggle de elementos
  toggle(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      if (element.classList.contains('hidden')) {
        this.show(element);
      } else {
        this.hide(element);
      }
    }
  },

  // Criar elemento HTML
  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  // Formatar preço
  formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  },

  // Formatar data para input
  formatDateForInput(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  },

  // Obter data atual formatada
  getCurrentDate() {
    return this.formatDateForInput(new Date());
  },

  // Obter próximos 7 dias
  getNext7Days() {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        date: this.formatDateForInput(date),
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: i === 0
      });
    }
    
    return days;
  },

  // Validar email
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validar telefone brasileiro
  isValidPhone(phone) {
    const regex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
    return regex.test(phone);
  },

  // Mostrar notificação
  showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    const notification = this.createElement('div', `notification notification-${type}`, message);
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#4caf50' : '#2196f3'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Confirmar ação
  confirm(message, callback) {
    if (window.confirm(message)) {
      callback();
    }
  },

  // Debounce para busca
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Scroll suave para elemento
  scrollTo(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  },

  // Copiar texto para clipboard
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
      this.showNotification('Erro ao copiar texto', 'error');
    });
  },

  // Gerar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Sanitizar HTML
  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  // Carregar script dinamicamente
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Carregar CSS dinamicamente
  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  // Detectar dispositivo móvel
  isMobile() {
    return window.innerWidth <= 768;
  },

  // Detectar se está online
  isOnline() {
    return navigator.onLine;
  },

  share(data) {
    if (navigator.share) {
      return navigator.share(data);
    } else {
      // Fallback para copiar link
      this.copyToClipboard(data.url || data.text || '');
      return Promise.resolve();
    }
  },

  getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  },


  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
  },


  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const tooltip = this.createElement('div', 'tooltip', e.target.dataset.tooltip);
        tooltip.style.cssText = `
          position: absolute;
          background: #333;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1000;
          pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
      });
      
      element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
      });
    });
  }
};

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);








//dads simulados
