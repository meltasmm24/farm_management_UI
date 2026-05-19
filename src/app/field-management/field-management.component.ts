import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface Field {
  _id?: string;
  name: string;
  cropType: string;
  sizeAcres: number;
  status: 'Healthy' | 'Needs Water' | 'Harvesting' | 'Planning';
  soilMoisture: number;
  expectedYield: number;
}

@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.css']
})
export class FieldManagementComponent implements OnInit {
  fields: Field[] = [];
  filteredFields: Field[] = [];
  searchQuery: string = '';
  
  showAddModal: boolean = false;
  newField: Partial<Field> = {
    status: 'Healthy'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchFields();
  }

  fetchFields(): void {
    this.apiService.getAll<Field>('fields').subscribe(data => {
      this.fields = data;
      this.filterFields();
    });
  }

  filterFields(): void {
    if (!this.searchQuery) {
      this.filteredFields = [...this.fields];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredFields = this.fields.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.cropType.toLowerCase().includes(q) ||
      f.status.toLowerCase().includes(q)
    );
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newField = { status: 'Healthy', sizeAcres: 0, expectedYield: 0, soilMoisture: 0 };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveNewField(): void {
    if (this.newField.name && this.newField.cropType) {
      const payload = {
        name: this.newField.name!,
        cropType: this.newField.cropType!,
        sizeAcres: this.newField.sizeAcres || 0,
        status: (this.newField.status as any) || 'Healthy',
        soilMoisture: this.newField.soilMoisture || 0,
        expectedYield: this.newField.expectedYield || 0
      };
      this.apiService.create<Field>('fields', payload).subscribe(data => {
        this.fields.push(data);
        this.filterFields();
        this.closeAddModal();
      });
    }
  }

  updateStatus(field: Field, newStatus: Field['status']): void {
    if (field._id) {
      this.apiService.update<Field>('fields', field._id, { status: newStatus }).subscribe(updated => {
        field.status = newStatus;
      });
    }
  }

  deleteField(id: string): void {
    this.apiService.delete('fields', id).subscribe(() => {
      this.fields = this.fields.filter(f => f._id !== id);
      this.filterFields();
    });
  }
}
