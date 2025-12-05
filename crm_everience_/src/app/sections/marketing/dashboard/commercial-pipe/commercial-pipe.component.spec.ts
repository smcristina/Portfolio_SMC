import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialPipeComponent } from './commercial-pipe.component';

describe('CommercialPipeComponent', () => {
  let component: CommercialPipeComponent;
  let fixture: ComponentFixture<CommercialPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialPipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommercialPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
