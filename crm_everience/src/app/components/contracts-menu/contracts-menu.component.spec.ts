import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMenuComponent } from './contracts-menu.component';

describe('ContractsMenuComponent', () => {
  let component: ContractsMenuComponent;
  let fixture: ComponentFixture<ContractsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
