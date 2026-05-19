import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { WorkersComponent } from './workers/workers.component';
import { FieldManagementComponent } from './field-management/field-management.component';
import { FinancialTrackingComponent } from './financial-tracking/financial-tracking.component';
import { InventoryControlComponent } from './inventory-control/inventory-control.component';
import { LivestockMonitoringComponent } from './livestock-monitoring/livestock-monitoring.component';
import { TaskSchedulingComponent } from './task-scheduling/task-scheduling.component';
import { WeatherIntegrationComponent } from './weather-integration/weather-integration.component';

const routes: Routes = [
  {path:"", redirectTo:"/dashboard", pathMatch:"full" },
  {path:"dashboard", component:DashboardComponent},
  {path:"field-management", component:FieldManagementComponent},
  {path:"financial-tracking", component:FinancialTrackingComponent},
  {path:"inventory-control", component:InventoryControlComponent},
  {path:"livestock-monitoring", component:LivestockMonitoringComponent},
  {path:"task-scheduling", component:TaskSchedulingComponent},
  {path:"weather-integration", component:WeatherIntegrationComponent},
  {path:"worker-list", component:WorkersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
