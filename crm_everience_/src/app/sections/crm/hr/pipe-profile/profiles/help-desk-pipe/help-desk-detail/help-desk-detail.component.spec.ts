import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskDetailComponent } from './help-desk-detail.component';

describe('HelpDeskDetailComponent', () => {
  let component: HelpDeskDetailComponent;
  let fixture: ComponentFixture<HelpDeskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpDeskDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpDeskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
