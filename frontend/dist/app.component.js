var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
let AppComponent = class AppComponent {
    constructor(http) {
        this.http = http;
        this.priority = '';
        this.facility = '';
        this.limit = 1000;
        this.offset = 0;
        this.priorities = ['Low', 'Medium', 'High'];
        this.data = [];
        this.filteredData = [];
        this.headers = [];
        this.filters = {};
        this.editingId = null;
        this.editedRow = {};
    }
    buildParams() {
        let params = new HttpParams();
        if (this.priority)
            params = params.set('priority', this.priority);
        if (this.facility)
            params = params.set('facility', this.facility);
        if (this.limit)
            params = params.set('limit', this.limit);
        if (this.offset)
            params = params.set('offset', this.offset);
        return params;
    }
    load() {
        const params = this.buildParams();
        this.http.get(`http://localhost:3001/incidencias`, { params })
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
        let batch = [];
        do {
            const params = this.buildParams().set('limit', this.limit).set('offset', offset);
            batch = await lastValueFrom(this.http.get(`http://localhost:3001/incidencias`, { params }));
            if (batch && batch.length > 0) {
                this.data.push(...batch);
                offset += this.limit;
            }
        } while (batch && batch.length === this.limit);
        this.setData(this.data);
    }
    setData(rows) {
        this.data = rows;
        this.headers = rows.length ? Object.keys(rows[0]) : [];
        this.filteredData = rows.slice();
        this.filters = {};
        this.headers.forEach(h => this.filters[h] = '');
    }
    applyFilters() {
        this.filteredData = this.data.filter(row => {
            return Object.keys(this.filters).every(key => {
                var _a;
                const filterValue = this.filters[key];
                if (!filterValue)
                    return true;
                return String((_a = row[key]) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(filterValue.toLowerCase());
            });
        });
    }
    startEdit(row) {
        this.editingId = row.Id;
        this.editedRow = { ...row };
    }
    cancelEdit() {
        this.editingId = null;
        this.editedRow = {};
    }
    saveEdit() {
        if (this.editingId == null)
            return;
        this.http.put(`http://localhost:3001/incidencias/${this.editingId}`, this.editedRow)
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
    isEditable(column) {
        return !['Id', 'Base64Pics', 'CreatedDate', 'LastModifiedDate'].includes(column);
    }
};
AppComponent = __decorate([
    Component({
        selector: 'incidence-app',
        standalone: true,
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
        imports: [HttpClientModule, FormsModule]
    })
], AppComponent);
export { AppComponent };
