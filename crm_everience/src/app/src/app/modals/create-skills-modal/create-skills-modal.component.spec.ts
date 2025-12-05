import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSkillsModalComponent } from './create-skills-modal.component';

describe('CreateSkillsModalComponent', () => {
  let component: CreateSkillsModalComponent;
  let fixture: ComponentFixture<CreateSkillsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSkillsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSkillsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
