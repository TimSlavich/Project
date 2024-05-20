import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { Sensor } from '../Interfaces/Sensor';
import { SensorService } from '../Services/Sensor.service';
import { SensorOption } from '../Interfaces/SensorOption';
import { PlantStatusData } from '../Interfaces/PlantStatus';
import { AuthorizedService } from '../Services/Authorized.service';

@Component({
  selector: 'app-sensor-monitoring',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sensor-monitoring.component.html',
  styleUrls: ['./sensor-monitoring.component.css']
})
export class SensorMonitoringComponent implements AfterViewInit {
  disabled: boolean = false;
  noWrite: boolean = true;
  sensors: SensorOption[] = [];
  sensorOptions: SensorOption[] = [];
  plantStatusData: PlantStatusData[] = [];
  @ViewChild('LineCanvas') private LineCanvas?: ElementRef;
  lineChart: any;

  constructor(
    private http: HttpClient,
    private sensorService: SensorService,
    private authorizedService: AuthorizedService,
  ) {
    Chart.register(...registerables);
  }
  ngAfterViewInit() {
    const noWriteStored = localStorage.getItem('noWrite') || 'false';
    const selectedSensorsString = sessionStorage.getItem('selectedSensors');
    if (selectedSensorsString) {
      this.sensors = JSON.parse(selectedSensorsString);
      this.noWrite = JSON.parse(noWriteStored)
    }
    this.loadSensorData();
  }
  loadSensorData(): void {
    this.sensorService.getSensorsByFarmerId(this.authorizedService.UserID).subscribe({
      next: response => {
        if (response.length === 0) {
          this.sensorOptions = [{
            TypeName: 'Тестовий датчик',
            value: '0',
            Timestamp: new Date()
          }];
          alert('Ви в тестовому режимі');
        } else {
          if (this.noWrite == true) {
            this.sensorOptions = response.map((sensor: Sensor) => ({
              TypeName: sensor.TypeName,
              value: sensor.Value,
              Timestamp: sensor.Timestamp
            }));
            this.noWrite = false;
            localStorage.setItem('selectedSensors', JSON.stringify(this.noWrite));
          }
          else {
            if (this.noWrite == false) {
              this.sensors = response.map((sensor: Sensor) => ({
                TypeName: sensor.TypeName,
                value: sensor.Value,
                Timestamp: sensor.Timestamp
              }));
              console.log(this.sensors);
            }
          }
        }
      },
      error: error => {
        console.error('Error retrieving sensors', error);
      }
    });

    this.sensorService.getPlantStatusFarmerId(this.authorizedService.UserID).subscribe({
      next: response => {
        this.plantStatusData = response.map((PlantData: PlantStatusData) => ({
          name: PlantData.name,
          ripeness: PlantData.ripeness,
          growth: PlantData.growth,
          value: PlantData.value
        }));
        this.buildChart();
      },
      error: error => {
        console.error('Error retrieving plant status', error);
      }
    });
  }
  refreshView(): void {
    this.loadSensorData();
  }
  generateGrowthData() {
    const growthData = [];
    for (let i = 0; i < 12; i++) {
      growthData.push(Math.floor(Math.random() * 100));
    }
    return growthData;
  }
  buildChart() {
    const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const colorPalette = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#795548', '#9C27B0', '#FFC107', '#00BCD4', '#607D8B', '#FF5722', '#8BC34A', '#03A9F4'];
    if (this.lineChart instanceof Chart) {
      this.lineChart.destroy();
    }
    this.lineChart = new Chart(this.LineCanvas?.nativeElement, {
      type: 'bar',
      data: {
        labels: months,
        datasets: this.plantStatusData.map((plant, index) => ({
          label: plant.name,
          data: this.generateGrowthData(),
          fill: false,
          borderColor: colorPalette[index % colorPalette.length],
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: colorPalette[index % colorPalette.length],
          pointBorderColor: '#fff',
          pointHoverRadius: 8,
        })),
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
            grid: {
              color: '#ccc',
            },
          },
          y: {
            ticks: {
              color: 'white',
            },
            grid: {
              color: '#ccc',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
            }
          },
        },
      },
    });
  }
  generateRandomData() {
    return Math.floor(Math.random() * 100);
  }
  addSensor(sensorValue: string) {
    if (this.sensorOptions.length === 0) {
      alert('У вас більше немає датчиків');
      return;
    }
    const sensorName = this.sensorOptions.find(option => option.value === sensorValue,)?.TypeName || 'Невідомий датчик';
    this.sensors.push({ TypeName: sensorName, value: sensorValue, Timestamp: new Date() });

    sessionStorage.setItem('selectedSensors', JSON.stringify(this.sensors));

    const sensorIndex = this.sensorOptions.findIndex(option => option.TypeName === sensorName);
    if (sensorIndex !== -1) {
      this.sensorOptions.splice(sensorIndex, 1);
    }
  }
  removeSensor(i: number) {
    this.sensorOptions.push({ TypeName: this.sensors[i].TypeName, value: this.sensors[i].value, Timestamp: this.sensors[i].Timestamp });
    this.sensors.splice(i, 1);
    this.disabled = false;
  }
  toggleWatering(sensor: SensorOption): void {
    let newValue = (sensor.value === 'полив виконується') ? 'полив вимкнений' : 'полив виконується';

    this.http.put(`http://localhost:5000/sensors/${encodeURIComponent(sensor.TypeName)}`, { newValue })
      .subscribe(
        (response) => {
          console.log('Датчик поливу оновлено успішно:', response);
          sensor.value = newValue;
        },
        (error) => {
          console.error('Помилка під час оновлення датчика поливу:', error);
        }
      );
  }
}
