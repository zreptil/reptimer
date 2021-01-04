import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeLocalComponent } from './date-time-local.component';

describe('DateTimeLocalComponent', () => {
  let component: DateTimeLocalComponent;
  let fixture: ComponentFixture<DateTimeLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateTimeLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
