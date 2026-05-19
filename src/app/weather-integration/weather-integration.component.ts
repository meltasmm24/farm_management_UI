import { Component, OnInit } from '@angular/core';

export interface WeatherDay {
  date: string;
  dayName: string;
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy' | 'Partly Cloudy';
  tempHigh: number;
  tempLow: number;
  humidity: number;
  windSpeed: number;
}

@Component({
  selector: 'app-weather-integration',
  templateUrl: './weather-integration.component.html',
  styleUrls: ['./weather-integration.component.css']
})
export class WeatherIntegrationComponent implements OnInit {
  currentWeather!: WeatherDay;
  forecast: WeatherDay[] = [];

  ngOnInit(): void {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    // Mock data for 7 days
    this.forecast = [
      {
        date: this.formatDate(today, 0),
        dayName: 'Today',
        condition: 'Sunny',
        tempHigh: 28,
        tempLow: 18,
        humidity: 45,
        windSpeed: 12
      },
      {
        date: this.formatDate(today, 1),
        dayName: days[(today.getDay() + 1) % 7],
        condition: 'Partly Cloudy',
        tempHigh: 26,
        tempLow: 17,
        humidity: 50,
        windSpeed: 15
      },
      {
        date: this.formatDate(today, 2),
        dayName: days[(today.getDay() + 2) % 7],
        condition: 'Rainy',
        tempHigh: 22,
        tempLow: 15,
        humidity: 75,
        windSpeed: 20
      },
      {
        date: this.formatDate(today, 3),
        dayName: days[(today.getDay() + 3) % 7],
        condition: 'Stormy',
        tempHigh: 20,
        tempLow: 14,
        humidity: 85,
        windSpeed: 35
      },
      {
        date: this.formatDate(today, 4),
        dayName: days[(today.getDay() + 4) % 7],
        condition: 'Cloudy',
        tempHigh: 23,
        tempLow: 15,
        humidity: 65,
        windSpeed: 10
      },
      {
        date: this.formatDate(today, 5),
        dayName: days[(today.getDay() + 5) % 7],
        condition: 'Sunny',
        tempHigh: 27,
        tempLow: 16,
        humidity: 50,
        windSpeed: 8
      },
      {
        date: this.formatDate(today, 6),
        dayName: days[(today.getDay() + 6) % 7],
        condition: 'Sunny',
        tempHigh: 29,
        tempLow: 18,
        humidity: 45,
        windSpeed: 12
      }
    ];

    this.currentWeather = this.forecast[0];
  }

  private formatDate(date: Date, offset: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getWeatherIcon(condition: string): string {
    switch (condition) {
      case 'Sunny': return '☀️';
      case 'Partly Cloudy': return '⛅';
      case 'Cloudy': return '☁️';
      case 'Rainy': return '🌧️';
      case 'Stormy': return '⛈️';
      default: return '🌡️';
    }
  }
}
