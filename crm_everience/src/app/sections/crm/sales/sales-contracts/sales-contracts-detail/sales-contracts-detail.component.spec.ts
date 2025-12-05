import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesContractsDetailComponent } from './sales-contracts-detail.component';

describe('SalesContractsDetailComponent', () => {
  let component: SalesContractsDetailComponent;
  let fixture: ComponentFixture<SalesContractsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesContractsDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesContractsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
