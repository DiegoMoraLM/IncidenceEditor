const API_BASE = 'http://localhost:3001';

async function fetchIncidences() {
    const priority = document.getElementById('filter-priority').value;
    const facility = document.getElementById('filter-facility').value;
    const limit = document.getElementById('filter-limit').value || 100;

    const params = new URLSearchParams({ limit });
    if (priority) params.append('priority', priority);
    if (facility) params.append('facility', facility);

    const response = await fetch(`${API_BASE}/incidencias?${params.toString()}`);
    const incidences = await response.json();
    renderTable(incidences);
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
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.addEventListener('click', () => openEditForm(inc));
        editTd.appendChild(btn);
        tr.appendChild(editTd);

        tbody.appendChild(tr);
    });
}

function openEditForm(inc) {
    const section = document.getElementById('edit-section');
    section.classList.remove('hidden');
    document.getElementById('edit-id').value = inc.Id;
    const fields = [
        'ManagerName','WorkerCode','Facility','Description','IncidenceDate',
        'Priority','Actions','ActionOperator','ResolutionDate','StopInit',
        'StopEnd','NotifiedTo','AssignedTo','Archived'
    ];
    fields.forEach(f => {
        const el = document.getElementById(`edit-${f}`);
        if (el.type === 'checkbox') {
            el.checked = inc[f];
        } else {
            el.value = inc[f] || '';
        }
    });
}

function closeEditForm() {
    document.getElementById('edit-section').classList.add('hidden');
}

document.getElementById('apply-filters').addEventListener('click', fetchIncidences);
document.getElementById('cancel-edit').addEventListener('click', closeEditForm);
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const data = {
        ManagerName: document.getElementById('edit-ManagerName').value,
        WorkerCode: document.getElementById('edit-WorkerCode').value,
        Facility: document.getElementById('edit-Facility').value,
        Description: document.getElementById('edit-Description').value,
        IncidenceDate: document.getElementById('edit-IncidenceDate').value,
        Priority: document.getElementById('edit-Priority').value,
        Actions: document.getElementById('edit-Actions').value,
        ActionOperator: document.getElementById('edit-ActionOperator').value,
        ResolutionDate: document.getElementById('edit-ResolutionDate').value,
        StopInit: document.getElementById('edit-StopInit').value,
        StopEnd: document.getElementById('edit-StopEnd').value,
        NotifiedTo: document.getElementById('edit-NotifiedTo').value,
        AssignedTo: document.getElementById('edit-AssignedTo').value,
        Archived: document.getElementById('edit-Archived').checked
    };

    await fetch(`${API_BASE}/incidencias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    closeEditForm();
    fetchIncidences();
});

// Initial load
fetchIncidences();
