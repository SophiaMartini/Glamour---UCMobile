const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let currentDate = new Date();

function generateCalendar(date) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    // Adiciona os nomes dos dias da semana
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    dayNames.forEach(d => {
        const div = document.createElement("div");
        div.className = "day-name";
        div.textContent = d;
        calendar.appendChild(div);
    });

   
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement("div");
        div.className = "day";
        div.textContent = day;
        div.onclick = () => selectDay(div, year, month + 1, day);
        calendar.appendChild(div);
    }

  
    document.getElementById("month-year").textContent = `${monthNames[month]} ${year}`;
}

function selectDay(element, year, month, day) {
    document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
    element.classList.add("selected");
    alert(`Data selecionada: ${day}/${month}/${year}`);
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateCalendar(currentDate);
}

generateCalendar(currentDate);