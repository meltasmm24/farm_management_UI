import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface Transaction {
  _id?: string;
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
}

@Component({
  selector: 'app-financial-tracking',
  templateUrl: './financial-tracking.component.html',
  styleUrls: ['./financial-tracking.component.css']
})
export class FinancialTrackingComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  totalRevenue: number = 0;
  totalExpenses: number = 0;
  netBalance: number = 0;

  filterType: 'All' | 'Income' | 'Expense' = 'All';
  showAddModal: boolean = false;
  
  newTransaction: Partial<Transaction> = {
    type: 'Expense',
    category: 'Supplies'
  };

  categories = ['Sales', 'Maintenance', 'Payroll', 'Supplies', 'Fuel', 'Other'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.apiService.getAll<Transaction>('transactions').subscribe(data => {
      this.transactions = data;
      this.applyFilter();
    });
  }

  calculateTotals(): void {
    this.totalRevenue = this.transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, current) => sum + current.amount, 0);
      
    this.totalExpenses = this.transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, current) => sum + current.amount, 0);

    this.netBalance = this.totalRevenue - this.totalExpenses;
  }

  setFilter(type: 'All' | 'Income' | 'Expense'): void {
    this.filterType = type;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterType === 'All') {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(t => t.type === this.filterType);
    }
    // Sort by date descending
    this.filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.calculateTotals();
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newTransaction = { 
      type: 'Expense', 
      category: 'Supplies', 
      date: new Date().toISOString().split('T')[0],
      amount: 0
    };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveTransaction(): void {
    if (this.newTransaction.description && this.newTransaction.amount && this.newTransaction.amount > 0) {
      const payload = {
        description: this.newTransaction.description,
        amount: this.newTransaction.amount,
        type: this.newTransaction.type as any,
        category: this.newTransaction.category as any,
        date: this.newTransaction.date as any
      };
      
      this.apiService.create<Transaction>('transactions', payload).subscribe(data => {
        this.transactions.push(data);
        this.applyFilter();
        this.closeAddModal();
      });
    }
  }

  deleteTransaction(id: string): void {
    this.apiService.delete('transactions', id).subscribe(() => {
      this.transactions = this.transactions.filter(t => t._id !== id);
      this.applyFilter();
    });
  }
}
