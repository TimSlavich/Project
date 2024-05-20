import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMonitoringComponent } from './sensor-monitoring.component';

describe('SensorMonitoringComponent', () => {
  let component: SensorMonitoringComponent;
  let fixture: ComponentFixture<SensorMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorMonitoringComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
