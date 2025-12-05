import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertLeadModalComponent } from './convert-lead-modal.component';

describe('ConvertLeadModalComponent', () => {
  let component: ConvertLeadModalComponent;
  let fixture: ComponentFixture<ConvertLeadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertLeadModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvertLeadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
