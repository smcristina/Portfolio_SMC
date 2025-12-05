import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperPipeComponent } from './developer-pipe.component';

describe('DeveloperPipeComponent', () => {
  let component: DeveloperPipeComponent;
  let fixture: ComponentFixture<DeveloperPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperPipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeveloperPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
