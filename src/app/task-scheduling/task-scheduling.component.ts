import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface FarmTask {
  _id?: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
}

@Component({
  selector: 'app-task-scheduling',
  templateUrl: './task-scheduling.component.html',
  styleUrls: ['./task-scheduling.component.css']
})
export class TaskSchedulingComponent implements OnInit {
  tasks: FarmTask[] = [];
  
  todoTasks: FarmTask[] = [];
  inProgressTasks: FarmTask[] = [];
  completedTasks: FarmTask[] = [];

  showAddModal: boolean = false;
  
  newTask: Partial<FarmTask> = {
    priority: 'Medium',
    status: 'To Do'
  };

  workersList = ['John Doe', 'Alice Smith', 'Bob Johnson', 'Maria Garcia', 'Unassigned'];
  priorityLevels = ['Low', 'Medium', 'High'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.apiService.getAll<FarmTask>('tasks').subscribe(data => {
      this.tasks = data;
      this.organizeTasks();
    });
  }

  organizeTasks(): void {
    // Distribute tasks into columns based on their status
    this.todoTasks = this.tasks.filter(t => t.status === 'To Do');
    this.inProgressTasks = this.tasks.filter(t => t.status === 'In Progress');
    this.completedTasks = this.tasks.filter(t => t.status === 'Completed');
  }

  updateTaskStatus(task: FarmTask, newStatus: FarmTask['status']): void {
    if (task._id) {
      this.apiService.update<FarmTask>('tasks', task._id, { status: newStatus }).subscribe(updated => {
        task.status = newStatus;
        this.organizeTasks();
      });
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newTask = { 
      priority: 'Medium',
      status: 'To Do',
      assignee: 'Unassigned',
      dueDate: new Date().toISOString().split('T')[0]
    };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveTask(): void {
    if (this.newTask.title && this.newTask.assignee) {
      const payload = {
        title: this.newTask.title,
        description: this.newTask.description || '',
        assignee: this.newTask.assignee,
        priority: this.newTask.priority as FarmTask['priority'],
        status: this.newTask.status as FarmTask['status'],
        dueDate: this.newTask.dueDate || new Date().toISOString().split('T')[0]
      };
      
      this.apiService.create<FarmTask>('tasks', payload).subscribe(data => {
        this.tasks.push(data);
        this.organizeTasks();
        this.closeAddModal();
      });
    }
  }

  deleteTask(id: string): void {
    this.apiService.delete('tasks', id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t._id !== id);
      this.organizeTasks();
    });
  }
}
