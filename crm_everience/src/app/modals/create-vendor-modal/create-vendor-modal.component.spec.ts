import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVerdorModalComponent } from './create-vendor-modal.component';

describe('CreateVerdorModalComponent', () => {
  let component: CreateVerdorModalComponent;
  let fixture: ComponentFixture<CreateVerdorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVerdorModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVerdorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
