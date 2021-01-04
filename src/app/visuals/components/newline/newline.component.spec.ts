import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlineComponent } from './newline.component';

describe('NewlineComponent', () => {
  let component: NewlineComponent;
  let fixture: ComponentFixture<NewlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
