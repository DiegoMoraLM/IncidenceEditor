const API_BASE = 'http://localhost:3001';

const id = new URLSearchParams(window.location.search).get('id');
if (!id) {
    document.body.textContent = 'No incidence id provided';
    throw new Error('missing id');
}

async function loadIncidence() {
    hideMessage();
    try {
        const res = await fetch(`${API_BASE}/incidencias/${id}`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Failed to load');
        }
        const inc = await res.json();
        for (const key of [
            'ManagerName','WorkerCode','Facility','Description','IncidenceDate',
            'Priority','Actions','ActionOperator','ResolutionDate','StopInit',
            'StopEnd','NotifiedTo','AssignedTo','Archived'
        ]) {
            const el = document.getElementById(key);
            if (!el) continue;
            if (el.type === 'checkbox') {
                el.checked = inc[key];
            } else {
                el.value = inc[key] || '';
            }
        }
    } catch (err) {
        console.error(err);
        showError('Could not load incidence: ' + err.message);
    }
}

document.getElementById('cancel').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        ManagerName: document.getElementById('ManagerName').value,
        WorkerCode: document.getElementById('WorkerCode').value,
        Facility: document.getElementById('Facility').value,
        Description: document.getElementById('Description').value,
        IncidenceDate: document.getElementById('IncidenceDate').value,
        Priority: document.getElementById('Priority').value,
        Actions: document.getElementById('Actions').value,
        ActionOperator: document.getElementById('ActionOperator').value,
        ResolutionDate: document.getElementById('ResolutionDate').value,
        StopInit: document.getElementById('StopInit').value,
        StopEnd: document.getElementById('StopEnd').value,
        NotifiedTo: document.getElementById('NotifiedTo').value,
        AssignedTo: document.getElementById('AssignedTo').value,
        Archived: document.getElementById('Archived').checked
    };

    try {
        const res = await fetch(`${API_BASE}/incidencias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Failed to update');
        }
        window.location.href = 'index.html';
    } catch (err) {
        console.error(err);
        showError('Could not update incidence: ' + err.message);
    }
});

function showError(msg) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function hideMessage() {
    document.getElementById('message').classList.add('hidden');
}

loadIncidence();
