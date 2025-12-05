import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPipeComponent } from './system-pipe.component';

describe('SystemPipeComponent', () => {
  let component: SystemPipeComponent;
  let fixture: ComponentFixture<SystemPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemPipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
