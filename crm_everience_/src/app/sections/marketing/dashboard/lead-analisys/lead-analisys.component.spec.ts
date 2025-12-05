import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAnalisysComponent } from './lead-analisys.component';

describe('LeadAnalisysComponent', () => {
  let component: LeadAnalisysComponent;
  let fixture: ComponentFixture<LeadAnalisysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadAnalisysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadAnalisysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
