import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertRequestModalComponent } from './convert-request-modal.component';

describe('ConvertRequestModalComponent', () => {
  let component: ConvertRequestModalComponent;
  let fixture: ComponentFixture<ConvertRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertRequestModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvertRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
