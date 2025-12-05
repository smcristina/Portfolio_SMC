import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeProfileComponent } from './pipe-profile.component';

describe('PipeProfileComponent', () => {
  let component: PipeProfileComponent;
  let fixture: ComponentFixture<PipeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipeProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PipeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
