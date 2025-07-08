import { Component } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'incidence-app',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HttpClientModule, FormsModule]
})
export class AppComponent {
  priority = '';
  facility = '';
  limit = 1000;
  offset = 0;
  priorities = ['Low', 'Medium', 'High'];

  data: any[] = [];
  filteredData: any[] = [];
  headers: string[] = [];
  filters: { [key: string]: string } = {};

  editingId: number | null = null;
  editedRow: any = {};

  constructor(private http: HttpClient) {}

  private buildParams(): HttpParams {
    let params = new HttpParams();
    if (this.priority) params = params.set('priority', this.priority);
    if (this.facility) params = params.set('facility', this.facility);
    if (this.limit) params = params.set('limit', this.limit);
    if (this.offset) params = params.set('offset', this.offset);
    return params;
  }

  load() {
    const params = this.buildParams();
    this.http.get<any[]>(`http://localhost:3001/incidencias`, { params })
      .subscribe(res => {
        this.setData(res);
      }, err => {
        console.error(err);
        alert('Error fetching incidences');
      });
  }

  async loadAll() {
    this.data = [];
    let offset = this.offset;
    let batch: any[] = [];
    do {
      const params = this.buildParams().set('limit', this.limit).set('offset', offset);
      batch = await lastValueFrom(this.http.get<any[]>(`http://localhost:3001/incidencias`, { params }));
      if (batch && batch.length > 0) {
        this.data.push(...batch);
        offset += this.limit;
      }
    } while (batch && batch.length === this.limit);
    this.setData(this.data);
  }

  private setData(rows: any[]) {
    this.data = rows;
    this.headers = rows.length ? Object.keys(rows[0]) : [];
    this.filteredData = rows.slice();
    this.filters = {};
    this.headers.forEach(h => this.filters[h] = '');
  }

  applyFilters() {
    this.filteredData = this.data.filter(row => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key];
        if (!filterValue) return true;
        return String(row[key] ?? '').toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }

  startEdit(row: any) {
    this.editingId = row.Id;
    this.editedRow = { ...row };
  }

  cancelEdit() {
    this.editingId = null;
    this.editedRow = {};
  }

  saveEdit() {
    if (this.editingId == null) return;
    this.http.put<any>(`http://localhost:3001/incidencias/${this.editingId}`, this.editedRow)
      .subscribe(updated => {
        const index = this.data.findIndex(r => r.Id === this.editingId);
        if (index > -1) {
          this.data[index] = updated;
          this.applyFilters();
        }
        this.cancelEdit();
      }, err => {
        console.error(err);
        alert('Error updating incidence');
      });
  }

  isEditable(column: string): boolean {
    return !['Id', 'Base64Pics', 'CreatedDate', 'LastModifiedDate'].includes(column);
  }
}
