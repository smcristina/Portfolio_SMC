import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyEmployeeModalComponent } from './modify-employee-modal.component';

describe('ModifyEmployeeModalComponent', () => {
  let component: ModifyEmployeeModalComponent;
  let fixture: ComponentFixture<ModifyEmployeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyEmployeeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
