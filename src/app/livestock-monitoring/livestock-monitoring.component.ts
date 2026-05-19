import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface Livestock {
  _id?: string;
  tagId: string;
  species: string;
  breed: string;
  ageMonths: number;
  weightKg: number;
  healthStatus: 'Healthy' | 'Sick' | 'Pregnant' | 'Under Observation';
  lastVaccination: string;
}

@Component({
  selector: 'app-livestock-monitoring',
  templateUrl: './livestock-monitoring.component.html',
  styleUrls: ['./livestock-monitoring.component.css']
})
export class LivestockMonitoringComponent implements OnInit {
  livestock: Livestock[] = [];
  filteredLivestock: Livestock[] = [];
  
  totalHeadCount: number = 0;
  sickCount: number = 0;
  pregnantCount: number = 0;

  searchQuery: string = '';
  speciesFilter: string = 'All';
  showAddModal: boolean = false;
  
  newAnimal: Partial<Livestock> = {
    species: 'Cattle',
    healthStatus: 'Healthy'
  };

  speciesOptions = ['Cattle', 'Poultry', 'Sheep', 'Pigs', 'Goats'];
  healthOptions = ['Healthy', 'Sick', 'Pregnant', 'Under Observation'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchLivestock();
  }

  fetchLivestock(): void {
    this.apiService.getAll<Livestock>('livestock').subscribe(data => {
      this.livestock = data;
      this.applyFilters();
    });
  }

  calculateMetrics(): void {
    this.totalHeadCount = this.livestock.length;
    this.sickCount = this.livestock.filter(a => a.healthStatus === 'Sick').length;
    this.pregnantCount = this.livestock.filter(a => a.healthStatus === 'Pregnant').length;
  }

  setSpeciesFilter(species: string): void {
    this.speciesFilter = species;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.livestock];
    
    // Filter by Species
    if (this.speciesFilter !== 'All') {
      temp = temp.filter(a => a.species === this.speciesFilter);
    }
    
    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(a => 
        a.tagId.toLowerCase().includes(q) || 
        a.breed.toLowerCase().includes(q) ||
        a.healthStatus.toLowerCase().includes(q)
      );
    }

    this.filteredLivestock = temp;
    this.calculateMetrics();
  }

  updateHealthStatus(animal: Livestock, newStatus: Livestock['healthStatus']): void {
    if (animal._id) {
      this.apiService.update<Livestock>('livestock', animal._id, { healthStatus: newStatus }).subscribe(updated => {
        animal.healthStatus = newStatus;
        this.calculateMetrics();
      });
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newAnimal = { 
      species: 'Cattle',
      healthStatus: 'Healthy',
      lastVaccination: new Date().toISOString().split('T')[0]
    };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveAnimal(): void {
    if (this.newAnimal.tagId && this.newAnimal.species && this.newAnimal.weightKg) {
      const payload = {
        tagId: this.newAnimal.tagId.toUpperCase(),
        species: this.newAnimal.species,
        breed: this.newAnimal.breed || 'Unknown',
        ageMonths: this.newAnimal.ageMonths || 0,
        weightKg: this.newAnimal.weightKg,
        healthStatus: this.newAnimal.healthStatus as Livestock['healthStatus'],
        lastVaccination: this.newAnimal.lastVaccination || new Date().toISOString().split('T')[0]
      };
      
      this.apiService.create<Livestock>('livestock', payload).subscribe(data => {
        this.livestock.push(data);
        this.applyFilters();
        this.closeAddModal();
      });
    }
  }

  deleteAnimal(id: string): void {
    this.apiService.delete('livestock', id).subscribe(() => {
      this.livestock = this.livestock.filter(a => a._id !== id);
      this.applyFilters();
    });
  }
}
