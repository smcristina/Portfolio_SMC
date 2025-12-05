import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContactModalComponent } from './create-contact-modal.component';

describe('CreateContactModalComponent', () => {
  let component: CreateContactModalComponent;
  let fixture: ComponentFixture<CreateContactModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContactModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
