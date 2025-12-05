import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsDataModalComponent } from './contracts-data-modal.component';

describe('ContractsDataModalComponent', () => {
  let component: ContractsDataModalComponent;
  let fixture: ComponentFixture<ContractsDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsDataModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractsDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
