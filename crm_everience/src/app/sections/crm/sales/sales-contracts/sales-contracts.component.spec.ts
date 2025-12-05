import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesContractsComponent } from './sales-contracts.component';

describe('SalesContractsComponent', () => {
  let component: SalesContractsComponent;
  let fixture: ComponentFixture<SalesContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesContractsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
