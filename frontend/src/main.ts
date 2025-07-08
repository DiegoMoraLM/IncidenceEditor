import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'incidence-app',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  template: `
  <h1>Incidence List</h1>
  <div class="filters">
    <label>Priority:
      <select [(ngModel)]="priority">
        <option value="">Any</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </label>
    <label>Facility: <input [(ngModel)]="facility" type="text" placeholder="Facility name"></label>
    <label>Limit: <input [(ngModel)]="limit" type="number" min="1"></label>
    <label>Offset: <input [(ngModel)]="offset" type="number" min="0"></label>
    <button (click)="load()">Load</button>
    <button (click)="loadAll()">Load All</button>
  </div>
  <table>
    <thead>
      <tr>
        <th *ngFor="let h of headers">{{h}}</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let row of data">
        <td *ngFor="let h of headers">{{row[h]}}</td>
      </tr>
    </tbody>
  </table>
  `,
  styles: [`
    .filters { margin-bottom: 10px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 4px; }
  `]
})
export class AppComponent {
  priority = '';
  facility = '';
  limit = 1000;
  offset = 0;
  data: any[] = [];
  headers: string[] = [];

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
        this.data = res;
        this.headers = res.length ? Object.keys(res[0]) : [];
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
    this.headers = this.data.length ? Object.keys(this.data[0]) : [];
  }
}

bootstrapApplication(AppComponent);
