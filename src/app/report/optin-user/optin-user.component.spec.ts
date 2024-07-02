import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptinUserComponent } from './optin-user.component';

describe('OptinUserComponent', () => {
  let component: OptinUserComponent;
  let fixture: ComponentFixture<OptinUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptinUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptinUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
