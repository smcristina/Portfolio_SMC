import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskPipeComponent } from './help-desk-pipe.component';

describe('HelpDeskPipeComponent', () => {
  let component: HelpDeskPipeComponent;
  let fixture: ComponentFixture<HelpDeskPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpDeskPipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpDeskPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
