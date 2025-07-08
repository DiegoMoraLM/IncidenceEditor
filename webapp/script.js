document.getElementById('load').addEventListener('click', fetchData);

function fetchData() {
  const priority = document.getElementById('priority').value;
  const facility = document.getElementById('facility').value;
  const limit = document.getElementById('limit').value || 1000;

  const params = new URLSearchParams();
  if (priority) params.append('priority', priority);
  if (facility) params.append('facility', facility);
  if (limit) params.append('limit', limit);

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
