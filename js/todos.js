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
  