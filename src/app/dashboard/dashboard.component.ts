import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  greeting: string = 'Good Morning';
  currentDate: string = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  kpiStats = [
    { label: 'Active Fields', value: '24', icon: 'bi-grid-1x2', trend: '+2 this month', color: '#28b75ef0' },
    { label: 'Livestock Count', value: '1,420', icon: 'bi-bug', trend: '+15 newborn', color: '#eab308' },
    { label: 'Active Workers', value: '38', icon: 'bi-people', trend: 'Online', color: '#3b82f6' },
    { label: 'Tasks Pending', value: '12', icon: 'bi-clipboard-check', trend: '-3 since yesterday', color: '#ef4444' }
  ];

  recentActivities = [
    { title: 'Irrigation System activated', location: 'North Field A', time: '10 mins ago', type: 'system' },
    { title: 'Harvesting completed', location: 'East Field C', time: '2 hours ago', type: 'success' },
    { title: 'Low moisture alert', location: 'South Field B', time: '5 hours ago', type: 'warning' },
    { title: 'Routine maintenance', location: 'Tractor Bay 1', time: '1 day ago', type: 'info' }
  ];

  upcomingTasks = [
    { title: 'Fertilize Corn Fields', assign: 'John Doe', date: 'Today, 2:00 PM' },
    { title: 'Veterinary Checkup', assign: 'Dr. Smith', date: 'Tomorrow, 9:00 AM' },
    { title: 'Warehouse Inventory', assign: 'Jane Doe', date: 'Wed, 10:00 AM' }
  ];

  quickLinks = [
    { title: 'Field Management', icon: '🌾', route: '/field-management', color: '#16a34a' },
    { title: 'Livestock Monitoring', icon: '🐄', route: '/livestock-monitoring', color: '#ea580c' },
    { title: 'Inventory Control', icon: '📦', route: '/inventory-control', color: '#0284c7' },
    { title: 'Task Scheduling', icon: '📋', route: '/task-scheduling', color: '#7c3aed' },
    { title: 'Financial Tracking', icon: '💰', route: '/financial-tracking', color: '#ca8a04' },
    { title: 'Weather Integration', icon: '⛅', route: '/weather-integration', color: '#0ea5e9' },
    { title: 'Worker Directory', icon: '👥', route: '/worker-list', color: '#dc2626' }
  ];

  ngOnInit(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }
}
