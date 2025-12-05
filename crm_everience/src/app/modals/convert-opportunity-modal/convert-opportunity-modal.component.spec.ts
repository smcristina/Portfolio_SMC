import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertOpportunityModalComponent } from './convert-opportunity-modal.component';

describe('ConvertOpportunityModalComponent', () => {
  let component: ConvertOpportunityModalComponent;
  let fixture: ComponentFixture<ConvertOpportunityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertOpportunityModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvertOpportunityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
