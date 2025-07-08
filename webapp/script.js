document.getElementById('load').addEventListener('click', fetchData);
document.getElementById('loadAll').addEventListener('click', fetchAllData);

function fetchData() {
  const priority = document.getElementById('priority').value;
  const facility = document.getElementById('facility').value;
  const limit = document.getElementById('limit').value || 1000;
  const offset = document.getElementById('offset').value || 0;

  const params = new URLSearchParams();
  if (priority) params.append('priority', priority);
  if (facility) params.append('facility', facility);
  if (limit) params.append('limit', limit);
  if (offset) params.append('offset', offset);

  fetch(`http://localhost:3001/incidencias?${params.toString()}`)
    .then(res => res.json())
    .then(showData)
    .catch(err => {
      console.error(err);
      alert('Error fetching incidences');
    });
}

function showData(data) {
  const table = document.getElementById('incidences');
  table.innerHTML = '';
  if (!Array.isArray(data) || data.length === 0) {
    table.innerHTML = '<tr><td>No results</td></tr>';
    return;
  }

  const headers = Object.keys(data[0]);
  const headerRow = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach(item => {
    const row = document.createElement('tr');
    headers.forEach(h => {
      const td = document.createElement('td');
      td.textContent = item[h];
      row.appendChild(td);
    });
    table.appendChild(row);
  });
}

function fetchAllData() {
  const priority = document.getElementById('priority').value;
  const facility = document.getElementById('facility').value;
  const limit = parseInt(document.getElementById('limit').value) || 1000;
  let offset = parseInt(document.getElementById('offset').value) || 0;

  const baseParams = new URLSearchParams();
  if (priority) baseParams.append('priority', priority);
  if (facility) baseParams.append('facility', facility);

  const allData = [];

  function loadBatch() {
    const params = new URLSearchParams(baseParams.toString());
    params.append('limit', limit);
    if (offset) params.append('offset', offset);

    return fetch(`http://localhost:3001/incidencias?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        allData.push(...data);
        if (data.length === limit) {
          offset += limit;
          return loadBatch();
        }
      });
  }

  loadBatch()
    .then(() => showData(allData))
    .catch(err => {
      console.error(err);
      alert('Error fetching incidences');
    });
}
