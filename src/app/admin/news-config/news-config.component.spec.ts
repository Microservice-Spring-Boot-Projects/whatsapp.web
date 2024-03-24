import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsConfigComponent } from './news-config.component';

describe('NewsConfigComponent', () => {
  let component: NewsConfigComponent;
  let fixture: ComponentFixture<NewsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
