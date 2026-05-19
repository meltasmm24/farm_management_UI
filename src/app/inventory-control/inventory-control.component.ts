import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface InventoryItem {
  _id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
}

@Component({
  selector: 'app-inventory-control',
  templateUrl: './inventory-control.component.html',
  styleUrls: ['./inventory-control.component.css']
})
export class InventoryControlComponent implements OnInit {
  inventory: InventoryItem[] = [];
  filteredInventory: InventoryItem[] = [];
  
  totalItems: number = 0;
  lowStockCount: number = 0;
  outOfStockCount: number = 0;

  searchQuery: string = '';
  categoryFilter: string = 'All';
  showAddModal: boolean = false;
  
  newItem: Partial<InventoryItem> = {
    category: 'Seeds',
    unit: 'Bags'
  };

  categories = ['Chemicals', 'Seeds', 'Tools', 'Feed', 'Maintenance', 'Fuel'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.apiService.getAll<InventoryItem>('inventory').subscribe(data => {
      this.inventory = data;
      this.applyFilters();
    });
  }

  calculateMetrics(): void {
    this.totalItems = this.inventory.length;
    this.lowStockCount = this.inventory.filter(i => i.quantity > 0 && i.quantity <= i.threshold).length;
    this.outOfStockCount = this.inventory.filter(i => i.quantity === 0).length;
  }

  setCategoryFilter(category: string): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = [...this.inventory];
    
    // Filter by Category
    if (this.categoryFilter !== 'All') {
      temp = temp.filter(i => i.category === this.categoryFilter);
    }
    
    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.category.toLowerCase().includes(q)
      );
    }

    // Sort alphabetically by name
    this.filteredInventory = temp.sort((a, b) => a.name.localeCompare(b.name));
    this.calculateMetrics();
  }

  getStatus(item: InventoryItem): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    if (item.quantity === 0) return 'Out of Stock';
    if (item.quantity <= item.threshold) return 'Low Stock';
    return 'In Stock';
  }

  updateQuantity(item: InventoryItem, amount: number): void {
    const newQuantity = item.quantity + amount;
    if (newQuantity >= 0 && item._id) {
      this.apiService.update<InventoryItem>('inventory', item._id, { quantity: newQuantity }).subscribe(updated => {
        item.quantity = updated.quantity;
        this.calculateMetrics(); // status might have changed
      });
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newItem = { 
      category: 'Seeds',
      unit: 'Bags',
      quantity: 0,
      threshold: 10
    };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveItem(): void {
    if (this.newItem.name && this.newItem.quantity !== undefined && this.newItem.threshold !== undefined) {
      const payload = {
        name: this.newItem.name,
        category: this.newItem.category as string,
        quantity: this.newItem.quantity,
        unit: this.newItem.unit as string,
        threshold: this.newItem.threshold
      };
      
      this.apiService.create<InventoryItem>('inventory', payload).subscribe(data => {
        this.inventory.push(data);
        this.applyFilters();
        this.closeAddModal();
      });
    }
  }

  deleteItem(id: string): void {
    this.apiService.delete('inventory', id).subscribe(() => {
      this.inventory = this.inventory.filter(i => i._id !== id);
      this.applyFilters();
    });
  }
}
