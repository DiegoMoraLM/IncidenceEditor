const API_BASE = 'http://localhost:3001';

async function fetchIncidences() {
    hideMessage();
    const priority = document.getElementById('filter-priority').value;
    const facility = document.getElementById('filter-facility').value;
    const limit = document.getElementById('filter-limit').value || 100;

    const params = new URLSearchParams({ limit });
    if (priority) params.append('priority', priority);
    if (facility) params.append('facility', facility);

    try {
        const response = await fetch(`${API_BASE}/incidencias?${params.toString()}`);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Error fetching incidences');
        }
        const incidences = await response.json();
        hideMessage();
        renderTable(incidences);
    } catch (err) {
        console.error(err);
        showError('Could not load incidences: ' + err.message);
    }
}

function renderTable(incidences) {
    const tbody = document.querySelector('#incidences-table tbody');
    tbody.innerHTML = '';

    incidences.forEach(inc => {
        const tr = document.createElement('tr');
        for (const key of [
            'Id','ManagerName','WorkerCode','Facility','Description',
            'IncidenceDate','Priority','Actions','ActionOperator','ResolutionDate',
            'StopInit','StopEnd','NotifiedTo','AssignedTo','CreatedDate','LastModifiedDate','Archived'
        ]) {
            const td = document.createElement('td');
            td.textContent = inc[key];
            tr.appendChild(td);
        }

        const editTd = document.createElement('td');
        const link = document.createElement('a');
        link.textContent = 'Edit';
        link.href = `edit.html?id=${encodeURIComponent(inc.Id)}`;
        editTd.appendChild(link);
        tr.appendChild(editTd);

        tbody.appendChild(tr);
    });
}

document.getElementById('apply-filters').addEventListener('click', fetchIncidences);

function showError(msg) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function hideMessage() {
    document.getElementById('message').classList.add('hidden');
}

// Initial load
fetchIncidences();
