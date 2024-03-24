import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessValuesComponent } from './process-values.component';

describe('ProcessValuesComponent', () => {
  let component: ProcessValuesComponent;
  let fixture: ComponentFixture<ProcessValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
