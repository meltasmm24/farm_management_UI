import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardModule } from './dashboard/dashboard.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LivestockMonitoringComponent } from './livestock-monitoring/livestock-monitoring.component';
import { WeatherIntegrationComponent } from './weather-integration/weather-integration.component';
import { FinancialTrackingComponent } from './financial-tracking/financial-tracking.component';
import { TaskSchedulingComponent } from './task-scheduling/task-scheduling.component';
import { FieldManagementComponent } from './field-management/field-management.component';
import { InventoryControlComponent } from './inventory-control/inventory-control.component';
import { WorkersModule } from './workers/workers.module';

@NgModule({
  declarations: [
    AppComponent,
    LivestockMonitoringComponent,
    WeatherIntegrationComponent,
    FinancialTrackingComponent,
    TaskSchedulingComponent,
    FieldManagementComponent,
    InventoryControlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DashboardModule,
    WorkersModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
