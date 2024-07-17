document.getElementById('ver-agenda').addEventListener('click', function() {
    loadContent('agenda');
});

document.getElementById('agendar-solicitud').addEventListener('click', function() {
    loadContent('agendar');
});

document.getElementById('ver-solicitudes').addEventListener('click', function() {
    loadContent('solicitudes');
});

document.getElementById('mi-perfil').addEventListener('click', function() {
    loadContent('perfil');
});

function loadContent(page) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    switch(page) {
        case 'agenda':
            content.innerHTML = '<h2>Agenda</h2>' + createMonthSelector() + createCalendar();
            break;
        case 'agendar':
            content.innerHTML = '<h2>Agendar Solicitud</h2>' + createForm();
            break;
        case 'solicitudes':
            content.innerHTML = '<h2>Solicitudes</h2>' + listSolicitudes();
            break;
        case 'perfil':
            content.innerHTML = '<h2>Mi Perfil</h2>' + createProfile();
            break;
    }
}

function createMonthSelector() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return `
        <div id="month-selector">
            <button onclick="changeMonth(-1)">Anterior</button>
            <span id="current-month" data-month="${currentMonth}" data-year="${currentYear}">
                ${getMonthName(currentMonth)} ${currentYear}
            </span>
            <button onclick="changeMonth(1)">Siguiente</button>
        </div>
    `;
}

function changeMonth(offset) {
    const monthElement = document.getElementById('current-month');
    let month = parseInt(monthElement.getAttribute('data-month'));
    let year = parseInt(monthElement.getAttribute('data-year'));

    month += offset;
    if (month < 0) {
        month = 11;
        year--;
    } else if (month > 11) {
        month = 0;
        year++;
    }

    monthElement.setAttribute('data-month', month);
    monthElement.setAttribute('data-year', year);
    monthElement.textContent = `${getMonthName(month)} ${year}`;

    document.querySelector('.calendar').remove();
    document.getElementById('content').insertAdjacentHTML('beforeend', createCalendar(month, year));
}

function getMonthName(monthIndex) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[monthIndex];
}

function createCalendar(month = new Date().getMonth(), year = new Date().getFullYear()) {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    let calendarHTML = '<div class="calendar">';
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        let daySolicitudes = solicitudes.filter(solicitud => {
            let date = new Date(solicitud.date);
            return date.getDate() === i && date.getMonth() === month && date.getFullYear() === year;
        });
        let dayClass = daySolicitudes.length > 3 ? 'day many-solicitudes' : 'day';
        calendarHTML += `<div class="${dayClass}" onclick="showDaySolicitudes(${i}, ${month}, ${year})">${i}`;
        daySolicitudes.forEach(solicitud => {
            calendarHTML += `<div class="solicitud">${solicitud.description} - ${solicitud.time}</div>`;
        });
        calendarHTML += '</div>';
    }
    calendarHTML += '</div>';
    return calendarHTML;
}

function createForm() {
    return `
        <form class="formSolicitud" onsubmit="saveSolicitud(event)">

            <label id="labelMarca" for="marca">Marca:</label>
            <input type="text" id="inputMarca" name="marca">

            <label id="labelModelo" for="modelo">Modelo:</label>
            <input type="text" id="inputModelo" name="modelo">

            <label id="labelPatente" for="patente">Patente:</label>
            <input type="text" id="inputPatente" name="patente">

            <label id="labelVin" for="vin">VIN:</label>
            <input type="text" id="inputVin" name="vin">

            <label id="labelFecha" for="date">Fecha:</label>
            <input type="date" id="inputFecha" name="date" required>

            <label id="labelHora" for="time">Hora:</label>
            <input type="time" id="inputHora" name="time" min="08:00" max="23:30" required>

            <label id="labelAsignatura" for="asignatura">Asignatura:</label>
            <select id="selectAsignatura" name="asignatura">
                <option value="" selected >Seleccione una opción</option>
                <option value="Protocolos de Seguridad en Electromovilidad">Protocolos de Seguridad en Electromovilidad</option>
                <option value="Seguridad Activa del Automóvil">Seguridad Activa del Automóvil</option>
                <option value="Sistemas Eléctricos del Automóvil">Sistemas Eléctricos del Automóvil</option>
                <option value="Sistemas de Motorización">Sistemas de Motorización</option>
                <option value="Integración Automotriz I">Integración Automotriz I</option>
                <option value="Conectividad y Redes del Automóvil">Conectividad y Redes del Automóvil</option>
                <option value="Sistemas Electrónicos del Automóvil">Sistemas Electrónicos del Automóvil</option>
                <option value="Sistemas de Transmisión">Sistemas de Transmisión</option>
                <option value="Integración Automotriz II">Integración Automotriz II</option>
                <option value="Gestión Electrónica del Motor">Gestión Electrónica del Motor</option>
                <option value="Sistemas Multiplexados de Seguridad y Confortabilidad">Sistemas Multiplexados de Seguridad y Confortabilidad</option>
                <option value="Diagnóstico de Sistemas de Propulsión Inteligentes">Diagnóstico de Sistemas de Propulsión Inteligentes</option>
            </select>

            <label id="labelDocente" for="docentes">Docentes:</label>
            <select id="selectDocentes" name="docentes">
                <option value="" selected >Seleccione una opción</option>
                <option value="Juan Mansilla">Juan Mansilla</option>
                <option value="Rodrigo Agoni">Rodrigo Agoni</option>
                <option value="Valentin Montecinos">Valentin Montecinos</option>
                <option value="Maximiliano Lafertte">Maximiliano Lafertte</option>
                <option value="Patricio Jara">Patricio Jara</option>
                <option value="Victor Colil">Victor Colil</option>
                <option value="Matias Opitz">Matias Opitz</option>
                <option value="Paulo Fernandez">Paulo Fernandez</option>
            </select>

            <label id="labelCombustible" for="combustible">Nivel de Combustible:</label>
            <select id="selectCombustible" name="combustible">
                <option value="" selected >Seleccione una opción</option>
                <option value="1/4">1/4</option>
                <option value="1/2">1/2</option>
                <option value="3/4">3/4</option>
                <option value="1/1">1/1</option>
            </select>

            <label id="labelFoto" for="fotografia">Fotografia:</label>
            <input type="file" id="inputFoto" name="fotografia" accept="image/*">

            <button type="button" id="openModalBtn">Seleccionar Espacio</button>
            <div id="modal" class="modal">
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h2>Elige tu Espacio</h2>
                    <div class="seating-chart">
                        <!-- Aquí se generarán los espacios -->
                    </div>
                    <button id="confirmBtn">Confirmar</button>
                </div>
            </div>

            <div id="selectedSpaces">
                <div id="spacesList"></div>
            </div>
            
            <button id="button-submit" type="submit">Agendar</button>
        </form>
    `;
}

//Script Selección de Espacio
document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const confirmBtn = document.getElementById('confirmBtn');
    const seatingChart = document.querySelector('.seating-chart');
    const spacesList = document.getElementById('spacesList');

    // Generar espacios
    for (let i = 1; i <= 4; i++) {
        const space = document.createElement('div');
        space.classList.add('space');
        space.textContent = "Espacio "+ i;
        seatingChart.appendChild(space);

        space.addEventListener('click', () => {
            // Deseleccionar cualquier espacio previamente seleccionado
            const previouslySelected = document.querySelector('.space.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }

            // Seleccionar el nuevo espacio
            space.classList.add('selected');
        });
    }

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    confirmBtn.addEventListener('click', () => {
        const selectedSpace = document.querySelector('.space.selected');
        if (selectedSpace) {
            const spaceContent = document.createElement('div');
            spaceContent.classList.add('space');
            spaceContent.textContent = selectedSpace.textContent;
            spacesList.textContent = "";
            spacesList.appendChild(spaceContent);
            
            //spacesList.textContent = selectedSpace.textContent;
        } else {
            const spaceContent = document.createElement('div');
            spaceContent.classList.add('nullSpace');
            spaceContent.textContent = "Ningún Espacio Seleccionado";
            spacesList.textContent = "";
            spacesList.appendChild(spaceContent);
        }
        modal.style.display = 'none';
    });
});

//Fin Script Selección de Espacio

function saveSolicitud(event) {
    event.preventDefault();
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    let solicitud = {
        date: event.target.date.value,
        time: event.target.time.value,
        description: event.target.description.value
    };
    solicitudes.push(solicitud);
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    alert('Solicitud agendada!');
    loadContent('agenda');
}

function listSolicitudes() {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    solicitudes.sort((a, b) => new Date(a.date) - new Date(b.date));
    let solicitudesHTML = '<ul>';
    solicitudes.forEach(solicitud => {
        solicitudesHTML += `<li>${solicitud.date} - ${solicitud.time} - ${solicitud.description}</li>`;
    });
    solicitudesHTML += '</ul>';
    return solicitudesHTML;
}

function createProfile() {
    let profile = JSON.parse(localStorage.getItem('profile')) || { name: '', photo: '', email: 'user@example.com' };
    return `
        <form onsubmit="saveProfile(event)">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" value="${profile.name}" required>
            <label for="photo">Foto de perfil:</label>
            <input type="file" id="photo" name="photo" accept="image/*">
            <label for="email">Correo:</label>
            <input type="email" id="email" name="email" value="${profile.email}" disabled>
            <button type="submit">Guardar</button>
        </form>
    `;
}

function saveProfile(event) {
    event.preventDefault();
    let profile = {
        name: event.target.name.value,
        photo: event.target.photo.files[0] ? URL.createObjectURL(event.target.photo.files[0]) : '',
        email: event.target.email.value
    };
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Perfil guardado!');
    loadProfileImage();
    loadContent('perfil');
}

function loadProfileImage() {
    let profile = JSON.parse(localStorage.getItem('profile')) || {};
    if (profile.photo) {
        document.querySelector('.profile-img').src = profile.photo;
    }
}

function showDaySolicitudes(day, month, year) {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    let daySolicitudes = solicitudes.filter(solicitud => {
        let date = new Date(solicitud.date);
        return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
    });
    let modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `<h3>Solicitudes para ${day} ${getMonthName(month)} ${year}</h3>`;
    daySolicitudes.forEach(solicitud => {
        modalBody.innerHTML += `<p>${solicitud.time} - ${solicitud.description}</p>`;
    });
    document.getElementById('modal').style.display = 'block';
}

document.querySelector('.close-button').onclick = function() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfileImage();
    loadContent('agenda');
});
