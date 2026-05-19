import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface FarmWorker {
  _id?: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Sick';
  joinDate: string;
  tasksAssigned: number;
}

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {
  workers: FarmWorker[] = [];
  filteredWorkers: FarmWorker[] = [];
  
  totalWorkers: number = 0;
  activeWorkers: number = 0;
  onLeaveWorkers: number = 0;

  searchQuery: string = '';
  roleFilter: string = 'All';
  showAddModal: boolean = false;
  
  newWorker: Partial<FarmWorker> = {
    role: 'Field Hand',
    status: 'Active'
  };

  roles = ['Manager', 'Field Hand', 'Tractor Operator', 'Veterinarian', 'Agronomist'];
  statusOptions = ['Active', 'On Leave', 'Sick'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchWorkers();
  }

  fetchWorkers(): void {
    this.apiService.getAll<FarmWorker>('workers').subscribe(data => {
      this.workers = data;
      this.applyFilters();
    });
  }

  calculateMetrics(): void {
    this.totalWorkers = this.workers.length;
    this.activeWorkers = this.workers.filter(w => w.status === 'Active').length;
    this.onLeaveWorkers = this.workers.filter(w => w.status !== 'Active').length;
  }

  setRoleFilter(role: string): void {
    this.roleFilter = role;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.workers];
    
    if (this.roleFilter !== 'All') {
      temp = temp.filter(w => w.role === this.roleFilter);
    }
    
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(w => 
        w.name.toLowerCase().includes(q) || 
        w.email.toLowerCase().includes(q) ||
        w.role.toLowerCase().includes(q)
      );
    }

    this.filteredWorkers = temp.sort((a, b) => a.name.localeCompare(b.name));
    this.calculateMetrics();
  }

  updateStatus(worker: FarmWorker, newStatus: FarmWorker['status']): void {
    if (worker._id) {
      this.apiService.update<FarmWorker>('workers', worker._id, { status: newStatus }).subscribe(updated => {
        worker.status = newStatus;
        this.calculateMetrics();
      });
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newWorker = { 
      role: 'Field Hand',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      tasksAssigned: 0
    };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveWorker(): void {
    if (this.newWorker.name && this.newWorker.role) {
      const payload = {
        name: this.newWorker.name,
        role: this.newWorker.role,
        phone: this.newWorker.phone || 'N/A',
        email: this.newWorker.email || 'N/A',
        status: this.newWorker.status as FarmWorker['status'],
        joinDate: this.newWorker.joinDate || new Date().toISOString().split('T')[0],
        tasksAssigned: 0
      };
      
      this.apiService.create<FarmWorker>('workers', payload).subscribe(data => {
        this.workers.push(data);
        this.applyFilters();
        this.closeAddModal();
      });
    }
  }

  deleteWorker(id: string): void {
    this.apiService.delete('workers', id).subscribe(() => {
      this.workers = this.workers.filter(w => w._id !== id);
      this.applyFilters();
    });
  }
}
